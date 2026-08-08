import { Home, Calendar, Search, Briefcase, Users, Flame, Trophy, Settings, Crown, Sparkles, X } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Home', active: true, color: '#EF4444' },
  { icon: Calendar, label: 'Upcoming Events', color: '#3B82F6' },
  { icon: Search, label: 'Lost & Found', color: '#EC4899' },
  { icon: Briefcase, label: 'Internship Corner', color: '#D97706' },
  { icon: Users, label: 'Communities', color: '#3B82F6' },
  { icon: Flame, label: 'Trending Events', color: '#F97316' },
  { icon: Trophy, label: 'Leaderboard', color: '#F59E0B' },
  { icon: Settings, label: 'Settings', color: '#6B7280' },
]

export default function LeftSidebar({ streakDays, isOpen, onClose }) {
  return (
    <>
      {/* Backdrop — mobile/tablet only, tapping it closes the drawer */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-4 left-0 h-screen lg:h-auto w-72 lg:w-60 shrink-0 z-50 lg:z-0
        flex flex-col gap-4 p-3 lg:p-0 overflow-y-auto transition-transform duration-300 ease-out
        bg-[#F3EFFC] lg:bg-transparent
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <button
          onClick={onClose}
          className="lg:hidden self-end w-9 h-9 bg-white border-[2.5px] border-ink rounded-full flex items-center justify-center mb-1 shrink-0"
        >
          <X size={16} />
        </button>

        {/* Nav items + Go Premium live inside one continuous bordered pill, matching the reference */}
        <div
          className="bg-[#F3EFFC] border-[3px] border-ink rounded-[28px] p-4 flex flex-col gap-1"
          style={{ boxShadow: '0 5px 0 0 #16151A' }}
        >
          {NAV_ITEMS.map(({ icon: Icon, label, active, color }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-semibold text-left transition ${
                active ? 'bg-[#FFD93D] border-2 border-ink shadow-hard-sm text-ink' : 'text-ink/70 hover:bg-white/60'
              }`}
            >
              <Icon size={17} style={{ color: active ? '#16151A' : color }} /> {label}
            </button>
          ))}

          <div className="relative bg-white/70 border-2 border-dashed border-[#7C3AED]/50 rounded-2xl p-4 mt-2">
            <Sparkles size={14} className="absolute top-3 right-4 text-[#7C3AED]/40" />
            <p className="font-display font-semibold text-sm text-ink flex items-center gap-1.5 mb-1.5">
              <Crown size={15} className="text-[#7C3AED]" /> Go Premium <span className="text-xs">✨</span>
            </p>
            <p className="text-xs text-ink/60 mb-3">Unlock exclusive features and connect better.</p>
            <button className="w-full bg-[#7C3AED] text-white text-xs font-display font-semibold py-2 rounded-xl border-2 border-ink shadow-hard-sm">
              Upgrade Now
            </button>
            <Sparkles size={12} className="absolute -bottom-1.5 right-3 text-[#F59E0B]" />
          </div>
        </div>

        {/* Streak card — separate bordered card below the pill, matching the reference */}
        <div className="bg-white border-[3px] border-ink rounded-2xl p-4 shrink-0" style={{ boxShadow: '0 5px 0 0 #16151A' }}>
          <p className="text-xs font-display font-semibold text-ink flex items-center gap-1.5 mb-2">
            <Flame size={14} className="text-orange-500" /> Your Streak
          </p>
          <p className="text-3xl font-display font-bold text-[#F59E0B] mb-2">
            {streakDays} <span className="text-base font-semibold text-ink/60">Days</span>
          </p>
          <div className="w-full h-3 bg-[#F3EFFC] border-2 border-ink rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"
              style={{ width: `${Math.min(streakDays * 10, 100)}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  )
}