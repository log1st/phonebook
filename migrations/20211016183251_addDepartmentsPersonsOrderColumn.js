
exports.up = async function(knex) {
  await knex.schema.table('departmentsPersons', table => {
    table.integer('order')
  })
};

exports.down = async function(knex) {
  await knex.schema.table('departmentsPersons', table => {
    table.dropColumn('order')
  })
};
