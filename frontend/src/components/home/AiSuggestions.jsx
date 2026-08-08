import { GraduationCap, Users, Briefcase, Rocket, UserCheck, Heart, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'

const ICON_MAP = { GraduationCap, Users, Briefcase, Rocket, UserCheck, Heart }

export default function AiSuggestions({ items }) {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-4">
      <p className="font-display font-semibold text-sm flex items-center gap-1.5 mb-1">
        <Sparkles size={15} className="text-[#7C3AED]" /> AI Suggestions
      </p>
      <p className="text-xs text-ink/50 mb-3">Find the right people & opportunities for you.</p>

      <div className="flex flex-col gap-2">
        {items.map(({ title, desc, color, icon, highlight }) => {
          const Icon = ICON_MAP[icon] || Sparkles
          return (
            <button
              key={title}
              className={`flex items-center gap-3 p-2.5 rounded-xl border-2 border-ink/10 text-left transition hover:border-ink/30 ${
                highlight ? 'bg-gradient-to-r from-[#FFE4EC] to-[#FFF6E5]' : 'bg-white'
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border-2 border-ink/10"
                style={{ backgroundColor: `${color}26` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-semibold">{title}</p>
                <p className="text-[10px] text-ink/50 leading-tight">{desc}</p>
              </div>
              <ChevronRight size={14} className="text-ink/30 shrink-0" />
            </button>
          )
        })}
      </div>

      <button className="w-full mt-3 bg-ink text-white text-xs font-display font-semibold flex items-center justify-center gap-1.5 py-2.5 rounded-full">
        View More <ArrowRight size={13} />
      </button>
    </div>
  )
}