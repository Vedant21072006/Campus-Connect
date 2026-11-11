import mongoose from "mongoose";

import Message from "../models/message.js";
import Conversation from "../models/Conversation.js";

import {
    createMessageSchema,
} from "../validators/chatValidator.js";


export const createMessage = async ({
    conversationId,
    senderId,
    content,
    clientMessageId,
}) => {

    // Validate incoming message data
    const validatedData = createMessageSchema.parse({
        conversationId,
        content,
        clientMessageId,
    });


    // Validate sender ID
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        throw new Error("Invalid sender ID");
    }


    // Make sure sender belongs to conversation
    const conversation = await Conversation.findOne({
        _id: validatedData.conversationId,
        participants: senderId,
    });

    if (!conversation) {
        throw new Error(
            "Conversation not found or you are not a participant"
        );
    }


    // Prevent duplicate messages
    if (validatedData.clientMessageId) {

        const existingMessage = await Message.findOne({
            conversation: validatedData.conversationId,
            sender: senderId,
            clientMessageId: validatedData.clientMessageId,
        });

        if (existingMessage) {
            return existingMessage.populate(
                "sender",
                "_id username firstName lastName profilePicture"
            );
        }
    }


    // Create message
    const message = await Message.create({
        conversation: validatedData.conversationId,
        sender: senderId,
        type: "text",
        content: validatedData.content,
        clientMessageId:
            validatedData.clientMessageId || null,
    });


    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();


    // Return populated message
    const populatedMessage =
        await Message.findById(message._id)
            .populate(
                "sender",
                "_id username firstName lastName profilePicture"
            );

    return populatedMessage;
};