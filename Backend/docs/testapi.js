// testapi.js
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /test:
 *   get:
 *     summary: A test endpoint
 *     description: Returns a simple message for testing Swagger setup
 *     responses:
 *       200:
 *         description: A simple success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, Swagger!"
 */
router.get('/', (req, res) => {
  res.json({ message: 'Hello, Swagger!' });
});

export default router;
