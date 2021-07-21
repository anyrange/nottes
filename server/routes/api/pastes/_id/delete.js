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
        response: { XXX: fastify.getSchema('message') },
        preValidation: [fastify.authenticate, fastify.requireAuth],
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findOne({ id: request.params.id }).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (require._id !== String(paste.user)) return reply.code(403).send({ message: 'Forbidden' })

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      await fastify.db.Paste.deleteOne({ id: request.params.id })
      reply.send({ message: 'OK' })
    }
  )
}
