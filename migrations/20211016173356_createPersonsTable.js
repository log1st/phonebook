exports.up = async function (knex) {
  await knex.schema.createTable('persons', (table) => {
    table.increments('id');
    table.string('firstName');
    table.string('lastName');
    table.string('middleName');
    table.string('photoUrl');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('persons');
};
