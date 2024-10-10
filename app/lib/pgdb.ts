// Desc: PostgreSQL database connection
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'), // Use default port if not specified
  ssl: true
//   ssl: {
//     rejectUnauthorized: false //HERE!
//   }
});

export default async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}
