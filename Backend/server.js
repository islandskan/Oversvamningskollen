import express from 'express';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import errorHandler from "./middleware/errorHandler.js";
import handleProcessEvents from "./startup/handleProcessEvents.js";
import dotenv from 'dotenv';
dotenv.config();

handleProcessEvents();

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

app.use(errorHandler);

logger.info(`Logger initialized at level: ${logger.level}`);

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
