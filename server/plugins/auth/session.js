'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.decorate('auth', async function (request, reply) {
    if (!request.session.get('_id')) return reply.code(401).send({ message: 'Unauthorized' })
  })
})
