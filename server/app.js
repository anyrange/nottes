'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify) {
  fastify.register(require('fastify-cors'), {
    origin: process.env.URL_LIST.split(','),
    credentials: true,
  })

  // docs
  if (process.env.NODE_ENV !== 'production') {
    fastify.register(require('fastify-swagger'), {
      swagger: {
        info: { title: 'nottes' },
        basePath: '/api',
      },
      routePrefix: '/docs',
      uiConfig: { deepLinking: true, displayRequestDuration: true, docExpansion: 'none' },
      exposeRoute: true,
      hideUntagged: true,
    })
    console.log('\x1B[36m%s\x1B[0m', `i`, `Docs: ${process.env.BASE_URL}/docs`)
  }

  const domain = new URL(process.env.BASE_URL).hostname
  const MONTH = 60 * 60 * 24 * 30

  fastify.register(require('fastify-secure-session'), {
    cookieName: 'session',
    key: Buffer.from(process.env.COOKIE_SECRET, 'hex'),
    cookie: { sameSite: 'strict', domain, path: '/', secure: true, maxAge: MONTH },
  })

  fastify.register(require('fastify-websocket'))

  fastify.register(AutoLoad, { dir: path.join(__dirname, 'plugins') })
  fastify.register(AutoLoad, { dir: path.join(__dirname, 'schemas') })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  })
}
