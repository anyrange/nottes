'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: fastify.getSchema('user'),
        response: { X00: fastify.getSchema('message') },
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const { username, password } = request.body

      const user = await fastify.db.User.findOne({ username })
      if (!user) return reply.code(404).send({ message: 'User not found', statusCode: 404 })

      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) return reply.code(400).send({ message: 'Wrong password', statusCode: 400 })

      const { accessToken, refreshToken } = await fastify.generateTokens(user._id)

      reply.setCookie('accessToken', accessToken, fastify.cookieOptions)
      reply.setCookie('refreshToken', refreshToken, fastify.cookieOptions)

      reply.send({ message: 'OK', statusCode: 200 })
    }
  )
}