// middleware/loggerMiddleware.js

import morgan from 'morgan';
import logger from '../logger/logger.js';

// Stream tells Morgan how to pass log messages to Winston
const stream = {
  write: (message) => logger.http(message.trim()) // trim to remove line breaks
};

// Optional filter: skip logs in production or for test routes
const skip = (req) => {
    return  process.env.NODE_ENV === 'production' ||  //logs only in dev
            req.url === '/favicon.ico';
  };
  

/**
 * Morgan format presets:
 * - 'dev'     – concise colored output for development
 * - 'tiny'    – minimal output
 * - 'combined'– Apache-style logs (IP, referrer, etc.)
 * You can also define your own format string.
 */
const morganMiddleware = morgan('dev', { stream, skip });

export default morganMiddleware;
