const CryptoJS = require('crypto-js');

exports.seed = async function (knex) {
  await knex('users').where({ login: 'root' }).truncate()
  await knex('users').insert([
    { login: 'root', password: CryptoJS.SHA256('password').toString(), role: 'root' },
  ]);
};
