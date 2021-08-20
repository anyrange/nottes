'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        description: 'Archive',
        querystring: { $ref: 'pagination#' },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: { $ref: 'paste#/definitions/micropaste' } },
              pages: { type: 'number' },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const { page, range, search, sort } = request.query

      const q = {
        visibility: { $ne: 'private' },
        title: { $regex: search, $options: 'gi' },
      }

      const [pastes, pages] = await Promise.all([
        fastify.db.Paste.find(q)
          .sort(sort)
          .skip((page - 1) * range)
          .limit(range)
          .lean(),
        fastify.db.Paste.find(q)
          .countDocuments()
          .then((pastes) => Math.ceil(pastes / range)),
      ])

      reply.send({ pastes, pages })
    }
  )
}
