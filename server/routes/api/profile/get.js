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
              avatar: { type: 'string' },
              username: { type: 'string' },
            },
          },
        },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const user = await fastify.db.User.findOne({ _id: request._id }, 'avatar email username')
      reply.send({
        avatar: user.avatar || '',
        email: user.email || '',
        username: user.username || '',
        statusCode: 200,
      })
    }
  )
}
