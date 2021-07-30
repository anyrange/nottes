'use strict'

module.exports = async function (fastify) {
  fastify.addHook('preValidation', fastify.auth)
}
