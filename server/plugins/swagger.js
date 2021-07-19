'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify) {
  if (process.env.NODE_ENV !== 'production') {
    fastify.register(require('fastify-swagger'), {
      swagger: { basePath: '/api' },
      routePrefix: '/docs',
      uiConfig: { deepLinking: true, displayRequestDuration: true },
      exposeRoute: true,
    })
    console.log('\x1B[36m%s\x1B[0m', `i`, `Docs: ${process.env.BASE_URL}docs`)
  }
})
