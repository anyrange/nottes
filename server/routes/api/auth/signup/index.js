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

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const { _id } = await fastify.db.User.create({ username, password: hashedPassword }).catch((err) => {
        if (err.code === 11000) {
          return reply
            .code(400)
            .send({ statusCode: 400, message: `Username ${err.keyValue.username} is already taken` })
        }
        console.log(err)
      })

      const { accessToken, refreshToken } = await fastify.generateTokens(_id)

      reply.setCookie('accessToken', accessToken, fastify.cookieOptions)
      reply.setCookie('refreshToken', refreshToken, fastify.cookieOptions)

      reply.send({ message: 'OK', statusCode: 201 })
    }
  )
}
