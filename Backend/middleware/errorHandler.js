import logger from '../logger/logger.js';

export default function errorHandler(err, req, res, next) {
    logger.error(`${err.message} - ${req.method} ${req.url}`);
    
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
}