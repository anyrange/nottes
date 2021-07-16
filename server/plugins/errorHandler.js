import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.setErrorHandler((err, req, reply) => {
    const { validation, code, message } = err;

    if (validation) return reply.code(statusCode).send(validate(err));

    if (code === "ETIMEDOUT")
      return reply
        .code(503)
        .send({ message: "Try again later", statusCode: code });

    if (code) return reply.code(code).send({ message, statusCode: code });

    reply
      .code(500)
      .send({ message: "Service is currently unavailable", statusCode: 500 });
    console.log(err);
  });
});

const validate = ({ validationContext, validation }) => {
  const result = validation[0];

  switch (validationContext) {
    case "querystring": {
      return {
        statusCode: 400,
        message: `Invalid query parameters:${result.dataPath.substring(1)} ${
          result.message
        }`,
      };
    }

    case "params":
      return {
        statusCode: 400,
        message: `Invalid ${result.dataPath.substring(1)}`,
      };

    case "body":
      return {
        statusCode: 400,
        message: `Invalid body: ${result.message}`,
      };

    default:
      return { statusCode: 400, message: "Bad request" };
  }
};

export default plugin;
