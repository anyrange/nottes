'use strict'

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
        response: {
          201: {
            type: 'object',
            properties: {
              paste: { $ref: 'paste#/definitions/micropaste' },
              statusCode: { type: 'number' },
            },
          },
          X0X: { $ref: 'message#' },
        },
        tags: ['paste'],
      },
      preValidation: [fastify.auth],
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id, '-_id -views -date -contributors').lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      const _id = request.session.get('_id')

      if (!_id) return reply.code(403).send({ message: 'Guests cannot fork' })
      if (paste.visibility === 'private' && _id !== String(paste.author)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.expiry) return reply.code(403).send({ message: 'Expiration pastes cannot be forked' })
      if (paste.password) return reply.code(403).send({ message: 'Password pastes cannot be forked' })

      paste.title = paste.title + ' [fork]'
      paste.author = _id
      paste.visibility = 'private'
      const fork = await fastify.db.Paste.create(paste)
      reply.code(201).send({ paste: fork })
    }
  )
}
