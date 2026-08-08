import { Flame } from 'lucide-react'

export default function TrendingCampus({ items }) {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display font-semibold text-sm flex items-center gap-1.5">
          <Flame size={15} className="text-orange-500" /> Trending on Campus
        </p>
        <button className="text-xs font-display font-semibold text-[#7C3AED]">View All</button>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(({ title, desc }, i) => (
          <div key={title} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-xs font-display font-semibold leading-tight">{title}</p>
              <p className="text-[10px] text-ink/50">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}