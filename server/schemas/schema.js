import fp from "fastify-plugin";

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "schema",
    title: "schema",
    type: "",
  });
});
