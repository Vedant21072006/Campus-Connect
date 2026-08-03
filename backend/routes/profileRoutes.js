import express from 'express'
import { completeOnboarding, getMyProfile } from '../controllers/profileController.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

router.put('/complete-onboarding',protect,completeOnboarding)
router.get('/my-profile',protect,getMyProfile)


export default router;