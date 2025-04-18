import express from 'express';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import dotenv from 'dotenv'; //? not in use

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Startsida!');
});

// Route-mounting
app.use('/api/sensors', sensorRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
