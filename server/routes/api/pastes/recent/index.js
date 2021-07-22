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
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: fastify.getSchema('paste') },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const range = request.query.range || 12

      const pastes = await fastify.db.Paste.find({ visibility: 'public' }, 'title author id date -_id')
        .sort('-date')
        .limit(range)
        .populate('author')
        .lean()

      pastes.forEach((paste) => {
        if (!paste.author) paste.author = { username: 'Guest', avatar: '' }
      })

      reply.send({ pastes })
    }
  )
}
