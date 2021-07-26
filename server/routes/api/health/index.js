'use strict'

module.exports = async function (fastify) {
  fastify.get('', { schema: { response: { 200: { $ref: 'message#' } }, tags: ['server'] } }, async () => {
    return { message: "I'm alive" }
  })
}
