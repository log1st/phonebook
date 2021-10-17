exports.up = async function (knex) {
  await knex.schema.createTable('tokens', (table) => {
    table.increments();
    table.integer('userId');
    table.string('token');
    table.boolean('isActive').defaultTo(true);
  });

  await knex.schema.table('users', (table) => {
    table.dropColumn('token');
  });
};

exports.down = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.string('token');
  });

  await knex.schema.dropTable('tokens');
};
