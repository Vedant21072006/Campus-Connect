import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized: Missing authentication cookie"));
    }

    // Extract the HTTP-only token cookie
    const tokenCookie = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Unauthorized: Missing token"));
    }

    const token = decodeURIComponent(
      tokenCookie.substring("token=".length)
    );

    // Verify using the same secret as the REST authentication
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Store the verified JWT payload on the socket
    socket.user = decoded;

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    next(new Error("Unauthorized: Invalid or expired token"));
  }
};
