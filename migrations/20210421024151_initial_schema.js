exports.up = async (knex) => {
  await knex.schema.createTable('authors', (table) => {
    table.increments();
    table.string('name', 25).notNullable();
    table.text('avatar_url', 100).notNullable();
    table.timestamp('deleted_at');
    table.timestamps();
  });

  await knex.schema.createTable('questions', (table) => {
    table.increments();
    table.text('text').notNullable();
    table.integer('author_id').unsigned().references('authors.id');
    table.timestamp('replied_at');
    table.timestamps();
  });

  await knex.schema.createTable('questions_votes', (table) => {
    table.increments();
    table.integer('vote').notNullable();
    table.integer('question_id').unsigned().references('questions.id');
    table.string('ip_address', 15).notNullable();
    table.timestamps();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('author');
  await knex.schema.dropTable('questions');
  await knex.schema.dropTable('questions_votes');
};
