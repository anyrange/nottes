'use strict'

module.exports = async function (fastify) {
  fastify.delete(
    '',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        response: { X0X: { $ref: 'message#' } },
        tags: ['paste'],
      },
      preValidation: [fastify.auth],
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (request.session.get('_id') !== String(paste.author))
        return reply.code(403).send({ message: 'Not your paste' })

      await fastify.db.Paste.deleteOne({ _id: request.params.id })
      reply.send({ message: 'OK' })
    }
  )
}
