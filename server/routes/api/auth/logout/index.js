'use strict'

module.exports = async function (fastify) {
  fastify.delete(
    '',
    { schema: { response: { 200: { $ref: 'message#' } }, tags: ['auth'] } },
    async (request, reply) => {
      request.session.delete()
      reply.send({ message: 'OK' })
    }
  )
}
