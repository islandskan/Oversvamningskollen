// server.js
import app from './app.js';
import handleProcessEvents from './startup/handleProcessEvents.js';
import logger from './logger/logger.js';

const PORT = process.env.PORT || 3000;

handleProcessEvents();

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  logger.info(`Server is running on http://localhost:${PORT}`);
});
