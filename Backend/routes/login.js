import jwt from 'jsonwebtoken';
import express from 'express';
// import { users } from '../data/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
  
    if (!user) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }
  
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    res.json({ message: `Välkommen, ${user.name}`, token });
  });

  router.get('/me', authenticateToken, (req, res) => {
    // Här har vi access till req.user eftersom middleware har dekodat token
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
  });
  
  export default router;