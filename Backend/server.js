// server.js
import app from './app.js';  // Import app from app.js
import handleProcessEvents from './startup/handleProcessEvents.js';
import dotenv from 'dotenv';
// import logger from './logger/logger.js';

dotenv.config(); // .env kommer nu att laddas från rotmappen automatiskt

handleProcessEvents();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  // logger.info(`Server is running on http://localhost:${PORT}`);
});
