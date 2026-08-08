import { Trophy, ArrowRight } from 'lucide-react'

export default function Leaderboard({ items }) {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-4">
      <p className="font-display font-semibold text-sm flex items-center gap-1.5 mb-3">
        <Trophy size={15} className="text-[#F59E0B]" /> Leaderboard
      </p>
      <div className="flex justify-between mb-3">
        {items.map(({ rank, name, points, color }) => (
          <div key={rank} className="flex flex-col items-center gap-1 text-center">
            <div className="relative">
              <div className="w-11 h-11 rounded-full border-2 border-ink/10 bg-[#F3EFFC] flex items-center justify-center text-sm font-display font-semibold text-ink/70">
                {name[0]}
              </div>
              <span
                className="absolute -bottom-1 -right-1 text-[9px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: color, width: 18, height: 18 }}
              >
                {rank}
              </span>
            </div>
            <p className="text-[10px] font-display font-semibold">{name}</p>
            <p className="text-[9px] text-ink/50">{points}</p>
          </div>
        ))}
      </div>
      <button className="w-full text-xs font-display font-semibold text-[#7C3AED] flex items-center justify-center gap-1 py-1.5">
        View Full Leaderboard <ArrowRight size={13} />
      </button>
    </div>
  )
}