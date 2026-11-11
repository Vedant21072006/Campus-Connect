import Conversation from "../models/Conversation.js";
import { createMessage } from "../services/messageService.js";

const onlineUsers = new Map();
export const setupChatSocket = (io) => {

    io.on("connection", (socket) => {

        // Track connected socket for this user
if (!onlineUsers.has(socket.userId)) {
    onlineUsers.set(socket.userId, new Set());
}

onlineUsers.get(socket.userId).add(socket.id);

// Notify everyone that this user is online
io.emit("user_online", {
    userId: socket.userId,
});

// Send current online users to the newly connected user
 console.log(
  "Sending online users:",
  Array.from(onlineUsers.keys())
);

socket.emit("online_users", {
  users: Array.from(onlineUsers.keys()),
});

socket.emit("online_users", {
    users: Array.from(onlineUsers.keys()),
});

        console.log("Socket connected:", socket.id);
        console.log("Authenticated user:", socket.userId);

        // 1. Personal room
        socket.join(`user:${socket.userId}`);

        console.log(
            `User joined room: user:${socket.userId}`
        );


        // 2. Join conversation
        socket.on("join_conversation", async ({ conversationId }) => {
            try {

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participants: socket.userId,
                }).select("_id");

                if (!conversation) {
                    return socket.emit("chat_error", {
                        message: "Conversation not found or access denied",
                    });
                }

                socket.join(`conversation:${conversationId}`);

                console.log(
                    `User ${socket.userId} joined conversation:${conversationId}`
                );

            } catch (error) {

                console.error(
                    "Join conversation error:",
                    error.message
                );

                socket.emit("chat_error", {
                    message: "Failed to join conversation",
                });
            }
        });


        // 3. Send message ← ADD IT HERE
        socket.on("send_message", async (data) => {
            try {

                const {
                    conversationId,
                    content,
                    clientMessageId,
                } = data;

                const message = await createMessage({
                    conversationId,
                    senderId: socket.userId,
                    content,
                    clientMessageId,
                });

                // Confirmation to sender
                socket.emit("message_sent", {
                    message,
                });

                // Send to other people in conversation
                socket
                    .to(`conversation:${conversationId}`)
                    .emit("new_message", {
                        message,
                    });

                    

            } catch (error) {

                console.error(
                    "Send message error:",
                    error.message
                );

                socket.emit("message_error", {
                    message: error.message,
                });
            }


        });

        socket.on("disconnect", () => {
    const userSockets = onlineUsers.get(socket.userId);

    if (!userSockets) return;

    userSockets.delete(socket.id);

    if (userSockets.size === 0) {
        onlineUsers.delete(socket.userId);

        io.emit("user_offline", {
            userId: socket.userId,
        });
    }

    console.log("Socket disconnected:", socket.id);
});

    });
};