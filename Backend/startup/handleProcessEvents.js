// startup/handleProcessEvents.js
import logger from '../logger/logger.js';

export default function handleProcessEvents() {
    process.on("uncaughtException", (err) => {
        logger.error(`Uncaught Exception: ${err.message}`);
        process.exit(1); // Optional shutdown
    });

    process.on("unhandledRejection", (reason) => {
        logger.error(`Unhandled Rejection: ${reason}`);
    });
}
