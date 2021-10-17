
exports.up = async function(knex) {
  await knex.schema.table('departments', table => {
    table.integer('order')
  })
};

exports.down = async function(knex) {
  await knex.schema.table('departments', table => {
    table.dropColumn('order')
  })
};
