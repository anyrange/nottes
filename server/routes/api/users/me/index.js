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
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['users'],
      },
    },
    async (request, reply) => {
      reply.send({ authenticated: !!request.session.get('_id') })
    }
  )
}
