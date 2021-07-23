'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      websocket: true,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            range: { type: 'number', minimum: 3 },
          },
        },
        tags: ['paste'],
      },
    },
    async (connection, request) => {
      const range = request.query.range || 12

      const pastes = await fastify.db.Paste.find({ visibility: 'public' }, 'title author id date -_id')
        .sort('date')
        .limit(range)
        .populate('author', 'username avatar -_id')
        .lean()

      pastes.forEach((paste) => {
        if (paste.author) return
        paste.author = { username: 'Guest', avatar: '' }
      })

      pastes.forEach((paste) => connection.socket.send(JSON.stringify(paste)))

      const inserts = fastify.db.Paste.watch([{ $match: { operationType: 'insert' } }])

      inserts.on('change', async (data) => {
        if (data.fullDocument.visibility === 'public') {
          const paste = await fastify.db.Paste.findById(data.fullDocument._id, 'title author id date -_id')
            .populate('author', 'username avatar -_id')
            .lean()

          if (!paste.author) paste.author = { username: 'Guest', avatar: '' }
          connection.socket.send(JSON.stringify(paste))
        }
      })

      connection.socket.on('close', () => inserts.driverChangeStream.close())
    }
  )
}
