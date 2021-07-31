'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
            password: { type: 'string', minLength: 8, maxLength: 20 },
          },
          required: ['username', 'password'],
        },
        response: {
          200: { $ref: 'user#' },
        },
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const { username, password } = request.body

      const user = await fastify.db.User.findOne({ $or: [{ username }, { email: username }] }).lean()
      if (!user) return reply.code(404).send({ message: 'User not found' })

      if (!user.password)
        return reply.code(403).send({ message: `This account can only be accessed by ${user.platform}` })

      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) return reply.code(400).send({ message: 'Wrong password' })

      request.session.set('_id', String(user._id))

      reply.send(user)
    }
  )
}
