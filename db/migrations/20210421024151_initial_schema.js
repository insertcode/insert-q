const tables = require('../../src/constants/tables')

exports.up = async (knex) => {
  await knex.schema.createTable(tables.AUTHORS, (table) => {
    table.increments();
    table.string('name', 25).notNullable();
    table.text('avatar_url', 100).notNullable();
    table.datetime('deleted_at');
    table.timestamps(false, true);
  });

  await knex.schema.createTable(tables.QUESTIONS, (table) => {
    table.increments();
    table.text('text').notNullable();
    table.integer('author_id').unsigned().references(`${tables.AUTHORS}.id`);
    table.datetime('replied_at');
    table.timestamps(false, true);
  });

  await knex.schema.createTable(tables.QUESTIONS_VOTES, (table) => {
    table.increments();
    table.integer('vote').notNullable();
    table.integer('question_id').unsigned().references(`${tables.QUESTIONS}.id`);
    table.string('ip_address', 15).notNullable();
    table.datetime('deleted_at');
    table.timestamps(false, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tables.QUESTIONS_VOTES);
  await knex.schema.dropTable(tables.QUESTIONS);
  await knex.schema.dropTable(tables.AUTHORS);
};
