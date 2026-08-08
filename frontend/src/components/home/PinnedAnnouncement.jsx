import { Pin, X, PartyPopper, Calendar } from 'lucide-react'

export default function PinnedAnnouncement({ title, description }) {
  return (
    <div className="bg-[#FBBF24] border-[3px] border-ink rounded-2xl shadow-hard p-4 relative">
      <button className="absolute top-3 right-3 text-white/70">
        <X size={16} />
      </button>
      <span className="inline-flex items-center gap-1 bg-white text-[#B45309] text-[10px] font-semibold px-2.5 py-1 rounded-full mb-2">
        <Pin size={11} /> PINNED ANNOUNCEMENT
      </span>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-white text-sm flex items-center gap-1.5 mb-1">
            <PartyPopper size={15} /> {title}
          </p>
          <p className="text-white/90 text-xs leading-relaxed mb-3">{description}</p>
          <button className="bg-[#7C3AED] text-white text-xs font-semibold px-4 py-1.5 rounded-lg">View Details</button>
        </div>
        <Calendar size={40} className="text-white/40 shrink-0 hidden sm:block" />
      </div>
    </div>
  )
}