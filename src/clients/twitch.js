const tmi = require("tmi.js");
const knex = require('./db');
const tables = require("../constants/tables");

const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: process.env.TWITCH_CHANNEL.split(','),
});

module.exports = async () => {
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
        author_id: author[0].id || author[0],
      });
    }
  });
}
