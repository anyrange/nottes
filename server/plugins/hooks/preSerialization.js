'use strict'

const fp = require('fastify-plugin')

const plugin = fp(async function plugin(fastify) {
  fastify.addHook('preSerialization', async (request, reply, payload) => {
    payload.statusCode = reply.statusCode
  })
})

module.exports = plugin
