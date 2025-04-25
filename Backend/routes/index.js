// routes/index.js
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Return a Hello World message
 *     description: This endpoint returns a simple Hello World message.
 *     responses:
 *       200:
 *         description: A simple Hello World message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello World!"
 */
router.get('/', (req, res) => {
    res.send("Hello World!");
});

/**
 * @swagger
 * /error:
 *   get:
 *     summary: Return an error message
 *     description: This endpoint is used to simulate an error.
 *     responses:
 *       500:
 *         description: Error occurred
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Something went wrong!"
 */
router.get('/error', (req, res, next) => {
    const err = new Error("Something went wrong!");
    next(err);
});

export default router;
