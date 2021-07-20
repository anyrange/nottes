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
              paste: fastify.getSchema('paste'),
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const paste = await fastify.db.Paste.findOneAndUpdate({ id: request.params.id }, { $inc: { views: 1 } }).lean()

      if (!paste) return reply.code(404).send({ message: 'Paste not found', statusCode: 404 })

      if (paste.expiry < new Date()) {
        await fastify.db.Paste.deleteOne({ id: request.params.id })
        return reply.code(400).send({ message: 'Paste expired', statusCode: 400 })
      }

      if (paste.visibility === 'private' && request.cookies.accessToken) {
        const authorId = await fastify.verifyToken(request.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET)
        if (authorId !== String(paste.user)) return reply.code(403).send({ message: 'Private paste', statusCode: 403 })
      }

      if (paste.password && !request.query.password)
        return reply.code(403).send({ message: 'Password required', statusCode: 403 })
      if (paste.password && !(await bcrypt.compare(request.query.password, paste.password)))
        return reply.code(403).send({ message: 'Wrong password', statusCode: 403 })

      const user = paste.user
        ? await fastify.db.User.findOne({ _id: paste.user }, 'username avatar -_id').lean()
        : { username: 'Guest', avatar: '' }

      reply.send({
        paste: {
          id: paste.id,
          title: paste.title,
          content: fastify.decrypt(paste.content),
          author: user,
          date: paste.date,
          views: paste.views,
          code: paste.code,
          expiry: paste.expiry,
        },
        statusCode: 200,
      })
    }
  )
}
