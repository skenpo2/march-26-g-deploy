import express from 'express';
import {
  loginUser,
  registerUser,
  verifyEmail,
} from '../contollers/auth.contollers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);

export default router;
