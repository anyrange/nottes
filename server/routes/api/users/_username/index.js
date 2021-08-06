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
              user: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  avatar: { type: 'string', default: '' },
                  registered: { type: 'string' },
                  platform: { type: 'string' },
                  stats: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      public: { type: 'number' },
                      unlisted: { type: 'number' },
                      private: { type: 'number' },
                      views: { type: 'number' },
                    },
                  },
                },
              },
              pastes: {
                type: 'array',
                items: { $ref: 'paste#/definitions/micropaste' },
              },
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
        title: {
          $regex: search,
          $options: 'gi',
        },
        visibility: { $ne: 'private' },
      }

      if (request.session.get('_id') === String(user._id)) delete query.visibility

      const pastes = await fastify.db.Paste.find(query, 'title date id code views visibility')
        .sort('-date')
        .skip((page - 1) * range)
        .limit(range)
        .lean()

      user.stats = {
        total: pastes.length,
        public: pastes.filter((p) => p.visibility === 'public').length,
        unlisted: pastes.filter((p) => p.visibility === 'unlisted').length,
        private: pastes.filter((p) => p.visibility === 'private').length,
        views: pastes.reduce((total, current) => total + current.views.length, 0),
      }

      reply.send({ user, pastes })
    }
  )
}
