import dotenv from 'dotenv';
import pkg from 'pg'

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

export const query = (text, params) => pool.query(text, params);