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
    async (conn, request) => {
      const { range } = request.query

      const stringify = fastJson({
        type: 'object',
        properties: {
          event: { type: 'string' },
          paste: fastify.getSchema('paste'),
        },
      })

      const pastes = await fastify.db.Paste.find({ visibility: 'public' }, 'title author date')
        .sort('-date')
        .limit(range)
        .populate('author')
        .lean()

      pastes.reverse().forEach((paste) => conn.socket.send(stringify({ event: 'insert', paste })))

      const watcher = fastify.db.Paste.watch([{ $match: { operationType: { $in: ['insert', 'delete'] } } }])

      watcher.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            conn.socket.send(stringify({ event: data.operationType, paste: { _id: data.documentKey._id } }))
            break
          case 'insert': {
            if (data.fullDocument.visibility !== 'public') break

            const paste = await fastify.db.Paste.findById(data.fullDocument._id, 'title author date')
              .populate('author')
              .lean()

            conn.socket.send(stringify({ event: data.operationType, paste }))
          }
        }
      })

      conn.socket.on('close', () => watcher.driverChangeStream.close())
    }
  )
}
