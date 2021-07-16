export default async function plugin(fastify) {
  fastify.delete("/logout", (req, reply) => {
    reply.send();
  });
}
