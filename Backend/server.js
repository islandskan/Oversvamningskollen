// server.js
import app from './app.js';  // Import app from app.js
import handleProcessEvents from './startup/handleProcessEvents.js';
import dotenv from 'dotenv';
import logger from './logger/logger.js';

dotenv.config();

handleProcessEvents();

const PORT = process.env.PORT || 3000;
// had to edit this to be able to connect from a physical device without ngrok setup or simulator
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  console.log(`För externa anslutningar, använd http://[DIN_IP]:${PORT}`);
  logger.info(`Server is running on http://0.0.0.0:${PORT} (accessible from all network interfaces)`);
});
