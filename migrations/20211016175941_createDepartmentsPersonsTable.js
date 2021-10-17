
exports.up = async function(knex) {
  await knex.schema.createTable('departmentsPersons', table => {
    table.integer('departmentId');
    table.integer('personId');
    table.string('position');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('departmentsPersons')
};
