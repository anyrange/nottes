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
        response: { XXX: { $ref: 'message#' } },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      const sameAuthor = request.session.get('_id') === String(paste.author)
      const sameIp = request.ip === paste.ip
      if (!sameAuthor && !sameIp) return reply.code(403).send({ message: 'Not your paste' })

      await fastify.db.Paste.deleteOne({ _id: request.params.id })
      reply.send({ message: 'OK' })
    }
  )
}
