// app.js
import express from 'express';
import dotenv from 'dotenv';
import logger from './logger/logger.js';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import errorHandler from "./middleware/errorHandler.js";
import morganMiddleware from './middleware/loggerMiddleware.js';
import { swaggerSpec, swaggerUi } from './swagger.js'; // Import Swagger UI and spec


dotenv.config();

const app = express();

app.use(express.json());
app.use(morganMiddleware);

// Loggar POST/PUT-request-bodies
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    logger.debug(`Request Body for ${req.method} ${req.url}: ${JSON.stringify(req.body)}`);
  }
  next();
});

// Swagger setup: Serve the documentation on '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Startsida
app.get('/', (req, res) => {
  res.send('Startsida!');
});

// API routes
app.use('/api/sensors', sensorRouter);
app.use('/api/users', userRouter);

// Fångar 404
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ error: message });
});

// Global error handler
app.use(errorHandler);

export default app;
