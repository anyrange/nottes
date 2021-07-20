'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.delete(
    '',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        querystring: {
          type: 'object',
          properties: { password: { type: 'string' } },
        },
        response: {
          200: fastify.getSchema('message'),
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findOne({ id: request.params.id }).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found', statusCode: 404 })

      if (!request.cookies.accessToken) return reply.code(403).send({ message: 'Forbidden', statusCode: 403 })
      const authorId = await fastify.verifyToken(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
      if (authorId !== String(paste.user)) return reply.code(403).send({ message: 'Forbidden', statusCode: 403 })

      if (paste.password && !request.query.password)
        return reply.code(403).send({ message: 'Password required', statusCode: 403 })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password', statusCode: 403 })

      await fastify.db.Paste.deleteOne({ id: request.params.id })
      reply.send({ message: 'OK', statusCode: 200 })
    }
  )
}
