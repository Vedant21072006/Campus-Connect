import express from 'express'
import { protect } from '../middleware/auth.js';
import { createPost } from '../controllers/postController.js';

const router = express.Router()


router.post('/createPost',protect,createPost)

export default router;