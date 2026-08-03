// Shared placeholder for future-scope sections (Achievements, Projects) —
// swap the `items` prop for real data once those features exist.
const CHIP_ROTATE = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3']

export default function ComingSoonSection({ icon: Icon, title, description, previewLabels }) {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-8 text-center shadow-hard-lg relative overflow-hidden">
      <div className="absolute top-4 left-6 w-6 h-6 bg-sunny rounded-full border-2 border-ink hidden sm:block" />
      <div className="absolute bottom-6 right-8 w-8 h-8 bg-sky rotate-12 border-2 border-ink hidden sm:block" />

      <div className="w-14 h-14 bg-sunny border-[3px] border-ink rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3 shadow-hard-sm">
        <Icon size={22} />
      </div>
      <h3 className="font-display font-semibold text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-ink/50 max-w-sm mx-auto mb-5">{description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {previewLabels.map((label, i) => (
          <span
            key={label}
            className={`border-[3px] border-ink px-3 py-1.5 rounded-full text-xs font-display font-semibold opacity-60 ${CHIP_ROTATE[i % 4]} ${
              ['bg-bubblegum', 'bg-sky', 'bg-lime', 'bg-sunny'][i % 4]
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <span className="inline-block mt-5 bg-ink text-cream text-[10px] font-display font-semibold px-3 py-1 rounded-full rotate-1">
        Coming soon
      </span>
    </div>
  )
}