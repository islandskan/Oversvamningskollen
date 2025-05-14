// app.js
import express from 'express';
import dotenv from 'dotenv';
// import logger from './logger/logger.js';
// import morganMiddleware from './middleware/loggerMiddleware.js';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import emergencyContactsRouter from './routes/emergencyContacts.js';
import errorHandler from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';  // Import swagger-ui-express
import YAML from 'yamljs';
import loginRouter from './routes/login.js';

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

// Läs in Swagger-specifikationen från YAML-filen
const swaggerDocument = YAML.load('./Backend/docs/swagger.yaml');

// Serve Swagger API Docs at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Andra rutter
router.use('/api/sensors', sensorRouter);
router.use('/api/users', userRouter);
router.use('/api/login', loginRouter);
app.use('/api/emergency-contacts', emergencyContactsRouter);
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
