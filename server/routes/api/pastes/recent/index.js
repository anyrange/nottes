'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
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
    async (request, reply) => {
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

      pastes.forEach((paste) => reply.sse({ event: 'paste', data: paste }))

      const inserts = fastify.db.Paste.watch([{ $match: { operationType: 'insert' } }])

      inserts.on('change', async (data) => {
        if (data.fullDocument.visibility === 'public') {
          const paste = await fastify.db.Paste.findById(data.fullDocument._id, 'title author id date -_id')
            .populate('author', 'username avatar -_id')
            .lean()

          reply.sse({ event: 'paste', data: paste })
        }
      })

      request.socket.on('close', () => inserts.driverChangeStream.close())
    }
  )
}
