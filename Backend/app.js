// app.js
import express from 'express';
import dotenv from 'dotenv';
import logger from './logger/logger.js';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import errorHandler from './middleware/errorHandler.js';
import morganMiddleware from './middleware/loggerMiddleware.js';
import { swaggerDocs } from './docs/swagger.js';  // Import the swaggerDocs
import swaggerUi from 'swagger-ui-express';  // Import swagger-ui-express

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());
app.use(morganMiddleware);

// Serve Swagger API Docs at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Other routes
router.use('/api/sensors', sensorRouter);
router.use('/api/users', userRouter);
app.use(router);

// 404 handler
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ error: message });
});

// Global error handler
app.use(errorHandler);

export default app;
