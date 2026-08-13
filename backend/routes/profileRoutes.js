import express from 'express'
import { completeOnboarding, getMyProfile, updateCoverPicture, updateProfilePicture } from '../controllers/profileController.js'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router()

router.put('/complete-onboarding',protect,completeOnboarding)
router.get('/my-profile',protect,getMyProfile)
router.patch('/profile-picture',protect,upload.single("profilePicture"),updateProfilePicture)
router.patch('/cover-picture',protect,upload.single("coverPicture"),updateCoverPicture)

export default router;