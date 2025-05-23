import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config(); // .env will be loaded here automatically

const pgUri = process.env.PG_URI;

if (!pgUri) {
  throw new Error('PG_URI är inte definierad! Kontrollera att .env-filen finns i rotmappen och innehåller rätt data.');
}

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

export const query = (text, params) => pool.query(text, params);
