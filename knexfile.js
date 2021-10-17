// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires
require('dotenv').config({
  path: process.env.NODE_ENV !== 'production' ? './.env.local' : './.env',
});

function config() {
  return {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
  };
}

module.exports = config();
