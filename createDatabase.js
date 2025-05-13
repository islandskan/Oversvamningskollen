import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

// Connect to the default 'postgres' database to create our new database
const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const checkResult = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'floodcast'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('Creating database "floodcast"...');
      await client.query('CREATE DATABASE floodcast');
      console.log('Database "floodcast" created successfully');
    } else {
      console.log('Database "floodcast" already exists');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
