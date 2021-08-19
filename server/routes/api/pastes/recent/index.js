'use strict'

const fastJson = require('fast-json-stringify')
const { ObjectId } = require('mongodb')

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          range: { type: 'number', minimum: 3, default: 12 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            pastes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  date: { type: 'string', format: 'datetime' },
                  author: { $ref: 'user#' },
                  _id: { type: 'string' },
                },
              },
            },
            statusCode: { type: 'number' },
          },
        },
      },
      tags: ['paste'],
    },
    handler: async (request, reply) => {
      const { range } = request.query
      const pastes = await fastify.db.Paste.find({ visibility: { $in: ['public', 'shared'] } }, 'title author date')
        .sort('-date')
        .limit(range)
        .populate('author')
        .lean()

      reply.send({ pastes })
    },
    wsHandler: async (conn, request) => {
      const stringify = fastJson({
        type: 'object',
        properties: {
          event: { type: 'string' },
          paste: fastify.getSchema('paste'),
        },
      })

      const watcher = fastify.db.Paste.watch([
        {
          $match: {
            $or: [
              { 'fullDocument.author': ObjectId(request.session.get('_id')) },
              {
                'fullDocument.visibility': { $in: ['public', 'shared'] },
              },
              { operationType: { $in: ['delete', 'update'] } },
            ],
          },
        },
      ])

      watcher.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            conn.socket.send(JSON.stringify({ event: data.operationType, paste: data.documentKey }))
            break
          case 'insert':
          case 'update': {
            const paste = await fastify.db.Paste.findById(data.documentKey._id, 'title author date visibility')
              .populate('author')
              .lean()

            conn.socket.send(stringify({ event: data.operationType, paste }))
          }
        }
      })

      conn.socket.on('close', () => watcher.driverChangeStream.close())
    },
  })
}
