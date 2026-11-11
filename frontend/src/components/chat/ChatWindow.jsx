import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import socket from "../../socket/socket.js";
import { usePresence } from "../context/PresenceContext.jsx";

const ChatWindow = ({ conversation, currentUserId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const { isOnline } = usePresence();

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const conversationId = conversation?._id
    ? String(conversation._id)
    : null;

  // Identify the other participant.
  const otherUser = conversation?.participants?.find(
    (participant) =>
      String(participant._id) !== String(currentUserId)
  );

  const displayName = otherUser
    ? [otherUser.firstName, otherUser.lastName]
        .filter(Boolean)
        .join(" ") ||
      otherUser.username ||
      "Unknown user"
    : "Unknown user";

  const profilePicture = otherUser?.profilePicture?.url;
  const online = otherUser?._id
    ? isOnline(String(otherUser._id))
    : false;

  // Listen to socket connection events.
  // The global SocketProvider owns the connection lifecycle.
  useEffect(() => {
    const handleConnect = () => {
      console.log("CampusConnect socket connected:", socket.id);
    };

    const handleConnectError = (err) => {
      console.error("Socket connection error:", err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  // Join the selected conversation room.
  useEffect(() => {
    if (!conversationId) return;

    const joinRoom = () => {
      socket.emit("join_conversation", conversationId, (result) => {
        if (result?.success) {
          console.log("Joined conversation:", result.conversationId);
        } else {
          console.error(
            "Could not join conversation:",
            result?.message
          );
        }
      });
    };

    socket.on("connect", joinRoom);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", joinRoom);

      if (socket.connected) {
        socket.emit("leave_conversation", conversationId);
      }
    };
  }, [conversationId]);

  // Listen for incoming messages.
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (message) => {
      if (String(message.conversation) !== conversationId) return;

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => String(item._id) === String(message._id)
        );

        if (alreadyExists) return previousMessages;

        return [...previousMessages, message];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [conversationId]);

  // Fetch existing messages.
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");
        setMessages([]);

        const response = await fetch(
          `${apiUrl}/chat/conversations/${conversationId}/messages`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load messages");
        }

        if (!cancelled) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Fetch messages error:", err);
          setError(err.message || "Failed to load messages");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, conversationId]);

  // Scroll only the messages panel to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // Send a message.
  const handleSendMessage = async (event) => {
    event?.preventDefault();

    const content = newMessage.trim();

    if (!content || sending || !conversationId) return;

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `${apiUrl}/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      if (!data.message) {
        throw new Error("No saved message was returned by the server");
      }

      // Deduplicate the REST response and socket event.
      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) =>
            String(item._id) === String(data.message._id)
        );

        if (alreadyExists) return previousMessages;

        return [...previousMessages, data.message];
      });

      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Enter sends; Shift + Enter creates a new line.
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-slate-50">
      {/* Chat header */}
      <header className="z-10 flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={21} />
        </button>

        <div className="relative h-11 w-11 shrink-0">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700 ring-1 ring-slate-200">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              (displayName[0] || "U").toUpperCase()
            )}
          </div>

          <span
            title={online ? "Online" : "Offline"}
            aria-label={online ? "Online" : "Offline"}
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
              online ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            {displayName}
          </h2>

          <p
            className={`mt-0.5 text-xs font-medium ${
              online ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      {/* Scrollable message area */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-slate-100 via-slate-50 to-indigo-50/40 px-3 py-4 sm:px-5">
        {loading && (
          <p className="py-4 text-center text-sm text-slate-500">
            Loading messages...
          </p>
        )}

        {!loading && error && messages.length === 0 && (
          <p className="py-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && messages.length === 0 && !error && (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200">
              <MessageCircle size={27} />
            </div>

            <p className="font-semibold text-slate-700">
              No messages yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Say hello and start the conversation!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const senderId =
              message.sender?._id ?? message.sender;

            const isOwnMessage =
              String(senderId) === String(currentUserId);

            return (
              <div
                key={message._id}
                className={`flex w-full min-w-0 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`min-w-0 max-w-[85%] break-words rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[75%] ${
                    isOwnMessage
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {message.deleted ? (
                    <p className="text-sm italic opacity-70">
                      This message was deleted
                    </p>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={messagesEndRef} className="h-px shrink-0" />
      </div>

      {/* Fixed composer that stays inside the layout */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full min-w-0 shrink-0 items-end gap-2 border-t border-slate-200 bg-white p-3 sm:gap-3 sm:px-5 sm:py-4"
      >
        <textarea
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          maxLength={5000}
          disabled={sending || loading}
          className="block max-h-32 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!newMessage.trim() || sending || loading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;