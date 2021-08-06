'use strict'

const fastJson = require('fast-json-stringify')

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
      const pastes = await fastify.db.Paste.find({ visibility: 'public' }, 'title author date')
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

      const watcher = fastify.db.Paste.watch([{ $match: { operationType: { $in: ['insert', 'delete'] } } }])

      watcher.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            conn.socket.send(JSON.stringify({ event: data.operationType, paste: { _id: data.documentKey._id } }))
            break
          case 'insert': {
            const doc = data.fullDocument

            if (doc.visibility !== 'public' && request.session.get('_id') !== String(doc.author)) break
            const paste = await fastify.db.Paste.findById(doc._id, 'title author date').populate('author').lean()

            conn.socket.send(stringify({ event: data.operationType, paste }))
          }
        }
      })

      conn.socket.on('close', () => watcher.driverChangeStream.close())
    },
  })
}
