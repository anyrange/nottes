'use strict'

module.exports = async function (fastify) {
  fastify.delete(
    '',
    { schema: { response: { 200: { $ref: 'message#' } }, tags: ['auth'] } },
    async (request, reply) => {
      request.destroySession((err) => {
        if (err) return reply.send(401).send({ message: 'Unauthorized' })
        reply.send({ message: 'OK' })
      })
    }
  )
}
