import { Sparkles, Zap, Heart, Languages } from 'lucide-react'

const CONFIG = {
  interests: { chip: 'bg-bubblegum', card: 'bg-bubblegum/15', rotate: '-rotate-1' },
  skills: { chip: 'bg-sky', card: 'bg-sky/20', rotate: 'rotate-1' },
  hobbies: { chip: 'bg-lime', card: 'bg-lime/20', rotate: '-rotate-1' },
  languages: { chip: 'bg-sunny', card: 'bg-sunny/25', rotate: 'rotate-1' },
}

const ChipGroup = ({ icon: Icon, title, items, colorKey }) => {
  const { chip, card, rotate } = CONFIG[colorKey]
  return (
    <div className={`${card} border-[3px] border-ink rounded-2xl p-5 shadow-hard ${rotate} hover:rotate-0 transition-transform`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 bg-white border-[3px] border-ink rounded-lg flex items-center justify-center">
          <Icon size={16} />
        </div>
        <h3 className="font-display font-semibold text-base">{title}</h3>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={item}
              className={`${chip} border-[3px] border-ink px-3 py-1.5 rounded-full text-xs font-display font-semibold ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ink/40">Nothing added yet.</p>
      )}
    </div>
  )
}

export default function InterestsSkillsSection({ data }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <ChipGroup icon={Sparkles} title="Interests" items={data?.recommendation?.interests || []} colorKey="interests" />
      <ChipGroup icon={Zap} title="Skills" items={data?.recommendation?.skills || []} colorKey="skills" />
      <ChipGroup icon={Heart} title="Hobbies" items={data?.recommendation?.hobbies || []} colorKey="hobbies" />
      <ChipGroup icon={Languages} title="Languages" items={data?.recommendation?.languages || []} colorKey="languages" />
    </div>
  )
}