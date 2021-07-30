'use strict'

const bcrypt = require('bcrypt')

module.exports = async function (fastify) {
  fastify.get(
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
          200: {
            type: 'object',
            properties: {
              paste: { $ref: 'paste#' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findByIdAndUpdate(request.params.id, { $inc: { views: 1 } })
        .populate('author')
        .lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (paste.visibility === 'private' && request.session._id !== String(paste.author._id)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      paste.content = fastify.decrypt(paste.content)

      reply.send({ paste })
    }
  )
}
