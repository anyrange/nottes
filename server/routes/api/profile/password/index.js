'use strict'

const bcrypt = require('bcrypt')
module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          require: ['password'],
          properties: {
            password: { type: 'string', minLength: 8, maxLength: 20 },
            prevPassword: { type: 'string', minLength: 8, maxLength: 20 },
          },
        },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const _id = request.session.get('_id')
      const { password } = await fastify.db.User.findById(_id, 'password').lean()
      const newData = request.body

      if (password) {
        if (!newData.prevPassword) return reply.code(400).send({ message: 'Enter your current password' })
        const isRight = await bcrypt.compare(newData.prevPassword, password)
        if (!isRight) return reply.code(400).send({ message: 'Wrong password' })
      }

      const SALT_ROUNDS = 10
      const newPassword = await bcrypt.hash(newData.password, SALT_ROUNDS)
      const res = await fastify.db.User.updateOne({ _id }, { password: newPassword })

      if (res.nModified === 0) return reply.send({ message: 'Nothing changed' })
      reply.code(204).send()
    }
  )
}
