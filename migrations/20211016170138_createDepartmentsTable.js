exports.up = async function (knex) {
  await knex.schema.createTable('departments', (table) => {
    table.increments();
    table.string('name');
    table.integer('parentId').nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('departments');
};
