import express from 'express'
import { login, logout, register, verifyotp } from '../controllers/authController.js';

const router = express.Router()

router.post('/register',register)
router.post('/verify-otp',verifyotp)
router.post('/login',login)
router.post('/logout',logout)

export default router;
