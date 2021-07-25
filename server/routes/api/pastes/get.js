'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        description: 'Archive',
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 },
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
      const range = request.query.range || 10
      const page = request.query.page - 1 || 0

      const pastes = await fastify.db.Paste.find({ visibility: { $ne: 'private' } }, 'title date id code -_id')
        .sort('-date')
        .skip(page * range)
        .limit(range)
        .lean()

      reply.send({ pastes })
    }
  )
}
