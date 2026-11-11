
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import TopNavbar from "../components/home/TopNavbar.jsx";
import LeftSidebar from "../components/home/LeftSidebar.jsx";
import RightSidebar from "../components/home/RightSidebar.jsx";
import BottomNav from "../components/home/BottomNav.jsx";
import PostCard from "../components/home/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import CreatePostForm from "../components/home/CreatePostForm.jsx";

import {
  aiSuggestions,
  trending,
  leaderboard,
  streakDays,
} from "../data/mockFeedData.js";

import { getPosts } from "../services/getpost.js";
import HomeSearchBar from "../components/home/homesearchbar.jsx";
import Chat from "./Chat.jsx";

export default function Feed() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState("");

  const [activeView, setActiveView] = useState("feed");

  const openChatWith = location.state?.openChatWith;

  useEffect(() => {
    if (openChatWith) {
      setActiveView("chats");
    }
  }, [openChatWith]);

  // Fetch the initial batch of posts.
  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPosts();

        if (cancelled) return;

        setPosts(data.postdata || []);
        setHasMore(data.pagination?.hasMore ?? false);
        setNextCursor(data.pagination?.nextCursor ?? null);
      } catch (error) {
        if (cancelled) return;

        console.error("Error fetching posts:", error);
        setError(error.message || "Failed to load posts.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch and append the next batch.
  const handleLoadMore = async () => {
    if (loadingMore || loading || !hasMore || !nextCursor) {
      return;
    }

    try {
      setLoadingMore(true);
      setError("");

      const data = await getPosts(nextCursor);
      const newPosts = data.postdata || [];

      // Avoid duplicate posts when appending.
      setPosts((currentPosts) => {
        const existingIds = new Set(
          currentPosts.map((post) => post._id)
        );

        const uniqueNewPosts = newPosts.filter(
          (post) => !existingIds.has(post._id)
        );

        return [...currentPosts, ...uniqueNewPosts];
      });

      setHasMore(data.pagination?.hasMore ?? false);
      setNextCursor(data.pagination?.nextCursor ?? null);
    } catch (error) {
      console.error("Error loading more posts:", error);
      setError(error.message || "Failed to load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24 lg:pb-6">
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:gap-5">
        <LeftSidebar
          streakDays={streakDays}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 justify-center">
          <div
            className={`flex w-full max-w-xl flex-col gap-4 ${
              activeView === "chats"
                ? "h-[calc(100dvh-11rem)] min-h-0"
                : ""
            }`}
          >
            {activeView === "feed" && (
              <>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader />
                  </div>
                ) : error && posts.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-semibold text-red-600">
                      {error}
                    </p>

                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 rounded-full border-2 border-ink bg-white px-5 py-2 text-sm font-semibold shadow-hard-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : posts.length > 0 ? (
                  <>
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}

                    {error && (
                      <p className="text-center text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    {hasMore && (
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="mx-auto w-fit rounded-full border-[2.5px] border-ink bg-white px-6 py-2.5 font-display text-sm font-semibold text-[#EC4899] shadow-hard-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingMore
                          ? "Loading Posts..."
                          : "↻ Load More Posts"}
                      </button>
                    )}

                    {!hasMore && (
                      <p className="py-4 text-center text-sm text-gray-500">
                        You're all caught up!
                      </p>
                    )}
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-semibold">No posts found.</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Be the first one to post something!
                    </p>
                  </div>
                )}
              </>
            )}

            {activeView === "create" && (
              <CreatePostForm
                onBack={() => setActiveView("feed")}
              />
            )}

            {activeView === "search" && <HomeSearchBar />}

            {activeView === "chats" && (
              <Chat openChatWith={openChatWith} />
            )}
          </div>
        </main>

        <RightSidebar
          aiSuggestions={aiSuggestions}
          trending={trending}
          leaderboard={leaderboard}
        />
      </div>

      <BottomNav
        activeView={activeView}
        onHome={() => setActiveView("feed")}
        onSearch={() => setActiveView("search")}
        onChats={() => setActiveView("chats")}
        onCreatePost={() => setActiveView("create")}
      />
    </div>
  );
}
