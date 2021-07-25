'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'user',
    title: 'user',
    type: 'object',
    default: { username: 'Guest', avatar: '' },
    properties: {
      username: { type: 'string' },
      avatar: { type: 'string', default: '' },
    },
  })
})
