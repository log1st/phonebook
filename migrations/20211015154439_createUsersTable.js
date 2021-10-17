module.exports = {
  up: async (knex) => {
    await knex.schema.createTable('users', (table) => {
      table.increments();
      table.string('login');
      table.string('password');
      table.enum('role', ['root', 'admin', 'user']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable('users');
  },
};
