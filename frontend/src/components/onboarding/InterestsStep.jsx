import { Sparkles } from 'lucide-react'
import Chip from './Chip.jsx'
import { INTERESTS } from '../../data/onboardingData.js'

const MAX_INTERESTS = 5

export default function InterestsStep({ selected, onToggle }) {
  const atLimit = selected.length >= MAX_INTERESTS

  return (
    <div>
      <p className="text-sm text-ink/60 mb-4 flex items-center gap-1.5">
        <Sparkles size={16} className="text-bubblegum" />
        Pick up to {MAX_INTERESTS} — <span className="font-semibold text-ink">{selected.length}/{MAX_INTERESTS} selected</span>
      </p>
      <div className="flex flex-wrap gap-2.5">
        {INTERESTS.map((interest) => (
          <Chip
            key={interest}
            label={interest}
            selected={selected.includes(interest)}
            disabled={atLimit}
            onClick={() => onToggle(interest)}
            color="bubblegum"
          />
        ))}
      </div>
    </div>
  )
}