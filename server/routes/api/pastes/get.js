'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        description: 'Archive',
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            range: { type: 'number', minimum: 3, default: 10 },
            search: { type: 'string', default: null },
          },
        },
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
      const { page, range, search } = request.query

      const [pastes, pages] = await Promise.all([
        fastify.db.Paste.find({
          visibility: { $ne: 'private' },
          title: { $regex: search, $options: 'gi' },
        })
          .sort('-date')
          .skip((page - 1) * range)
          .limit(range)
          .lean(),
        fastify.db.Paste.find({
          visibility: { $ne: 'private' },
          title: { $regex: search, $options: 'gi' },
        })
          .countDocuments()
          .then((pastes) => Math.ceil(pastes / range)),
      ])

      reply.send({ pastes, pages })
    }
  )
}
