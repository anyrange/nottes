'use strict'

const fp = require('fastify-plugin')

const user = {
  type: 'object',
  default: { username: 'Guest', avatar: '' },
  properties: {
    username: { type: 'string' },
    avatar: { type: 'string', default: '' },
  },
}
module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: 'user',
    title: 'user',
    ...user,
  })
})

module.exports.user = user
