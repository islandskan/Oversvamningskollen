import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../db.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Check if the user already exists in your database
    const existingUser = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    let user;

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      // Create a new user in your database
      const result = await query(
        'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *',
        [name, email, googleId]
      );
      user = result.rows[0];
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });

  } catch (error) {
    console.error(' Google login error:', error);
    res.status(401).json({ error: 'Ogiltig Google-token' });
  }
});

export default router;
