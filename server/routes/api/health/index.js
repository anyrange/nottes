'use strict'

module.exports = async function (fastify) {
  fastify.get('', { schema: { tags: ['server'] } }, async () => {
    return { message: "I'm alive", statusCode: 200 }
  })
}
