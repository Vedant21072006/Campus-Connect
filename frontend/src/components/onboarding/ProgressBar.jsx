export default function ProgressBar({ currentStep, totalSteps }) {
  const percent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-semibold text-xs bg-white border-[3px] border-ink px-3 py-1 rounded-full shadow-hard-sm">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-display font-semibold text-xs text-ink/60">{percent}% complete</span>
      </div>
      <div className="w-full h-4 bg-white border-[3px] border-ink rounded-full overflow-hidden">
        <div
          className="h-full bg-bubblegum rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}