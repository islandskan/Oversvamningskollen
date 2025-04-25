// app.js
import express from 'express';
import dotenv from 'dotenv';
import logger from './logger/logger.js';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import errorHandler from './middleware/errorHandler.js';
import morganMiddleware from './middleware/loggerMiddleware.js';
import { swaggerSpec, swaggerUi } from './docs/swagger.js';
import testApi from './docs/testapi.js'; // Ensure this is correctly imported

dotenv.config();

const app = express();

app.use(express.json());
app.use(morganMiddleware);

// Serve Swagger UI and spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test API route should be used
/**
 * @swagger
 * /test:
 *   get:
 *     summary: A test endpoint
 *     description: Returns a simple message for testing Swagger setup
 *     responses:
 *       200:
 *         description: A simple success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, Swagger!"
 */
app.use('/api/test', testApi);  // Make sure you mount the test API correctly

// Other routes
app.use('/api/sensors', sensorRouter);
app.use('/api/users', userRouter);

// 404 handler
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ error: message });
});

// Global error handler
app.use(errorHandler);

export default app;
