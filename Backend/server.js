import express from 'express';
import logger from './logger/logger.js';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import errorHandler from "./middleware/errorHandler.js";
import handleProcessEvents from "./startup/handleProcessEvents.js";
import dotenv from 'dotenv';
import morganMiddleware from './middleware/loggerMiddleware.js';

dotenv.config();

handleProcessEvents();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ This logs all HTTP requests (GET, POST, etc.) in dev mode
app.use(morganMiddleware);

// Basic route
app.get('/', (req, res) => {
  res.send('Startsida!');
});

// Route-mounting
app.use('/api/sensors', sensorRouter);
app.use('/api/users', userRouter);

// undefined routes are logged
app.use((req, res, next) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ error: message });
});

app.use(errorHandler);

logger.info(`Logger initialized at level: ${logger.level}`);

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  logger.info(`Servern körs på http://localhost:${PORT}`);
});
