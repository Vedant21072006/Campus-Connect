import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
export const createOrGetConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.body;

    // 1. Validate target user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // 2. Prevent chatting with yourself
    if (currentUserId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself",
      });
    }

    // 3. Create a consistent key for these two users
    const participantKey = [currentUserId.toString(), userId.toString()]
      .sort()
      .join("_");

    // 4. Check if conversation already exists
    let conversation = await Conversation.findOne({
      participantKey,
      type: "direct",
    }).populate(
      "participants",
      "_id username firstName lastName profilePicture"
    );

    // 5. If it exists, return it
    if (conversation) {
      return res.status(200).json({
        success: true,
        exists:true,
        conversation,
      });
    }

    // 6. Otherwise create a new conversation
    conversation = await Conversation.create({
      type: "direct",
      participants: [currentUserId, userId],
      participantKey,
      createdBy: currentUserId,
    });

    // 7. Populate participants before returning
    conversation = await conversation.populate(
      "participants",
      "_id username firstName lastName profilePicture"
    );

    return res.status(201).json({
      success: true,
      exists:false,
      conversation,
    });
  } catch (error) {
    console.error("Create/Get conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};


export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      })
      .populate(
        "participants",
        "_id username firstName lastName profilePicture"
      )
      .populate("lastMessage");

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    // Check that conversation exists
    // and the logged-in user belongs to it
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    }).select("_id");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .sort({ createdAt: 1 })
      .populate(
        "sender",
        "_id username firstName lastName profilePicture"
      );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { content } = req.body;

    // Check conversation and membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Validate message content
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      type: "text",
      content: content.trim(),
    });

    // Update conversation's latest message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    // Populate sender before returning
    const populatedMessage = await Message.findById(message._id)
      .populate(
        "sender",
        "_id username firstName lastName profilePicture"
      );

    const io = req.app.get("io");

    io.to(`conversation:${conversationId}`).emit(
      "new_message",
      populatedMessage
    );

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

