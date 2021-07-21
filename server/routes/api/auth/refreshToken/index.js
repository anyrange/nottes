'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    { schema: { response: { X00: fastify.getSchema('message') }, tags: ['auth'] } },
    async (request, reply) => {
      const _id = await fastify
        .verifyToken(request.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET)
        .catch(() => reply.code(401).send({ message: 'Invalid token' }))

      const res = await fastify.db.Token.deleteOne({ user: _id, token: request.cookies.refreshToken })
      if (res.deletedCount === 0) {
        await fastify.db.Token.deleteMany({ user: _id })
        reply.clearCookie('accessToken', fastify.cookieOptions)
        reply.clearCookie('refreshToken', fastify.cookieOptions)
        return reply.code(401).send({ message: 'Invalid token' })
      }

      const { accessToken, refreshToken } = await fastify.generateTokens(_id)

      reply.setCookie('accessToken', accessToken, fastify.cookieOptions)
      reply.setCookie('refreshToken', refreshToken, fastify.cookieOptions)

      reply.send({ message: 'OK' })
    }
  )
}
