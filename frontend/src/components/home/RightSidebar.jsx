
import AiSuggestions from './AiSuggestions.jsx'
import TrendingCampus from './TrendingCampus.jsx'
import Leaderboard from './Leaderboard.jsx'

export default function RightSidebar({ aiSuggestions, trending, leaderboard }) {
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col gap-4 self-start md:sticky md:top-24 md:flex md:max-h-[calc(100vh-6rem)] md:overflow-y-auto lg:w-72">

      {/* Existing sidebar content */}
      <div className="pointer-events-none select-none grayscale opacity-50">
        <div className="flex flex-col gap-4">
          <AiSuggestions items={aiSuggestions} />
          <TrendingCampus items={trending} />
          <Leaderboard items={leaderboard} />
        </div>
      </div>

      {/* Coming Soon overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-gray-300/80 p-4 backdrop-blur-[2px]">
        <div className="max-w-[190px] rounded-xl border-2 border-gray-300 bg-white/95 px-5 py-4 text-center shadow-md">
          <p className="font-display text-base font-bold text-gray-700">
            Coming Soon
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            These features are currently under development.
          </p>
        </div>
      </div>

    </aside>
  )
}
