
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getme } from "../../services/meApi.js";
import socket from "../../socket/socket.js";

export default function SocketProvider({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;

    const manageSocket = async () => {
      const userId = await getme();

      if (cancelled) return;

      if (userId) {
        if (!socket.connected) {
          socket.connect();
          console.log("Global socket connection initiated");
        }
      } else {
        socket.disconnect();
        console.log("No authenticated user. Socket disconnected.");
      }
    };

    manageSocket();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return children;
}
