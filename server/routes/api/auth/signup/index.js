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
            email: { type: 'string', format: 'email' },
          },
        },
        response: { 201: { $ref: 'user#' } },
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const { username, password, email } = request.body

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const userExist = await fastify.db.User.findOne({ $or: [{ username }, { email }] }).lean()

      if (userExist) {
        return reply.code(400).send({
          message: `${userExist.username === username ? `Username ${username}` : `Email ${email}`} is already in use`,
        })
      }

      const user = await fastify.db.User.create({ username, password: hashedPassword, email })

      request.session.isAuth = true
      request.session._id = String(user._id)

      reply.code(201).send(user)
    }
  )
}
