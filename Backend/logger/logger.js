import {createLogger, format, transports} from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import {fileURLToPath} from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {combine, timestamp, label, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const createDailyRotateTransport = (filenameBase, level = 'info') =>
    new transports.DailyRotateFile({
        filename: path.join(__dirname, '..', 'logs', `${filenameBase}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
        level
    });

const isDev = process.env.NODE_ENV !== 'production';

const logger = createLogger({
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'warn'), //currently development, add NODE_ENV=development to .env
    format: combine(
        label({label: 'FloodCast'}),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ'}),
        myFormat
    ),
    transports: [
        new transports.Console(),
        createDailyRotateTransport('combined'),
        createDailyRotateTransport('error', 'error')
    ],
    exceptionHandlers: [
        createDailyRotateTransport('exceptions', 'error')
    ],
    rejectionHandlers: [
        createDailyRotateTransport('rejections', 'error')
    ]
});

export default logger;