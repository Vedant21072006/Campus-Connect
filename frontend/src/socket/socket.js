import { io } from "socket.io-client";

const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Remove the /api suffix because Socket.IO connects to the server origin.
const socketUrl = apiUrl.replace(/\/api\/?$/, "");

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
