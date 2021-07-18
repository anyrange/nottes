"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify) {
  if (process.env.DEVELOPMENT === "server") return;
  fastify.register(require("fastify-nuxtjs")).after(() => {
    fastify.nuxt("*");
  });
});
