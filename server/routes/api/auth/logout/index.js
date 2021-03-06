'use strict'

module.exports = async function (fastify) {
  fastify.delete('', { schema: { tags: ['auth'] } }, async (request, reply) => {
    request.session.delete()
    reply.code(204).send()
  })
}
