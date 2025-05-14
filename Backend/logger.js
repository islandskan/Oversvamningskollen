// logger.js
import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create file transports
const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, 'logs', 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '14d'
});

const exceptionFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, 'logs', 'exceptions-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const rejectionFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, 'logs', 'rejections-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    fileTransport,
    errorFileTransport
  ],
  exceptionHandlers: [
    exceptionFileTransport
  ],
  rejectionHandlers: [
    rejectionFileTransport
  ]
});

export default logger;
