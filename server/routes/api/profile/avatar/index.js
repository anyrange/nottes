'use strict'

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          require: ['avatar'],
          properties: {
            avatar: { type: 'string' },
          },
        },
        response: { 200: { $ref: 'message#' } },
        tags: ['profile'],
      },
    },
    async (request, reply) => {
      const avatar = request.body

      const res = await fastify.db.User.updateOne({ _id: request._id }, { avatar })
      if (res.nModified === 0) return reply.send({ message: 'Nothing changed' })
      reply.send({ message: 'OK' })
    }
  )
}
