"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify) {
  fastify.addSchema({
    $id: "user",
    title: "user",
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", minLength: 3, maxLength: 30 },
      password: { type: "string", minLength: 8, maxLength: 20 },
    },
  });
});
