import { useState } from 'react'
import TopNavbar from '../components/home/TopNavbar.jsx'
import LeftSidebar from '../components/home/LeftSidebar.jsx'
import RightSidebar from '../components/home/RightSidebar.jsx'
import BottomNav from '../components/home/BottomNav.jsx'
import CampusStories from '../components/home/CampusStories.jsx'
import PinnedAnnouncement from '../components/home/PinnedAnnouncement.jsx'
import PostCard from '../components/home/PostCard.jsx'
import {
  stories, pinnedAnnouncement, posts, aiSuggestions, trending, leaderboard, streakDays,
} from '../data/mockFeedData.js'

// Static UI only for now — no navigation or API calls wired up yet, as requested.
// Swap the imported mock arrays for real fetched data once your feed/posts endpoints exist.
export default function Feed() {
  // Sidebar is always visible on lg+ regardless of this state — it only controls
  // the mobile/tablet slide-in drawer, triggered from the hamburger button in TopNavbar.
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F3EFFC] font-['Inter',sans-serif] pb-20">
      <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="max-w-7xl mx-auto flex gap-4 lg:gap-5 px-4 sm:px-6 py-5">
        <LeftSidebar streakDays={streakDays} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* max-w-xl keeps the feed column at a fixed, readable width — it never
            stretches edge-to-edge, so there's always visible whitespace on either
            side (space for the sidebar drawer on the left, RightSidebar on the right) */}
        <main className="flex-1 min-w-0 flex justify-center">
          <div className="w-full max-w-xl flex flex-col gap-4">
            <CampusStories stories={stories} />
            <PinnedAnnouncement {...pinnedAnnouncement} />
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <button className="w-fit mx-auto bg-white border-[2.5px] border-ink rounded-full shadow-hard-sm px-6 py-2.5 text-sm font-display font-semibold text-[#EC4899] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              ↻ Load More Posts
            </button>
          </div>
        </main>

        <RightSidebar aiSuggestions={aiSuggestions} trending={trending} leaderboard={leaderboard} />
      </div>

      <BottomNav />
    </div>
  )
}