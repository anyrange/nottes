'use strict'

const fp = require('fastify-plugin')
const { user } = require('./user.js')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'paste',
    title: 'paste',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      author: user,
      contributors: { type: 'array', items: user },
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
