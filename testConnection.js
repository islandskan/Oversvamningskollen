import { query } from './Backend/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('PG_URI:', process.env.PG_URI);
    
    const result = await query('SELECT NOW()');
    console.log('Connection successful!');
    console.log('Current timestamp from database:', result.rows[0].now);
    
    return true;
  } catch (err) {
    console.error('Connection failed:', err.message);
    return false;
  }
}

testConnection();
