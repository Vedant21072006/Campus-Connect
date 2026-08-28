import express from 'express'
import { acceptRequest, getFriends, getFriendStatus, getIncomingRequests, getSentRequests, rejectRequest, removeFriend, sendRequest } from '../controllers/friendController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router()
router.post('/request/:recipientId',protect,sendRequest)
router.patch('/request/:requesterId/accept',protect,acceptRequest)
router.patch('/request/:requestId/reject',protect,rejectRequest)

router.patch('/request/remove-friend/:friendId',protect,removeFriend)
router.get('/request/getIncomingRequests',protect,getIncomingRequests)
router.get('/request/getSentRequests',protect,getSentRequests)
router.get('/request/getFriends/:userId',protect,getFriends)
router.get('/request/getFriendsStatus/userId',protect,getFriendStatus)
export default router;