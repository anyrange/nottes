'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              authenticated: { type: 'boolean' },
              tokenExpired: { type: 'boolean' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['users'],
      },
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { isAuthenticated, tokenExpired } = request
      reply.send({ authenticated: isAuthenticated, tokenExpired })
    }
  )
}
