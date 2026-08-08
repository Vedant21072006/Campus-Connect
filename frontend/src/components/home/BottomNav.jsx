import { Search, MessageCircle, Plus, Home, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function BottomNav() {
  const nav = useNavigate()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-black/5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-2.5">
        <button className="flex flex-col items-center gap-0.5 text-[#9CA3AF]">
          <Search size={20} />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <button className="relative flex flex-col items-center gap-0.5 text-[#9CA3AF]">
          <MessageCircle size={20} />
          <span className="absolute -top-1 right-0 bg-[#EF4444] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          <span className="text-[10px] font-medium">Chats</span>
        </button>

        <button className="flex flex-col items-center gap-0.5">
          <div className="w-12 h-12 -mt-6 bg-[#EC4899] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-[10px] font-medium text-[#EC4899]">Create Post</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-[#F97316]">
          <Home size={20} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Profile lives only here, not in the top navbar */}
        <button className="flex flex-col items-center gap-0.5 text-[#9CA3AF]" onClick={()=>nav('/profile')} >
          <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[9px] font-semibold">V</div>
          <span className="text-[10px] font-medium"  >Profile</span>
        </button>
      </div>
    </nav>
  )
}