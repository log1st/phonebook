exports.up = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.string('token');
  });
};

exports.down = async function (knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('token');
  });
};
