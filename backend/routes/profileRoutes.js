import express from 'express'
import { completeOnboarding } from '../controllers/profileController.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

router.put('/complete-onboarding',protect,completeOnboarding)

export default router;