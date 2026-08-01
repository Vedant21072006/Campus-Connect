import { Mountain, Palette, Coffee, Mic2, Trophy } from 'lucide-react'
import Chip from './Chip.jsx'
import { HOBBY_GROUPS } from '../../data/onboardingData.js'

const MAX_HOBBIES = 5
const GROUP_ICONS = { Outdoors: Mountain, Creative: Palette, Social: Coffee, 'Performing Arts': Mic2, Sports: Trophy }
const GROUP_COLORS = { Outdoors: 'lime', Creative: 'bubblegum', Social: 'sunny', 'Performing Arts': 'sky', Sports: 'lime' }

export default function HobbiesStep({ selected, onToggle }) {
  const atLimit = selected.length >= MAX_HOBBIES

  return (
    <div>
      <p className="text-sm text-ink/60 mb-5">
        Pick up to {MAX_HOBBIES} (optional, but it helps us find your people) — <span className="font-semibold text-ink">{selected.length}/{MAX_HOBBIES} selected</span>
      </p>
      {Object.entries(HOBBY_GROUPS).map(([group, hobbies]) => {
        const Icon = GROUP_ICONS[group]
        return (
          <div key={group} className="mb-6 last:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} />
              <h3 className="font-display font-semibold text-sm">{group}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {hobbies.map((hobby) => (
                <Chip
                  key={hobby}
                  label={hobby}
                  selected={selected.includes(hobby)}
                  disabled={atLimit}
                  onClick={() => onToggle(hobby)}
                  color={GROUP_COLORS[group]}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}