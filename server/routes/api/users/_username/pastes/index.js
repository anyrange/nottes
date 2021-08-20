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
        query: { $ref: 'pagination#' },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: { $ref: 'paste#/definitions/micropaste' } },
              pages: { type: 'number' },
              entries: { type: 'number' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['users'],
      },
    },
    async (request, reply) => {
      const { range, page, search, sort } = request.query
      const user = await fastify.db.User.findOne({ username: request.params.username }).lean()
      if (!user) return reply.code(404).send({ message: 'User not found' })

      const query = {
        author: user._id,
        title: { $regex: search, $options: 'gi' },
        visibility: { $ne: 'private' },
      }

      const isAuthor = request.session.get('_id') === String(user._id)
      if (isAuthor) delete query.visibility

      const [pastes, { pages, entries }] = await Promise.all([
        fastify.db.Paste.find(query)
          .sort(sort)
          .skip((page - 1) * range)
          .limit(range)
          .lean(),
        fastify.db.Paste.find(query)
          .countDocuments()
          .then((pastes) => ({ pages: Math.ceil(pastes / range), entries: pastes })),
      ])

      reply.send({ pastes, pages, entries })
    }
  )
}
