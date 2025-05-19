// updatePasswords.js
import bcrypt from 'bcrypt';
import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function updatePasswords() {
  try {
    console.log('Starting password update process...');
    
    const result = await query('SELECT id, email, password FROM users');
    const users = result.rows;
    
    console.log(`Found ${users.length} users to update`);
    
    // Update each user's password with a hashed version
    const saltRounds = 10;
    
    for (const user of users) {
      // For demonstration purposes, we're using the current password as the plaintext to hash
      // In a real scenario, you might want to set specific passwords or use a different approach
      const plainTextPassword = user.password;
      const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
      
      // Update the user's password in the database
      await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
      console.log(`Updated password for user ${user.email} (ID: ${user.id})`);
    }
    
    console.log('Password update process completed successfully');
  } catch (error) {
    console.error('Error updating passwords:', error);
  }
}

updatePasswords();
