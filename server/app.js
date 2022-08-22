'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

module.exports = async function (fastify) {
  fastify.register(require('@fastify/cors'), {
    origin: process.env.BASE_URL,
    credentials: true,
  })

  // docs
  if (process.env.NODE_ENV !== 'production') {
    fastify.register(require('fastify-swagger'), {
      swagger: { info: { title: 'nottes' } },
      routePrefix: '/docs',
      uiConfig: { deepLinking: true, displayRequestDuration: true, docExpansion: 'none' },
      exposeRoute: true,
      hideUntagged: true,
    })
    console.log('\x1B[36m%s\x1B[0m', `i`, `Docs: ${process.env.BASE_URL}/docs`)
  }

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
