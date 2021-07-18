"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  fastify.register(require("fastify-cookie"));

  fastify.register(require("fastify-session"), {
    secret: process.env.SECRET,
  });

  fastify.decorate("checkAuth", async function (request, reply) {
    if (request.session.isAuth !== true) {
      reply.send({ message: "Authentication required" }).code(403);
    }
  });
});
