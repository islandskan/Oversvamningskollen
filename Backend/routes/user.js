import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hämtar alla användare' });
});

router.post('/', (req, res) => {
  const user = req.body;
  res.status(201).json({ message: 'Användare skapad', user });
});

export default router;
