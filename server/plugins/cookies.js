'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  const domain = new URL(process.env.BASE_URL).hostname

  fastify.register(require('fastify-cookie'), { secret: process.env.COOKIE_SECRET })

  fastify.decorate('cookieOptions', {
    domain,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: true,
  })
})
