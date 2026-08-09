import express from 'express'
import { protect } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../controllers/postController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router()


router.post('/createPost',protect,upload.array("media",5),createPost)
router.get('/getpost',protect,getPosts)
router.delete('/delete-post/:id',protect,deletePost)

export default router;