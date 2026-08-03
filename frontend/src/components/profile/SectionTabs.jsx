export default function SectionTabs({ sections, activeTab, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-hide">
      {sections.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`shrink-0 font-display font-semibold text-xs sm:text-sm flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl border-[3px] border-ink transition-all whitespace-nowrap ${
              isActive
                ? 'bg-bubblegum translate-x-[2px] translate-y-[2px] shadow-none scale-105'
                : 'bg-white shadow-hard-sm hover:-translate-y-0.5 hover:rotate-1'
            }`}
          >
            <Icon size={16} className={isActive ? 'sticker-wiggle' : ''} /> {label}
          </button>
        )
      })}
    </div>
  )
}