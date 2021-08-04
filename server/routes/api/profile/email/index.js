'use strict'

const bcrypt = require('bcrypt')
module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          require: ['email'],
          properties: {
            password: { type: 'string', minLength: 8, maxLength: 20 },
            email: { type: 'string', format: 'email' },
          },
        },
        response: { 200: { $ref: 'message#' } },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const _id = request.session.get('_id')
      const { password } = await fastify.db.User.findById(_id, 'password').lean()
      const newData = request.body

      if (password) {
        if (!newData.password) return reply.code(400).send({ message: 'Enter your current password' })
        const isRight = await bcrypt.compare(newData.prevPassword, password)
        if (!isRight) return reply.code(400).send({ message: 'Wrong password' })
      }

      await fastify.db.User.updateOne({ _id }, { email: newData.email }).catch((err) => {
        if (err.code === 11000) {
          return reply.code(400).send({ message: `Email ${err.keyValue.email} is already taken` })
        }
        console.log(err)
      })

      reply.send({ message: 'OK' })
    }
  )
}
