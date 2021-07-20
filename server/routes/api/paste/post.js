'use strict'

const ShortUniqueId = require('short-unique-id')
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
            expiry: { type: 'string', pattern: '^(never|10m|1h|1d|1w|2w|1month)$' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = request.body
      if (request.cookies.accessToken) {
        paste.user = await fastify.verifyToken(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
      }

      if (!paste.user && request.body.visibility === 'private')
        return reply.code(403).send({ message: 'Forbidden', statusCode: 403 })

      if (request.body.expiry) paste.expiry = getExpiryDate(request.body.expiry)
      if (request.body.password) paste.password = await bcrypt.hash(request.body.password, 10)

      paste.content = fastify.encrypt(paste.content)

      const uid = new ShortUniqueId()
      paste.id = uid()

      const res = await fastify.db.Paste.create(paste)

      reply.send({ id: res.id, statusCode: 200 })
    }
  )
}
