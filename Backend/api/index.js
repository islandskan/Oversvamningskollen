import express from 'express';
import dotenv from 'dotenv';
import sensorRouter from '../routes/sensor.js';
import userRouter from '../routes/user.js';
import emergencyContactsRouter from '../routes/emergencyContacts.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import loginRouter from '../routes/login.js';
import googleRouter from '../routes/google.js';
import registerRouter from '../routes/register.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cronRouter from './cron.js';


// Load environment variables
dotenv.config();

// For handling __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const router = express.Router();

app.use(express.json());

// Swagger Docs
const swaggerDocument = YAML.load(join(__dirname, '../swagger/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
router.use('/api/sensors', sensorRouter);
router.use('/api/users', userRouter);
router.use('/login', loginRouter);
router.use('/auth/google', googleRouter);
router.use('/register', registerRouter);
app.use(cronRouter);
app.use('/api/emergency-contacts', emergencyContactsRouter);
app.use(router);

// ✅ Add this route for the root
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// 404 Handler
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  res.status(404).json({ error: message });
});

export default app;
