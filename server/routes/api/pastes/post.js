'use strict'

const bcrypt = require('bcrypt')
const getExpiryDate = require('../../../utils/expiryDate.js')

module.exports = async function (fastify) {
  fastify.post(
    '',
    {
      schema: {
        description: 'New paste',
        body: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            code: { type: 'string' },
            visibility: { type: 'string', pattern: '^(public|private|unlisted)$' },
            expiration: { type: 'string', pattern: '^(never|10m|1h|1d|1w|2w|1month)$' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              paste: { $ref: 'paste#/definitions/micropaste' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = request.body
      if (request.session.isAuth) paste.author = request.session._id

      if (!paste.author && paste.visibility === 'private')
        return reply.code(403).send({ message: 'Guests cannot create private pastes' })

      if (paste.expiration) paste.expiry = getExpiryDate(paste.expiration)
      if (paste.password) paste.password = await bcrypt.hash(paste.password, 10)

      paste.content = fastify.encrypt(paste.content)

      const created = await fastify.db.Paste.create(paste)

      reply.send({ paste: created })
    }
  )
}
