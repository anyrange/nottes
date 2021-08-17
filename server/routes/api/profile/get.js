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
              platform: { type: 'string' },
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
        request.session.get('_id'),
        'avatar email username password registered platform'
      ).lean()

      if (!user) return reply.code(404).send({ message: 'User not found' })

      user.hasPassword = !!user.password

      reply.send(user)
    }
  )
}
