
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { socketAuth } from "./middleware/socketAuth.js";
import Conversation from "./models/Conversation.js";

import authRoute from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import postRoute from "./routes/postRoute.js";
import friendRoute from "./routes/friendRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/post", postRoute);
app.use("/api/search", searchRoutes);
app.use("/api/friend", friendRoute);
app.use("/api/chat", chatRoutes);

await connectDB();
await connectRedis();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

// Authenticate every socket connection
io.use(socketAuth);

// userId -> Set of active socket IDs
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Authenticated socket connected:", socket.id);

  // Get the user ID from the verified JWT payload
  const userId =
    socket.user?._id ||
    socket.user?.id ||
    socket.user?.userId;

  if (!userId) {
    console.error(
      "Socket JWT does not contain a recognized user ID"
    );
    socket.disconnect(true);
    return;
  }

  socket.userId = String(userId);

  // Track this user's active socket connections
  const isFirstConnection = !onlineUsers.has(socket.userId);

  if (isFirstConnection) {
    onlineUsers.set(socket.userId, new Set());
  }

  onlineUsers.get(socket.userId).add(socket.id);

  // Notify other clients when the user first comes online
  if (isFirstConnection) {
    io.emit("user_online", {
      userId: socket.userId,
    });
  }

  // Send the current online-user list to this client
  socket.emit("online_users", {
    users: Array.from(onlineUsers.keys()),
  });

  console.log(
    "Current online users:",
    Array.from(onlineUsers.keys())
  );

  // Join a conversation only after verifying membership
  socket.on("join_conversation", async (conversationId, callback) => {
    try {
      if (
        typeof conversationId !== "string" ||
        !/^[a-fA-F0-9]{24}$/.test(conversationId)
      ) {
        return callback?.({
          success: false,
          message: "Invalid conversation ID",
        });
      }

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
      }).select("_id");

      if (!conversation) {
        return callback?.({
          success: false,
          message: "Conversation not found or access denied",
        });
      }

      const roomName = `conversation:${conversation._id}`;

      await socket.join(roomName);

      console.log(
        `User ${socket.userId} joined conversation room ${roomName}`
      );

      callback?.({
        success: true,
        conversationId: String(conversation._id),
      });
    } catch (error) {
      console.error("Join conversation error:", error);

      callback?.({
        success: false,
        message: "Unable to join conversation",
      });
    }
  });

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId) => {
    if (
      typeof conversationId === "string" &&
      /^[a-fA-F0-9]{24}$/.test(conversationId)
    ) {
      socket.leave(`conversation:${conversationId}`);
    }
  });

  // Remove this socket when it disconnects
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);

    const userSockets = onlineUsers.get(socket.userId);

    if (!userSockets) return;

    userSockets.delete(socket.id);

    // Mark the user offline only when all their sockets disconnect
    if (userSockets.size === 0) {
      onlineUsers.delete(socket.userId);

      io.emit("user_offline", {
        userId: socket.userId,
      });

      console.log("User went offline:", socket.userId);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
