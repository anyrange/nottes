export default async function plugin(fastify) {
  fastify.post("/login", (req, reply) => {
    reply.send();
  });
}
