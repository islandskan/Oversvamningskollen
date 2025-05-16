import jwt from 'jsonwebtoken';
import express from 'express';
import { query } from '../db.js'; // Din databasfunktion
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hämta användare baserat på användarnamn (eller e‑mail om så önskas)
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const user = result.rows[0];

    // Här bör du jämföra lösenordet – om du använder hashade lösenord, se till att använda t.ex. bcrypt.compare

    const match = await bcrypt.compare(password, user.password);
    if (!match){
      return res.status(401).json({error: 'fel lösenord'});
    }


    // if (user.password !== password) {
    //   // I en riktig applikation rekommenderas att du gör en säker lösenordskoll med hashning
    //   return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    // }

      if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET saknas i miljövariabler');
    }


    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: `Välkommen, ${email}`, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server login error' });
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
