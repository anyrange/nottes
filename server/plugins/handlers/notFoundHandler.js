'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function plugin(fastify) {
  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ message: 'Service not found' })
  })
})
