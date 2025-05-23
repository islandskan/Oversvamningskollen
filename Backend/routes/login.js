import jwt from 'jsonwebtoken';
import express from 'express';
import { query } from '../db.js'; 
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user from database based on email
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const user = result.rows[0];

    // Check if password matches
    const match = await bcrypt.compare(password, user.password);
    if (!match){
      return res.status(401).json({error: 'fel lösenord'});
    }


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
  // Here we can access req.user set by authenticateToken middleware
  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});

export default router;
