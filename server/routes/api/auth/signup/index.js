'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password', 'email'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
            password: { type: 'string', minLength: 8, maxLength: 20 },
            email: { type: 'string' },
          },
        },
        response: { X00: fastify.getSchema('message') },
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const { username, password, email } = request.body

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const user = await fastify.db.User.findOne({ $or: [{ username }, { email }] })

      if (user) {
        return reply.code(400).send({
          message: `${user.username === username ? `Username ${username}` : `Email ${email}`} already exist`,
        })
      }

      const { _id } = await fastify.db.User.create({ username, password: hashedPassword, email })

      await fastify.sendmail(email, _id)
      const { accessToken, refreshToken } = await fastify.generateTokens(_id)

      reply.setCookie('accessToken', accessToken, fastify.cookieOptions)
      reply.setCookie('refreshToken', refreshToken, fastify.cookieOptions)

      reply.code(201).send({ message: 'OK' })
    }
  )
}
