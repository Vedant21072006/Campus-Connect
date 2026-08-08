import AiSuggestions from './AiSuggestions.jsx'
import TrendingCampus from './TrendingCampus.jsx'
import Leaderboard from './Leaderboard.jsx'

// hidden md:flex — hidden only on true mobile; visible from tablet up (unlike
// LeftSidebar, which stays a drawer until lg since it needs more interaction room).
export default function RightSidebar({ aiSuggestions, trending, leaderboard }) {
  return (
    <aside className="hidden md:flex flex-col gap-4 w-64 lg:w-72 shrink-0">
      <AiSuggestions items={aiSuggestions} />
      <TrendingCampus items={trending} />
      <Leaderboard items={leaderboard} />
    </aside>
  )
}