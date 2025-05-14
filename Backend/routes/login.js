import jwt from 'jsonwebtoken';
import express from 'express';
import { query } from '../db.js'; // Din databasfunktion
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hämta användare baserat på användarnamn (eller e‑mail om så önskas)
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const user = result.rows[0];

    // Här bör du jämföra lösenordet – om du använder hashade lösenord, se till att använda t.ex. bcrypt.compare
    if (user.password !== password) {
      // I en riktig applikation rekommenderas att du gör en säker lösenordskoll med hashning
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: `Välkommen, ${user.name}`, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server login error' });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  // Här har vi access till req.user eftersom middleware har dekodat token
  res.json({
    id: req.user.id,
    username: req.user.username,
  });
});

export default router;
