'use strict'

module.exports = async function (fastify) {
  fastify.get('', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    reply.send({ authenticated: request.isAuthenticated, statusCode: 200 })
  })
}
