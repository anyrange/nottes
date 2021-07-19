'use strict'

module.exports = async function (fastify) {
  fastify.delete('', { schema: { response: { 200: fastify.getSchema('message') } } }, async (request, reply) => {
    reply.clearCookie('accessToken', fastify.cookieOptions)
    reply.clearCookie('refreshToken', fastify.cookieOptions)
    reply.send({ message: 'OK', statusCode: 200 })
    await fastify.db.Token.deleteOne({ token: request.cookies.refreshToken })
  })
}
