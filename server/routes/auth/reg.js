export default async function plugin(fastify) {
  fastify.post("/reg", (req, reply) => {
    reply.send();
  });
}
