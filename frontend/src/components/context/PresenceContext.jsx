
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../../socket/socket.js";

export const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const handleOnlineUsers = ({ users }) => {
      setOnlineUsers(users);
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers((prev) =>
        prev.filter((id) => id !== userId)
      );
    };

    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, []);

  const isOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  return (
    <PresenceContext.Provider value={{ onlineUsers, isOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);

  if (!context) {
    throw new Error("usePresence must be used inside PresenceProvider");
  }

  return context;
}
