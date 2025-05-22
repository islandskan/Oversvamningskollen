const express = require('express');
const dotenv = require('dotenv');
const sensorRouter = require('../routes/sensor.js');
const userRouter = require('../routes/user.js');
const emergencyContactsRouter = require('../routes/emergencyContacts.js');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const loginRouter = require('../routes/login.js');
const googleRouter = require('../routes/google.js');
const registerRouter = require('../routes/register.js');

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

// Swagger Docs
const swaggerDocument = YAML.load('./Backend/docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
router.use('/api/sensors', sensorRouter);
router.use('/api/users', userRouter);
router.use('/login', loginRouter);
router.use('/auth/google', googleRouter);
router.use('/register', registerRouter);
app.use('/api/emergency-contacts', emergencyContactsRouter);
app.use(router);

// 404 Handler
app.use((req, res) => {
  const message = `404 - Not Found - ${req.originalUrl}`;
  res.status(404).json({ error: message });
});

module.exports = app;
