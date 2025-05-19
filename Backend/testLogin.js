// testLogin.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'securepassword1',
      }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.token) {
      console.log('Login successful! JWT token received.');
      
      // Test the protected endpoint
      console.log('\nTesting protected endpoint (/login/me)...');
      
      const meResponse = await fetch('http://localhost:3000/login/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      const meData = await meResponse.json();
      
      console.log('Protected endpoint status:', meResponse.status);
      console.log('Protected endpoint data:', meData);
      
      if (meResponse.status === 200) {
        console.log('Authentication system is working correctly!');
      } else {
        console.log('Authentication system has issues with protected routes.');
      }
    } else {
      console.log('Login failed. No JWT token received.');
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

// Run the function
testLogin();
