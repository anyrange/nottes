'use strict'

const { promisify } = require('util')
const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')

module.exports = fp(async function (fastify) {
  fastify.decorateRequest('isAuthenticated', false)
  fastify.decorateRequest('_id', '')

  const verify = async (token, secret) => {
    const verify = promisify(jwt.verify)
    const { _id } = await verify(token, secret).catch((e) => {
      const message = e.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      const err = new Error(message)
      err.code = e.name === 'TokenExpiredError' ? 403 : 401
      throw err
    })
    return _id
  }

  fastify.decorate('verifyToken', verify)

  fastify.decorate('authenticate', async function (request, reply) {
    if (!request.cookies.accessToken) return reply.code(401).send({ message: 'Unauthorized', statusCode: 401 })

    request._id = await verify(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)

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
