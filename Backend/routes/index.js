// routes/index.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello World!");
});

router.get('/error', (req, res, next) => {
    const err = new Error("Something went wrong!");
    next(err);
});

export default router;
