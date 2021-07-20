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
            username: { type: 'string' },
          },
        },
        response: { 200: fastify.getSchema('message') },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const res = await fastify.db.User.updateOne({ _id: request._id }, { username: request.body.username }).catch(
        (err) => {
          if (err.code === 11000) {
            return reply
              .code(400)
              .send({ statusCode: 400, message: `Username ${err.keyValue.username} is already taken` })
          }
          console.log(err)
        }
      )

      if (res.nModified === 0) return reply.send({ message: 'Nothing changed', statusCode: 200 })
      reply.send({ message: 'OK', statusCode: 200 })
    }
  )
}
