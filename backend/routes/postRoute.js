import express from 'express'
import { protect } from '../middleware/auth.js';
import { createPost, deletePost, getPosts, likePost, myPosts, unlikePost,getComments,createComment,deleteComment } from '../controllers/postController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router()


router.post('/createPost',protect,upload.array("media",5),createPost)
router.get('/getpost',protect,getPosts)
router.delete('/delete-post/:id',protect,deletePost)
router.get('/my-posts/:id',protect,myPosts)

router.post("/:postId/like", protect, likePost);

router.delete("/:postId/unlike", protect, unlikePost);

router.get("/get-comments/:postId",protect,getComments)
router.post("/:postId/create-comment",protect,createComment)
router.delete("/delete-comment/:commentId",protect,deleteComment)
export default router;