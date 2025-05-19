// app.js
import express from 'express';
import dotenv from 'dotenv';
import sensorRouter from './routes/sensor.js';
import userRouter from './routes/user.js';
import emergencyContactsRouter from './routes/emergencyContacts.js';
import swaggerUi from 'swagger-ui-express';  // Import swagger-ui-express
import YAML from 'yamljs';
import loginRouter from './routes/login.js';
import googleRouter from './routes/google.js';
import registerRouter from './routes/register.js';
import logger from './logger.js';  // Import the logger

dotenv.config();

const app = express();
const router = express.Router();
// IMPORTANT DEV ONLY , NEED TO EDIT THIS IN PROD FOR SECURITY REASONS
// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Läs in Swagger-specifikationen från YAML-filen
const swaggerDocument = YAML.load('./Backend/docs/swagger.yaml');

// Serve Swagger API Docs at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Andra rutter
router.use('/api/sensors', sensorRouter);
router.use('/api/users', userRouter);
router.use('/login', loginRouter);
router.use('/auth/google', googleRouter);
router.use('/register', registerRouter);
app.use('/api/emergency-contacts', emergencyContactsRouter);
app.use(router);



// 404 handler
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  res.status(404).json({ error: message });
});


export default app;
