'use strict'

const bcrypt = require('bcrypt')

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
          201: {
            type: 'object',
            properties: {
              paste: { $ref: 'paste#/definitions/micropaste' },
              statusCode: { type: 'number' },
            },
          },
          XXX: { $ref: 'message#' },
        },
        tags: ['paste'],
      },
      preValidation: [fastify.auth],
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id, '-_id -views -date -expiry').lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      const _id = request.session.get('_id')

      if (paste.visibility === 'private' && _id !== String(paste.author)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      paste.author = _id
      const fork = await fastify.db.Paste.create(paste)
      reply.code(201).send({ paste: fork })
    }
  )
}
