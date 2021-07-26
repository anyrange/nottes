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
            page: { type: 'number', minimum: 1, default: 1 },
            range: { type: 'number', minimum: 3, default: 10 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: { $ref: 'paste#' } },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
      preValidation: [fastify.authenticate, fastify.requireAuth],
    },
    async (request, reply) => {
      const { range, page } = request.query

      const pastes = await fastify.db.Paste.find({ author: request._id }, 'title date id code -_id')
        .sort('-date')
        .skip((page - 1) * range)
        .limit(range)
        .lean()

      console.log(request._id)
      reply.send({ pastes })
    }
  )
}
