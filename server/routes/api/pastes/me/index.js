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
        required: ['event'],
        properties: {
          event: { type: 'string' },
          paste: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              date: { type: 'string', format: 'datetime' },
              _id: { type: 'string' },
            },
          },
          message: { type: 'string' },
        },
      })

      if (!request.cookies.accessToken) {
        conn.socket.send(stringify({ event: 'error', message: 'Unauthorized' }))
        conn.end()
        return
      }

      const _id = await fastify.verifyToken(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET).catch((e) => {
        if (e.code !== 403) {
          conn.socket.send(stringify({ event: 'error', message: 'Authorization error occured' }))
          throw e
        }
        conn.socket.send(stringify({ event: 'error', message: 'Token expired' }))
      })
      if (!_id) return conn.end()

      const pastes = await fastify.db.Paste.find({ author: _id }, 'title date').sort('-date').limit(range).lean()

      pastes.reverse().forEach((paste) => conn.socket.send(stringify({ event: 'insert', paste })))

      const watcher = fastify.db.Paste.watch([{ $match: { operationType: { $in: ['insert', 'delete'] } } }])

      watcher.on('change', async (data) => {
        switch (data.operationType) {
          case 'delete':
            conn.socket.send(stringify({ event: data.operationType, paste: { _id: data.documentKey._id } }))
            break
          case 'insert': {
            const paste = data.fullDocument
            if (String(paste.author) !== _id) break

            conn.socket.send(
              stringify({
                event: data.operationType,
                paste,
              })
            )
          }
        }
      })

      conn.socket.on('close', () => watcher.driverChangeStream.close())
    }
  )
}
