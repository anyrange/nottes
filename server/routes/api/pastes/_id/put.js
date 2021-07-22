'use strict'

const bcrypt = require('bcrypt')
const getExpiryDate = require('../../../../utils/expiryDate.js')

module.exports = async function (fastify) {
  fastify.put(
    '',
    {
      schema: {
        description: 'Change paste',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
        },
        querystring: {
          type: 'object',
          properties: { password: { type: 'string' } },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            code: { type: 'string' },
            visibility: { type: 'string', pattern: '^(public|private|unlisted)$' },
            expiry: { type: 'string', pattern: '^(never|10m|1h|1d|1w|2w|1month)$' },
            password: { type: 'string' },
          },
        },
        response: { XXX: fastify.getSchema('message') },
        tags: ['paste'],
      },
      preValidation: [fastify.authenticate, fastify.requireAuth],
    },
    async (request, reply) => {
      const filter = { id: request.params.id }
      const paste = await fastify.db.Paste.findOne(filter).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      if (request._id !== String(paste.user)) return reply.code(403).send({ message: 'Forbidden' })

      if (paste.password && !request.query.password) return reply.code(403).send({ message: 'Password required' })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password' })

      const newData = request.body

      if (newData.expiry) newData.expiry = getExpiryDate(newData.expiry)
      if (newData.password) newData.password = await bcrypt.hash(newData.password, 10)
      if (newData.content) newData.content = fastify.encrypt(newData.content)

      const res = await fastify.db.Paste.updateOne(filter, newData)
      if (res.nModified === 0) return reply.send({ message: 'Nothing changed' })

      reply.send({ message: 'OK' })
    }
  )
}