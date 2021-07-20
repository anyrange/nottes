'use strict'

const { promisify } = require('util')
const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')

module.exports = fp(async function (fastify) {
  fastify.decorateRequest('isAuthenticated', false)
  fastify.decorateRequest('_id', '')

  const verify = async (token, secret) => {
    const verify = promisify(jwt.verify)
    const { _id } = await verify(token, secret)
    return _id
  }

  fastify.decorate('verifyToken', verify)

  fastify.decorate('authenticate', async function (request, reply) {
    if (!request.cookies.accessToken) return reply.code(401).send({ message: 'Unauthorized', statusCode: 401 })

    request._id = await verify(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET).catch((err) => {
      if (err.name === 'TokenExpiredError') return reply.code(403).send({ message: 'Token expired', statusCode: 403 })
      reply.code(401).send({ message: 'Invalid token', statusCode: 401 })
    })

    request.isAuthenticated = true
  })

  fastify.decorate('generateTokens', async (_id) => {
    const sign = promisify(jwt.sign)

    const [accessToken, refreshToken] = await Promise.all([
      sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }),
      sign({ _id }, process.env.REFRESH_TOKEN_SECRET),
    ])

    await fastify.db.Token.create({ user: _id, token: refreshToken })

    return { accessToken, refreshToken }
  })
})
