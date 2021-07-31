'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  const domain = new URL(process.env.BASE_URL).hostname
  const MONTH = 60 * 60 * 24 * 30

  fastify.register(require('fastify-secure-session'), {
    cookieName: 'session',
    key: Buffer.from(process.env.COOKIE_SECRET, 'hex'),
    cookie: {
      sameSite: 'strict',
      domain,
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: MONTH,
    },
  })

  fastify.decorate('auth', async function (request, reply) {
    if (!request.session.get('_id')) return reply.code(401).send({ message: 'Unauthorized' })
  })
})
