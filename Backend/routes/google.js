import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../db.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verifiera tokenen med Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Kolla om användaren redan finns i din databas
    const existingUser = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    let user;

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      // Skapa ny användare
      const result = await query(
        'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *',
        [name, email, googleId]
      );
      user = result.rows[0];
    }

    // Skapa JWT för din egen session
    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });

  } catch (error) {
    console.error('❌ Google login error:', error);
    res.status(401).json({ error: 'Ogiltig Google-token' });
  }
});

export default router;
