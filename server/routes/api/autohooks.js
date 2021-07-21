module.exports = async function (fastify) {
  fastify.addHook('preSerialization', async (request, reply, payload) => {
    payload.statusCode = reply.statusCode
  })
}
