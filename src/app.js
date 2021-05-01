require("dotenv").config();
const fastify = require("fastify")({
  logger: true,
});
const twitchClient = require('./clients/twitch');


fastify.register(require('./routes/base'), { prefix: 'api' });

const start = async () => {
  try {
    await fastify.listen(5000);
    twitchClient();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
