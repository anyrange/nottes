"use strict";

module.exports = async function (fastify) {
  fastify.delete("", { schema: { response: { 200: fastify.getSchema("message") } } }, (request, reply) => {
    reply.clearCookie("session", fastify.cookieOptions).send({ message: "OK", statusCode: 200 });
  });
};
