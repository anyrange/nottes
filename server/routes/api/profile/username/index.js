'use strict'

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 30 },
          },
        },
        response: { 200: { $ref: 'message#' } },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const { username } = request.body

      const res = await fastify.db.User.updateOne({ _id: request.session._id }, { username }).catch((err) => {
        if (err.code === 11000)
          return reply.code(400).send({ message: `Username ${err.keyValue.username} is already taken` })

        console.log(err)
      })

      if (res.nModified === 0) return reply.send({ message: 'Nothing changed' })
      reply.send({ message: 'OK' })
    }
  )
}
