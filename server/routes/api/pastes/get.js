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
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const { page, range, search } = request.query

      const pastes = await fastify.db.Paste.find(
        {
          visibility: { $ne: 'private' },
          title: { $regex: search, $options: 'gi' },
        },
        'title date code _id'
      )
        .sort('-date')
        .skip((page - 1) * range)
        .limit(range)
        .lean()

      reply.send({ pastes })
    }
  )
}
