'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'paste',
    title: 'message',
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      author: {
        type: 'object',
        default: { username: 'Guest', avatar: '' },
        properties: {
          username: { type: 'string' },
          avatar: { type: 'string' },
        },
      },
      date: { type: 'string' },
      views: { type: 'number' },
      code: { type: 'string' },
    },
  })
})
