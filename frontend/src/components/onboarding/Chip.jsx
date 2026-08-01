import { Check } from 'lucide-react'

const COLOR_MAP = {
  bubblegum: 'bg-bubblegum',
  sunny: 'bg-sunny',
  sky: 'bg-sky',
  lime: 'bg-lime',
}

// Reusable selectable tag used across Interests / Skills / Hobbies steps.
// "Selected" reuses the theme's press interaction to double as a selection state.
export default function Chip({ label, selected, onClick, disabled, color = 'bubblegum' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`font-display font-semibold text-xs px-3.5 py-2 rounded-full border-[3px] border-ink transition-all inline-flex items-center gap-1 ${
        selected
          ? `${COLOR_MAP[color]} translate-x-[2px] translate-y-[2px] shadow-none`
          : 'bg-white shadow-hard-sm hover:-translate-y-0.5'
      } ${disabled && !selected ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {selected && <Check size={12} />}
      {label}
    </button>
  )
}