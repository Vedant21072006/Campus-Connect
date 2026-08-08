import { Image, Calendar, BarChart3, Code2, MoreHorizontal } from 'lucide-react'

const QUICK_ACTIONS = [
  { icon: Image, label: 'Photo', color: '#10B981' },
  { icon: Calendar, label: 'Event', color: '#EF4444' },
  { icon: BarChart3, label: 'Poll', color: '#F59E0B' },
  { icon: Code2, label: 'Project', color: '#3B82F6' },
]

export default function CreatePostBar() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-sm font-semibold shrink-0">V</div>
        <div className="flex-1 bg-[#F3EFFC] rounded-xl px-4 py-2.5 text-sm text-[#9CA3AF]">
          What's happening on campus?
        </div>
      </div>
      <div className="flex items-center gap-2">
        {QUICK_ACTIONS.map(({ icon: Icon, label, color }) => (
          <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4B5563] hover:bg-[#F3EFFC] transition">
            <Icon size={15} style={{ color }} /> {label}
          </button>
        ))}
        <button className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3EFFC]">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}