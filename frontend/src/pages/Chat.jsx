import { useEffect, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import { usePresence } from "../components/context/PresenceContext";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isOnline } = usePresence();

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const meResponse = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const meData = await meResponse.json();

        if (!meResponse.ok) {
          throw new Error(
            meData.message || "Failed to fetch user data"
          );
        }

        const userId = meData.user?._id || meData._id;

        if (!userId) {
          throw new Error("Current user ID was not found");
        }

        setCurrentUserId(userId);

        const response = await fetch(`${apiUrl}/chat/conversations`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch conversations"
          );
        }

        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Fetch chat data error:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [apiUrl]);

  if (selectedConversation) {
    return (
      <ChatWindow
        conversation={selectedConversation}
        currentUserId={currentUserId}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold">Chats</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && (
          <div className="p-4 text-gray-500">
            Loading conversations...
          </div>
        )}

        {!loading && error && (
          <div className="p-4 text-red-500">{error}</div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-gray-500">No conversations yet</p>
          </div>
        )}

        {!loading &&
          !error &&
          conversations.map((conversation) => {
            const otherUser = conversation.participants?.find(
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

            return (
              <button
                key={conversation._id}
                type="button"
                onClick={() => setSelectedConversation(conversation)}
                className="flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="relative h-12 w-12 shrink-0">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-yellow-400 text-base font-semibold text-black">
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
                      online ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-gray-900">
                      {displayName}
                    </p>

                    <span
                      className={`shrink-0 text-xs ${
                        online ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {online ? "Online" : "Offline"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {conversation.lastMessage?.content ||
                      "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default Chat;