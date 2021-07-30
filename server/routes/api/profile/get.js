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
              email: { type: 'string' },
              avatar: { type: 'string', default: '' },
              username: { type: 'string' },
              hasPassword: { type: 'boolean' },
              registered: { type: 'string', format: 'datetime' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const user = await fastify.db.User.findById(
        request.session._id,
        'avatar email username password registered'
      ).lean()
      user.hasPassword = !!user.password

      reply.send(user)
    }
  )
}
