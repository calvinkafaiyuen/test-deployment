const { Pool } = require('pg');

const useSSL = process.env.DB_USE_SSL === 'true';
const sslConfig = useSSL ? { rejectUnauthorized: false } : null;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: sslConfig
});

async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = query;
