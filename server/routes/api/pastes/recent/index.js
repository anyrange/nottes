'use strict'

const fastJson = require('fast-json-stringify')

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      websocket: true,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            range: { type: 'number', minimum: 3, default: 12 },
          },
        },
        tags: ['paste'],
      },
    },
    async (connection, request) => {
      const { range } = request.query

      const pastes = await fastify.db.Paste.find({ visibility: 'public' }, 'title author id date')
        .sort('-date')
        .limit(range)
        .populate('author')
        .lean()

      const stringify = fastJson({
        type: 'object',
        properties: { event: { type: 'string' }, paste: fastify.getSchema('paste') },
      })

      pastes.reverse().forEach((paste) => connection.socket.send(stringify({ event: 'insert', paste })))

      const inserts = fastify.db.Paste.watch([{ $match: { operationType: { $in: ['insert', 'delete'] } } }])

      inserts.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            connection.socket.send(stringify({ event: data.operationType, paste: { _id: data.documentKey._id } }))
            break
          case 'insert': {
            if (data.fullDocument.visibility !== 'public') break

            const paste = await fastify.db.Paste.findById(data.fullDocument._id, 'title author date')
              .populate('author')
              .lean()

            connection.socket.send(stringify({ event: data.operationType, paste }))
            break
          }
        }
      })

      connection.socket.on('close', () => inserts.driverChangeStream.close())
    }
  )
}
