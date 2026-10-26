const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error("XATOLIK: DATABASE_URL environment o'zgaruvchisi topilmadi!");
}

const isLocal = !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('localhost') || 
  process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
});

module.exports = pool;