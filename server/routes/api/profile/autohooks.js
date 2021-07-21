'use strict'

module.exports = async function (fastify) {
  fastify.addHook('preValidation', fastify.authenticate)
  fastify.addHook('preValidation', fastify.requireAuth)
}
