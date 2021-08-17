'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.delete(
    '',
    {
      schema: {
        body: {
          type: 'object',
          required: ['password'],
          properties: {
            password: { type: 'string', minLength: 8, maxLength: 20 },
          },
        },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const { password } = request.body
      const _id = request.session.get('_id')
      const user = await fastify.db.User.findById(_id, 'password platform').lean()
      if (!user) return reply.code(404).send({ message: 'User not found' })

      if (!user.password)
        return reply.code(403).send({ message: `This account can only be accessed by ${user.platform}` })

      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) return reply.code(400).send({ message: 'Wrong password' })

      await Promise.all([
        fastify.db.User.deleteOne({ _id }),
        fastify.db.Paste.updateMany({ author: _id }, { $unset: { author: '' } }).lean(),
      ])

      request.session.delete()
      reply.code(204).send()
    }
  )
}
