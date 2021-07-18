"use strict";

module.exports = async function (fastify) {
  fastify.get("", async (request, reply) => {
    reply.send("true");
  });
};
