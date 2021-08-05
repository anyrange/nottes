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
        tags: ['layout (Base URL: /)'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findById(request.params.id, 'content visibility author').lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (paste.visibility === 'private' && request.session.get('_id') !== String(paste.author)) {
        return reply.code(403).send({ message: 'Private paste' })
      }

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      reply.header('Content-Disposition', `filename="${request.params.id}.txt"`)
      reply.send(fastify.decrypt(paste.content))
    }
  )
}
