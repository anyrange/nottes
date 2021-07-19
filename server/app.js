'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify) {
  fastify.register(require('fastify-cors'), {
    origin: process.env.URL_LIST.split(','),
    credentials: true,
  })

  fastify.register(require('fastify-jwt'), { secret: process.env.SECRET })

  fastify.register(AutoLoad, { dir: path.join(__dirname, 'plugins') })
  fastify.register(AutoLoad, { dir: path.join(__dirname, 'schemas') })
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  })
}
