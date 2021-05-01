module.exports = (fastify, opts, done) => {
  fastify.get("/questions", async () => {
    return { questions: 'all' }
  });
  done();
}