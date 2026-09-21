const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error("XATOLIK: DATABASE_URL environment o'zgaruvchisi topilmadi!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;