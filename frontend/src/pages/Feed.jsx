import { useEffect, useState } from "react";

import TopNavbar from "../components/home/TopNavbar.jsx";
import LeftSidebar from "../components/home/LeftSidebar.jsx";
import RightSidebar from "../components/home/RightSidebar.jsx";
import BottomNav from "../components/home/BottomNav.jsx";
import CampusStories from "../components/home/CampusStories.jsx";
import PinnedAnnouncement from "../components/home/PinnedAnnouncement.jsx";
import PostCard from "../components/home/PostCard.jsx";
import Loader from "../components/Loader.jsx";
import CreatePostForm from "../components/home/CreatePostForm.jsx";
import ComingSoon from "../components/home/ComingSoon.jsx";
import { Search as SearchIcon, MessageCircle } from "lucide-react";

import {
  stories,
  pinnedAnnouncement,
  aiSuggestions,
  trending,
  leaderboard,
  streakDays,
} from "../data/mockFeedData.js";
import { getPosts } from "../services/getpost.js";

export default function Feed() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controls what renders in the main column — everything below still lives
  // on this one page/route, this just swaps the content in place.
  const [activeView, setActiveView] = useState("feed"); // 'feed' | 'create' | 'search' | 'chats'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const data = await getPosts()

        setPosts(data.postdata);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <TopNavbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="max-w-7xl mx-auto flex gap-4 lg:gap-5 px-4 sm:px-6 py-5">

        <LeftSidebar
          streakDays={streakDays}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 flex justify-center">
          <div className="w-full max-w-xl flex flex-col gap-4">

            {activeView === "feed" && (
              <>
                <CampusStories stories={stories} />

                <PinnedAnnouncement
                  {...pinnedAnnouncement}
                />

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader />
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="font-semibold">
                      No posts found.
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Be the first one to post something!
                    </p>
                  </div>
                )}

                {!loading && posts.length > 0 && (
                  <button
                    className="w-fit mx-auto bg-white border-[2.5px] border-ink rounded-full shadow-hard-sm px-6 py-2.5 text-sm font-display font-semibold text-[#EC4899] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    ↻ Load More Posts
                  </button>
                )}
              </>
            )}

            {activeView === "create" && (
              <CreatePostForm onBack={() => setActiveView("feed")} />
            )}

            {activeView === "search" && (
              <ComingSoon
                icon={SearchIcon}
                title="Search"
                description="Search for people, communities, and posts is on its way."
                onBack={() => setActiveView("feed")}
              />
            )}

            {activeView === "chats" && (
              <ComingSoon
                icon={MessageCircle}
                title="Chats"
                description="One-to-one and group chats are coming soon."
                onBack={() => setActiveView("feed")}
              />
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