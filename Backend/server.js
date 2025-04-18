import express from 'express';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import dotenv from 'dotenv'; //? not in use

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route-mounting
app.use('/api/sensor', sensorRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
