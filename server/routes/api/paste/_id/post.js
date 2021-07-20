'use strict'

const bcrypt = require('bcrypt')
const ShortUniqueId = require('short-unique-id')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        description: 'Fork paste',
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
      const paste = await fastify.db.Paste.findOne({ id: request.params.id }, '-_id -views -date').lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found', statusCode: 404 })

      if (!request.cookies.accessToken) return reply.code(403).send({ message: 'Forbidden', statusCode: 403 })
      const requestorId = await fastify.verifyToken(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
      if (paste.visibility === 'private' && requestorId !== String(paste.user)) {
        return reply.code(403).send({ message: 'Forbidden', statusCode: 403 })
      }

      if (paste.password && !request.query.password)
        return reply.code(403).send({ message: 'Password required', statusCode: 403 })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password', statusCode: 403 })

      const uid = new ShortUniqueId()
      paste.id = uid()
      paste.user = requestorId
      await fastify.db.Paste.create(paste)
      reply.send({ message: 'OK', statusCode: 200 })
    }
  )
}
