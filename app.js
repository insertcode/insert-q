const fastify = require("fastify")({
  logger: true,
});

fastify.get("/", async () => ({ hello: "world" }));

const start = async () => {
  try {
    await fastify.listen(5000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
