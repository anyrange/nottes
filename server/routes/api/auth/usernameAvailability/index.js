'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        query: {
          type: 'object',
          required: ['username'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              available: { type: 'boolean' },
            },
          },
        },
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const { username } = request.query
      const res = await fastify.db.User.findOne({ username })

      reply.send({ statusCode: 200, available: !res })
    }
  )
}
