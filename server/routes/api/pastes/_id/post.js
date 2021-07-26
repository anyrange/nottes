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
          201: { type: 'object', properties: { id: { type: 'string' }, statusCode: { type: 'number' } } },
          XXX: { $ref: 'message#' },
        },
        tags: ['paste'],
      },
      preValidation: [fastify.authenticate, fastify.requireAuth],
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findOne({ id: request.params.id }, '-_id -views -date').lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (paste.visibility === 'private' && request._id !== String(paste.author)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      const uid = new ShortUniqueId()
      paste.id = uid()
      paste.author = request._id
      await fastify.db.Paste.create(paste)
      reply.code(201).send({ id: paste.id })
    }
  )
}
