import express from 'express';
import userRouter from './router/user.router.js';
import aiRouter from './router/ai.router.js';

const router = express.Router();

router.use('/auth', userRouter);
router.use('/ai', aiRouter);  

export default router;