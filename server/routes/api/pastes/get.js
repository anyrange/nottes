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
            sort: { type: 'string', pattern: '^(|-)(date|title|code)$', default: '-date' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: { $ref: 'paste#/definitions/micropaste' } },
              pages: { type: 'number' },
              entries: { type: 'number' },
              stats: {
                type: 'object',
                properties: {
                  public: { type: 'number', default: 0 },
                  shared: { type: 'number', default: 0 },
                  unlisted: { type: 'number', default: 0 },
                  private: { type: 'number', default: 0 },
                },
              },
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
        title: { $regex: search, $options: 'i' },
      }

      const [pastes, { pages, entries }, groupedVisibility] = await Promise.all([
        fastify.db.Paste.find(q)
          .sort(sort)
          .skip((page - 1) * range)
          .limit(range)
          .lean(),
        fastify.db.Paste.find(q)
          .countDocuments()
          .then((pastes) => ({ pages: Math.ceil(pastes / range) || 1, entries: pastes })),
        fastify.db.Paste.aggregate().group({
          _id: { visibility: '$visibility' },
          sum: { $sum: 1 },
          views: { $sum: { $size: '$views' } },
        }),
      ])
      const stats = Object.fromEntries(groupedVisibility.map((item) => [item._id.visibility, item.sum]))

      reply.send({ pastes, pages, entries, stats })
    }
  )
}
