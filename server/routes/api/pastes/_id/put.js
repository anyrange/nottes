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
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            code: { type: 'string' },
            visibility: { type: 'string', pattern: '^(shared|public|private|unlisted)$' },
            expiry: { type: 'string', pattern: '^(|10m|1h|1d|1w|2w|1month)$' },
            password: { type: 'string' },
          },
        },
        response: { X0X: { $ref: 'message#' } },
        tags: ['paste'],
      },
      preValidation: [fastify.auth],
    },
    async (request, reply) => {
      const filter = { _id: request.params.id }
      const paste = await fastify.db.Paste.findOne(filter).lean()
      if (!paste) return reply.code(404).send({ message: 'Paste not found' })

      const isAuthor = request.session.get('_id') === String(paste.author)
      if (!isAuthor && paste.visibility !== 'shared') return reply.code(403).send({ message: 'Not your paste' })

      const newData = request.body

      if (!isAuthor) {
        if (newData.title && newData.title !== paste.title)
          return reply.code(400).send({ message: 'Only author can change title' })
        if (newData.visibility && newData.visibility !== 'shared')
          return reply.code(400).send({ message: 'Only author can change visibility' })
        if (newData.password) return reply.code(400).send({ message: 'Only author can change password' })
        if (newData.expiry && newData.expiry !== paste.expiry)
          return reply.code(400).send({ message: 'Only author can change expiry' })
      }

      if (newData.expiry) newData.expire_date = getExpiryDate(newData.expiry)
      if (newData.password) newData.password = await bcrypt.hash(newData.password, 10)
      if (newData.content) newData.content = fastify.encrypt(newData.content)

      const res = await fastify.db.Paste.updateOne(filter, newData)
      if (res.nModified === 0) return reply.send({ message: 'Nothing changed' })

      reply.code(204).send()
    }
  )
}
