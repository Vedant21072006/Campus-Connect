
import {
  Home,
  Calendar,
  Search,
  Briefcase,
  Users,
  Flame,
  Trophy,
  Settings,
  Crown,
  Sparkles,
  X,
} from 'lucide-react'

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
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 shrink-0 flex-col gap-4 overflow-y-auto bg-[#F3EFFC] p-3 transition-transform duration-300 ease-out lg:sticky lg:top-24 lg:z-10 lg:h-[calc(100vh-6rem)] lg:w-60 lg:overflow-y-auto lg:bg-transparent lg:p-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Mobile close button stays above the overlay */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="relative z-40 mb-1 flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border-[2.5px] border-ink bg-white lg:hidden"
        >
          <X size={16} />
        </button>

        {/* Sidebar content */}
        <div className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-1 rounded-[28px] border-[3px] border-ink bg-[#F3EFFC] p-4"
            style={{ boxShadow: '0 5px 0 0 #16151A' }}
          >
            {NAV_ITEMS.map(({ icon: Icon, label, active, color }) => (
              <button
                key={label}
                type="button"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-display font-semibold transition ${
                  active
                    ? 'border-2 border-ink bg-[#FFD93D] text-ink shadow-hard-sm'
                    : 'text-ink/70 hover:bg-white/60'
                }`}
              >
                <Icon
                  size={17}
                  style={{ color: active ? '#16151A' : color }}
                />
                {label}
              </button>
            ))}

            <div className="relative mt-2 rounded-2xl border-2 border-dashed border-[#7C3AED]/50 bg-white/70 p-4">
              <Sparkles
                size={14}
                className="absolute right-4 top-3 text-[#7C3AED]/40"
              />

              <p className="mb-1.5 flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
                <Crown size={15} className="text-[#7C3AED]" />
                Go Premium <span className="text-xs">✨</span>
              </p>

              <p className="mb-3 text-xs text-ink/60">
                Unlock exclusive features and connect better.
              </p>

              <button
                type="button"
                className="w-full rounded-xl border-2 border-ink bg-[#7C3AED] py-2 text-xs font-display font-semibold text-white shadow-hard-sm"
              >
                Upgrade Now
              </button>

              <Sparkles
                size={12}
                className="absolute -bottom-1.5 right-3 text-[#F59E0B]"
              />
            </div>
          </div>

          {/* Streak card */}
          <div
            className="shrink-0 rounded-2xl border-[3px] border-ink bg-white p-4"
            style={{ boxShadow: '0 5px 0 0 #16151A' }}
          >
            <p className="mb-2 flex items-center gap-1.5 font-display text-xs font-semibold text-ink">
              <Flame size={14} className="text-orange-500" />
              Your Streak
            </p>

            <p className="mb-2 font-display text-3xl font-bold text-[#F59E0B]">
              {streakDays}{' '}
              <span className="text-base font-semibold text-ink/60">
                Days
              </span>
            </p>

            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-[#F3EFFC]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
                style={{ width: `${Math.min(streakDays * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coming Soon overlay: blocks sidebar interaction */}
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-300/80 p-4 backdrop-blur-[2px] lg:rounded-2xl">
          <div className="max-w-[190px] rounded-xl border-2 border-gray-300 bg-white/95 px-5 py-4 text-center shadow-md">
            <p className="font-display text-base font-bold text-gray-700">
              Coming Soon
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              This section is currently under development.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
