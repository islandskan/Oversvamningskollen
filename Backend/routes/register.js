import bcrypt from 'bcrypt';
import express from 'express';
import {query} from '../db.js';

const router = express.Router();
const app = express();
app.use(express.json());

//registrera användare med bcrypt hashat och saltat lösenord
router.post('/', async (req, res) => {
  const {name, email, password} = req.body;
  
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

// Kolla om e‑post redan finns
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: 'E-postadressen är redan registrerad' }); 
}

// Hämta role_id för "user"
    const roleResult = await query('SELECT id FROM roles WHERE name = $1', ['user']);
    if (roleResult.rows.length === 0) {
      return res.status(500).json({ error: 'Standardrollen "user" saknas i databasen' });
    }
    const roleId = roleResult.rows[0].id;

//Lägg till ny användare med rolen "user"
const insertResult = await query(
  'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id',
  [name, email, hashedPassword, roleId]
);

    res.status(201).json({
      message: "Användaren registrerad",
      user: insertResult.rows[0],
    });

  } catch (err){
     console.error('Fel vid registrering, ', err);
    res.status(500).json({ error: 'Serverfel vid registrering' });
  }
});

export default router;
