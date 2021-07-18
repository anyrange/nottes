"use strict";

const bcrypt = require("bcrypt");

module.exports = async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        body: fastify.getSchema("user"),
        response: { X00: fastify.getSchema("message") },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const { _id } = await fastify.db.User.create({ username, password: hashedPassword }).catch((err) => {
        if (err.code === 11000) {
          reply.code(400).send({ statusCode: 400, message: `Username ${err.keyValue.username} is already taken` });
        }
      });

      const token = fastify.jwt.sign({ _id });

      reply.setCookie("session", token, fastify.cookieOptions);
      reply.send({ message: "Success", statusCode: 200 });
    }
  );
};
