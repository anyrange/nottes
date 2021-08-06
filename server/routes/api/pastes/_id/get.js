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
      const paste = await fastify.db.Paste.findById(request.params.id).populate('author').lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (paste.visibility === 'private' && request.session.get('_id') !== String(paste.author._id)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      paste.content = fastify.decrypt(paste.content)

      if (!paste.views.length || !paste.views.find((ip) => ip === request.ip)) {
        await fastify.db.Paste.updateOne({ _id: request.params.id }, { $push: { views: request.ip } })
      }

      paste.views = paste.views.length

      reply.send({ paste })
    }
  )
}
