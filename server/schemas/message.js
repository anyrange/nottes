'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'message',
    title: 'message',
    type: 'object',
    properties: {
      message: { type: 'string' },
      statusCode: { type: 'number' },
    },
  })
})
