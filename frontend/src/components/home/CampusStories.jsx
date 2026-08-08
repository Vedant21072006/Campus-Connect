import { Plus } from 'lucide-react'

export default function CampusStories({ stories }) {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm">Campus Stories</p>
        <button className="text-xs font-medium text-[#7C3AED]">See All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-[#7C3AED]/40 flex items-center justify-center">
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center border-2 border-white">
              <Plus size={11} className="text-white" />
            </div>
          </div>
          <span className="text-[10px] text-[#6B7280] font-medium">Add Story</span>
        </div>
        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-14 h-14 rounded-full p-0.5" style={{ border: `2.5px solid ${s.ring}` }}>
              <div className="w-full h-full rounded-full bg-[#F3EFFC] flex items-center justify-center font-semibold text-sm text-[#4B5563]">
                {s.name[0]}
              </div>
            </div>
            <span className="text-[10px] text-[#6B7280] font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}