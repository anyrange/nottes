'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            range: { type: 'number', minimum: 3, default: 12 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    date: { type: 'string', format: 'datetime' },
                    _id: { type: 'string' },
                  },
                },
              },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
      preValidation: [fastify.auth],
    },
    async (req, reply) => {
      const { range } = req.query

      const pastes = await fastify.db.Paste.find({ author: req.session._id }, 'title date')
        .sort('-date')
        .limit(range)
        .lean()

      reply.send({ pastes })
    }
  )
}
