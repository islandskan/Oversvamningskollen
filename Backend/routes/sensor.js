import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hämtar alla sensordata' });
});

router.post('/', (req, res) => {
  const sensor = req.body;
  // Här kan man lägga till logik för att spara i databas eller lista
  res.status(201).json({ message: 'Sensor skapad', sensor });
});

export default router;
