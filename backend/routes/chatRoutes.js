import express from "express";
import { createOrGetConversation,getConversations,getMessages,sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/conversations",
  protect,
  createOrGetConversation
);

router.get(
  "/conversations",
  protect,
  getConversations
);

router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessages
);

router.post(
  "/conversations/:conversationId/messages",
  protect,
  sendMessage
);
export default router;