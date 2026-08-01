import { Code2, Users } from 'lucide-react'
import Chip from './Chip.jsx'
import { SKILLS } from '../../data/onboardingData.js'

const MAX_SKILLS = 8
const CATEGORY_ICONS = { Technical: Code2, 'Soft Skills': Users }
const CATEGORY_COLORS = { Technical: 'sky', 'Soft Skills': 'lime' }

export default function SkillsStep({ selected, onToggle }) {
  const atLimit = selected.length >= MAX_SKILLS

  return (
    <div>
      <p className="text-sm text-ink/60 mb-5">
        Pick up to {MAX_SKILLS} — <span className="font-semibold text-ink">{selected.length}/{MAX_SKILLS} selected</span>
      </p>
      {Object.entries(SKILLS).map(([category, skills]) => {
        const Icon = CATEGORY_ICONS[category]
        return (
          <div key={category} className="mb-6 last:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} />
              <h3 className="font-display font-semibold text-sm">{category}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  selected={selected.includes(skill)}
                  disabled={atLimit}
                  onClick={() => onToggle(skill)}
                  color={CATEGORY_COLORS[category]}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}