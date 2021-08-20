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
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  avatar: { type: 'string', default: '' },
                  registered: { type: 'string' },
                  platform: { type: 'string' },
                },
              },
              stats: {
                type: 'object',
                properties: {
                  total: { type: 'number', default: 0 },
                  public: { type: 'number', default: 0 },
                  shared: { type: 'number', default: 0 },
                  unlisted: { type: 'number', default: 0 },
                  private: { type: 'number', default: 0 },
                  views: { type: 'number', default: 0 },
                  contributions: { type: 'number', default: 0 },
                },
              },

              statusCode: { type: 'number' },
            },
          },
        },
        tags: ['users'],
      },
    },
    async (request, reply) => {
      const user = await fastify.db.User.findOne({ username: request.params.username }).lean()
      if (!user) return reply.code(404).send({ message: 'User not found' })

      const [groupedVisibility, contributions] = await Promise.all([
        fastify.db.Paste.aggregate()
          .match({ author: user._id })
          .group({
            _id: { visibility: '$visibility' },
            sum: { $sum: 1 },
            views: { $sum: { $size: '$views' } },
          }),
        fastify.db.Paste.find({ contributors: user._id }).countDocuments(),
      ])

      const stats = Object.fromEntries(groupedVisibility.map((item) => [item._id.visibility, item.sum]))
      stats.total = groupedVisibility.reduce((sum, item) => sum + item.sum, 0)
      stats.views = groupedVisibility.reduce((sum, item) => sum + item.views, 0)
      stats.contributions = contributions

      reply.send({ user, stats })
    }
  )
}
