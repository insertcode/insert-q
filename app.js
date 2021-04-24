const fastify = require("fastify")({
  logger: true,
});
const tmi = require("tmi.js");

const tables = require("./src/constants/tables");

require("dotenv").config();

const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: ["xabadu"],
});

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
  },
});

fastify.get("/", async () => ({ hello: "world" }));

const start = async () => {
  try {
    await fastify.listen(5000);
    await client.connect();
    client.on("message", async (channel, tags, message) => {
      if (message.toLowerCase().startsWith("!q ")) {
        let author = await knex
          .table(tables.AUTHORS)
          .select("id")
          .where("name", tags["display-name"]);
        if (author.length > 0) {
          await knex
            .table(tables.AUTHORS)
            .where("id", author[0].id)
            .update({
              name: tags["display-name"],
              avatar_url: "https://insertcode.tv/image.jpg",
            });
        } else {
          author = await knex(tables.AUTHORS).insert({
            name: tags["display-name"],
            avatar_url: "https://insertcode.xyz",
          });
        }
        await knex(tables.QUESTIONS).insert({
          text: message.substring(3),
          author_id: author[0].id,
        });
      }
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
