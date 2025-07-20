const { Pool } = require('pg');

const pool = new Pool({
  user: 'first_tacos',
  host: 'localhost',
  database: 'database_tacoscanasta',
  password: 'tacosdecanasta2025',
  port: 5432,
});

module.exports = pool;
