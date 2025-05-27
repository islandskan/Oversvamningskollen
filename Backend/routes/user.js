import { Router } from 'express';
import { query } from '../db.js'; 


const router = Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users'); // Hämta alla användare från databasen
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inga användare kunde hämtas' });
    }
    res.status(200).json({ message: 'Hämtar alla användare', users: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning av användare', error: err.message });
  }
});

// GET specific user by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]); 
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Användare kan inte hittas' });
    }
    res.status(200).json({ message: 'Hämtar en användare', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid hämtning av användare', error: err.message });
  }
});

// POST create user
router.post('/', async (req, res) => {
  const { userName, mail, role, password } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!userName) missingFields.push('userName');
  if (!mail) missingFields.push('mail');
  if (!role) missingFields.push('role');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Alla fält måste vara ifyllda, saknade fält: ${missingFields.join(', ')}` });
  }

  try {
    // Create new user in the database
    const result = await query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *', 
      [userName, mail, password, role]
    );
    res.status(201).json({ message: 'Användare skapad', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid skapande av användare', error: err.message });
  }
});

// PATCH update user
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const invalidFields = updates.filter(key => !['userName', 'mail', 'password'].includes(key));

  if (invalidFields.length > 0) {
    return res.status(400).json({ error: 'Ogiltiga fält i uppdateringen', invalidFields });
  }

  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }

    // Update user in the database
    // Use existing values if not provided in the request body
    const updatedUser = await query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [req.body.userName || result.rows[0].name, req.body.mail || result.rows[0].email, req.body.password || result.rows[0].password, id]
    );

    res.status(200).json({ message: 'Användare uppdaterad', user: updatedUser.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid uppdatering av användare', error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Användare hittades inte' });
    }

    res.status(200).json({ message: `Tog bort användare med id: ${id}`, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid radering av användare', error: err.message });
  }
});

export default router;
