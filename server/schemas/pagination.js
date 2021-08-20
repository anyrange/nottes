'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'pagination',
    title: 'pagination',
    type: 'object',
    properties: {
      page: { type: 'number', minimum: 1, default: 1 },
      range: { type: 'number', minimum: 3, default: 10 },
      search: { type: 'string', default: null },
      sort: { type: 'string', pattern: '^(|-)(date|title|code)$', default: '-date' },
    },
  })
})
