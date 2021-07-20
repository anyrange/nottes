'use strict'

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            range: { type: 'number', minimum: 3 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              pastes: { type: 'array', items: fastify.getSchema('paste') },
              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['paste'],
      },
    },
    async (request, reply) => {
      const range = request.query.range || 12

      const pastes = await fastify.db.Paste.find(
        { visibility: { $nin: ['unlisted', 'private'] } },
        'title user id date -_id'
      )
        .sort('-date')
        .limit(range)

      const authors = await Promise.all(
        pastes.map((paste) =>
          paste.user
            ? fastify.db.User.findOne({ _id: paste.user }, 'username avatar -_id').lean()
            : { username: 'Guest', avatar: '' }
        )
      )

      reply.send({
        pastes: pastes.map((pasta, index) => {
          return { title: pasta.title, date: pasta.date, id: pasta.id, author: authors[index] }
        }),
        statusCode: 200,
      })
    }
  )
}
