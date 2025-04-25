import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import usersMockdata from '../data/mockdata/users.json' with { type: 'json' };
import '../docs/userSwagger.js'; // Import Swagger annotations

const router = Router();
let users = usersMockdata;

// GET all users
router.get('/', (req, res) => {
  if (users.length === 0) {
    return res.status(404).json({ message: 'Inga användare kunde hämtas' });
  }
  res.status(200).json({ message: 'Hämtar alla användare', users });
});

// GET specific user by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ message: 'Användare kan inte hittas' });
  }
  res.status(200).json({ message: 'Hämtar en användare', user });
});

// POST create user
router.post('/', (req, res) => {
  const { userName, mail, role, password } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!userName) missingFields.push('userName');
  if (!mail) missingFields.push('mail');
  if (!role) missingFields.push('role');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `All fields must be provided, missing fields: ${missingFields.join(', ')}` });
  }

  const user = {
    id: uuidv4(),
    userName,
    mail,
    role,
    password
  };

  users.push(user);

  res.status(201).json({ message: 'Användare skapad', user });
});

// PATCH update user
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const invalidFields = updates.filter(key => !['userName', 'mail', 'password'].includes(key));

  if (invalidFields.length > 0) {
    return res.status(400).json({ error: 'Ogiltiga fält i uppdateringen', invalidFields });
  }

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send('Användaren hittades inte');

  Object.assign(user, req.body);

  res.json({ message: 'Användare uppdaterad', user });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = users.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Användare hittades inte' });
  }

  users.splice(index, 1);

  res.json({ message: `Tog bort en användare med id: ${id}`, users });
});

export default router;
