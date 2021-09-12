'use strict'

const bcrypt = require('bcrypt')
const fastJson = require('fast-json-stringify')

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
      querystring: {
        type: 'object',
        properties: { password: { type: 'string' } },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            paste: { $ref: 'paste#' },
            statusCode: { type: 'number' },
          },
        },
      },
      tags: ['paste'],
    },
    handler: async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id)
        .populate('author')
        .populate({ path: 'contributors', populate: { path: 'contributors' } })
        .lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (
        paste.visibility === 'private' &&
        request.session.get('_id') !== String(paste.author._id) &&
        request.session.get('role') !== 'admin'
      ) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      if (paste.content) paste.content = fastify.decrypt(paste.content)

      const requestIp = request.ips[request.ips.length - 1]

      if (!paste.views.length || !paste.views.find((ip) => ip === requestIp)) {
        await fastify.db.Paste.updateOne({ _id: request.params.id }, { $push: { views: requestIp } })
      }

      paste.views = paste.views.length

      reply.send({ paste })
    },
    wsHandler: async (conn, request) => {
      const paste = await fastify.db.Paste.findById(request.params.id)
        .populate('author')
        .populate({ path: 'contributors', populate: { path: 'contributors' } })
        .lean()

      if (!paste) return conn.socket.send(JSON.stringify({ event: 'error', message: 'Paste not found' }))

      if (paste.visibility === 'private' && request.session.get('_id') !== String(paste.author._id)) {
        return conn.socket.send(JSON.stringify({ event: 'error', message: 'Private paste' }))
      }

      if (paste.password && !request.query.password)
        return conn.socket.send(JSON.stringify({ event: 'error', message: 'Password required' }))
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return conn.socket.send(JSON.stringify({ event: 'error', message: 'Wrong password' }))

      const watcher = fastify.db.Paste.watch([{ $match: { 'documentKey._id': request.params.id } }])

      watcher.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            conn.socket.send(JSON.stringify({ event: data.operationType, paste: data.documentKey }))
            break
          case 'insert':
          case 'update': {
            const stringify = fastJson({
              type: 'object',
              properties: {
                event: { type: 'string' },
                paste: fastify.getSchema('paste'),
              },
            })

            const paste = await fastify.db.Paste.findById(data.documentKey._id)
              .populate('author')
              .populate({ path: 'contributors', populate: { path: 'contributors' } })
              .lean()

            if (paste.content) paste.content = fastify.decrypt(paste.content)

            paste.views = paste.views.length
            conn.socket.send(stringify({ event: data.operationType, paste }))
          }
        }
      })

      conn.socket.on('close', () => watcher.driverChangeStream.close())
    },
  })
}
