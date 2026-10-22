import express from 'express';
import { loginUser, registerUser,logoutUser,getMe } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/get-me', authMiddleware, getMe);

export default router;
