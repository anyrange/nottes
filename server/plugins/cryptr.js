'use strict'

const fp = require('fastify-plugin')
const Cryptr = require('cryptr')

module.exports = fp(async function (fastify) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

  fastify.decorate('encrypt', cryptr.encrypt)
  fastify.decorate('decrypt', cryptr.decrypt)
})
