import pkg from 'pg';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import readline from 'readline';

dotenv.config();

const { Client } = pkg;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function setupPostgres() {
  console.log('=== PostgreSQL Setup for FloodCast ===');
  
  // Get PostgreSQL credentials
  const username = await prompt('Enter PostgreSQL username (default: postgres): ') || 'postgres';
  const password = await prompt('Enter PostgreSQL password: ');
  
  // Update .env file with the correct credentials
  const connectionString = `postgres://${username}:${password}@localhost:5432/floodcast`;
  process.env.PG_URI = connectionString;
  
  console.log('\nAttempting to connect to PostgreSQL...');
  
  // Connect to the default 'postgres' database
  const client = new Client({
    connectionString: `postgres://${username}:${password}@localhost:5432/postgres`
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL server');
    
    // Check if database exists
    const checkResult = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'floodcast'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('\nCreating database "floodcast"...');
      await client.query('CREATE DATABASE floodcast');
      console.log('✅ Database "floodcast" created successfully');
    } else {
      console.log('\n✅ Database "floodcast" already exists');
    }
    
    // Close the connection to postgres database
    await client.end();
    
    // Update .env file
    console.log('\nUpdating .env file with connection string...');
    const fs = await import('fs');
    const envContent = `PG_URI=${connectionString}\nNODE_ENV=development\nPORT=3000\n`;
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file updated');
    
    // Run setupDatabase.js to create tables
    console.log('\nCreating database tables...');
    await runScript('Backend/setupDatabase.js');
    
    // Run seed.js to populate with test data
    console.log('\nPopulating database with test data...');
    await runScript('Backend/data/mockdata/seed.js');
    
    console.log('\n=== Setup Complete ===');
    console.log('You can now start the server with: npm run dev');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\nPlease check:');
    console.log('1. PostgreSQL is running');
    console.log('2. The credentials you provided are correct');
    console.log('3. You have permission to create databases');
  } finally {
    rl.close();
  }
}

// Function to run a Node.js script
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
  });
}

setupPostgres();
