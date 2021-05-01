module.exports = (fastify, opts, done) => {
  fastify.get("/", async () => ({ hello: "world" }));
  done();
}