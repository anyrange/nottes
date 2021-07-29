'use strict'

const { promisify } = require('util')
const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')

module.exports = fp(async function (fastify) {
  fastify.decorateRequest('isAuthenticated', false)
  fastify.decorateRequest('_id', '')
  fastify.decorateRequest('tokenExpired', false)

  const verify = async (token, secret) => {
    const verify = promisify(jwt.verify)

    const { _id } = await verify(token, secret).catch((e) => {
      const isExpired = e.name === 'TokenExpiredError'

      const message = isExpired ? 'Token expired' : 'Invalid token'
      const err = new Error(message)
      err.code = isExpired ? 403 : 401
      throw err
    })
    return _id
  }

  fastify.decorate('verifyToken', verify)

  fastify.decorate('authenticate', async function (request, reply) {
    if (!request.cookies.accessToken) return
    request.isAuthenticated = true

    request._id = await verify(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET).catch((e) => {
      if (e.code !== 403) throw e
      request.tokenExpired = true
      return null
    })
  })

  fastify.decorate('requireAuth', async function (request, reply) {
    if (!request.isAuthenticated) return reply.code(401).send({ message: 'Unauthorized' })
    if (request.tokenExpired) return reply.code(403).send({ message: 'Token expired' })
  })

  fastify.decorate('generateTokens', async (_id) => {
    const sign = promisify(jwt.sign)

    const [accessToken, refreshToken] = await Promise.all([
      sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }),
      sign({ _id }, process.env.REFRESH_TOKEN_SECRET),
    ])

    const sessions = await fastify.db.Token.find({ user: _id }).lean()
    if (sessions.length >= 5) await fastify.db.Token.deleteMany({ user: _id })

    await fastify.db.Token.create({ user: _id, token: refreshToken })

    return { accessToken, refreshToken }
  })
})
