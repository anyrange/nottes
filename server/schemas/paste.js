'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'paste',
    title: 'paste',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      author: {
        type: 'object',
        default: { username: 'Guest', avatar: '' },
        properties: {
          username: { type: 'string' },
          avatar: { type: 'string', default: '' },
        },
      },
      date: { type: 'string' },
      visibility: { type: 'string' },
      expiry: { type: 'string' },
      expire_date: { type: 'string', format: 'datetime' },
      views: { type: 'number' },
      code: { type: 'string' },
    },
    definitions: {
      micropaste: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          date: { type: 'string' },
          views: { type: 'number' },
          code: { type: 'string' },
          visibility: { type: 'string' },
        },
      },
    },
  })
})
