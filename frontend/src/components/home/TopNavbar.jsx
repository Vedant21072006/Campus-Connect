import { Menu, Megaphone, Sparkles, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TopNavbar({ onMenuClick }) {
  const nav = useNavigate()
  return (
    <div className="sticky top-0 z-30 px-2 sm:px-4 pt-2 pb-3 bg-[#F3EFFC]">
      <div
        className="max-w-6xl mx-auto bg-[#F3EFFC] border-[3px] border-ink rounded-[26px] px-4 sm:px-5 py-2.5 flex items-center justify-between"
        style={{ boxShadow: '0 5px 0 0 #16151A' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 bg-white border-[2.5px] border-ink rounded-full flex items-center justify-center shrink-0"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">🚀</span>
            <span className="font-display font-bold text-lg text-ink">CampusConnect</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="w-10 h-10 bg-[#FFD93D] border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center">
            <Megaphone size={17} className="text-[#E8447A]" fill="#E8447A" fillOpacity={0.15} />
          </button>
          <button className="w-10 h-10 bg-[#7C3AED] border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center">
            <Sparkles size={17} className="text-white" fill="white" />
          </button>
          <button className="relative w-10 h-10 bg-white border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center">
            <Bell size={17} className="text-ink" />
            <span className="absolute -top-2 -right-2 bg-[#EF4444] border-2 border-white text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {/* Placeholder avatar — swap for a real photo/uploaded image; can't generate a realistic person here */}
          <div className="w-11 h-11 rounded-full border-[2.5px] border-ink p-0.5 bg-[#7C3AED] shrink-0">
            <div className="w-full h-full rounded-full bg-[#F3EFFC] flex items-center justify-center text-xs font-bold text-ink" onClick={()=>nav('/profile')} >
              V
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}