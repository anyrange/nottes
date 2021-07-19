'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: fastify.getSchema('user'),
        response: { X00: fastify.getSchema('message') },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body

      const user = await fastify.db.User.findOne({ username })
      if (!user) return reply.code(404).send({ message: 'User not found', statusCode: 404 })

      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) return reply.code(400).send({ message: 'Wrong password', statusCode: 400 })

      const token = fastify.jwt.sign({ _id: user._id })

      reply.setCookie('session', token, fastify.cookieOptions)
      reply.send({ message: 'Success', statusCode: 200 })
    }
  )
}
