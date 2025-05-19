import jwt from 'jsonwebtoken';
import express from 'express';
import { query } from '../db.js'; // Din databasfunktion
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);

    // Hämta användare baserat på användarnamn (eller e‑mail om så önskas)
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const user = result.rows[0];
    console.log(`User found: ${user.email}, ID: ${user.id}`);
    console.log(`Stored password hash: ${user.password.substring(0, 20)}...`);

    // Här bör du jämföra lösenordet – om du använder hashade lösenord, se till att använda t.ex. bcrypt.compare
    try {
      const match = await bcrypt.compare(password, user.password);
      console.log(`Password match result: ${match}`);

      if (!match) {
        return res.status(401).json({error: 'fel lösenord'});
      }
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ error: 'Error verifying password', details: bcryptError.message });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing in environment variables');
      throw new Error('JWT_SECRET saknas i miljövariabler');
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated successfully');

    res.json({ message: `Välkommen, ${email}`, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server login error', details: err.message });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  // Här har vi access till req.user eftersom middleware har dekodat token
  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});

export default router;
