
exports.up = async function(knex) {
  await knex.schema.createTable('contacts', table => {
    table.increments('id');
    table.integer('personId');
    table.enum('type', ['phone', 'email', 'address']);
    table.string('label').nullable();
    table.string('value');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTable('contacts')
};
