import express from 'express'
import {protect} from '../middleware/auth.js'
import {searchUsers} from '../controllers/searchController.js'
const router = express.Router()

router.get("/users",protect,searchUsers);

export default router