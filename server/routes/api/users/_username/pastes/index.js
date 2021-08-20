'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        params: {
          type: 'object',
          properties: { username: { type: 'string' } },
        },
        query: {
          type: 'object',
          properties: {
            search: { type: 'string', default: null },
            page: { type: 'number', minimum: 1, default: 1 },
            range: { type: 'number', minimum: 3, default: 10 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: {
                type: 'array',
                items: { $ref: 'paste#/definitions/micropaste' },
              },
              pages: { type: 'number' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['users'],
      },
    },
    async (request, reply) => {
      const { range, page, search } = request.query
      const user = await fastify.db.User.findOne({ username: request.params.username }).lean()
      if (!user) return reply.code(404).send({ message: 'User not found' })

      const query = {
        author: user._id,
        title: { $regex: search, $options: 'gi' },
        visibility: { $ne: 'private' },
      }

      const isAuthor = request.session.get('_id') === String(user._id)
      if (isAuthor) delete query.visibility

      const [pastes, pages] = await Promise.all([
        fastify.db.Paste.find(query)
          .sort('-date')
          .skip((page - 1) * range)
          .limit(range)
          .lean(),
        fastify.db.Paste.find(query)
          .countDocuments()
          .then((pastes) => Math.ceil(pastes / range)),
      ])

      reply.send({ pastes, pages })
    }
  )
}
