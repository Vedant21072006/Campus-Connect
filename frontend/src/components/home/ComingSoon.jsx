import { ArrowLeft } from 'lucide-react'

export default function ComingSoon({ icon: Icon, title, description, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[2.5px] border-ink px-3 py-1.5 rounded-full shadow-hard-sm"
      >
        <ArrowLeft size={15} /> Back to Feed
      </button>

      <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-10 text-center">
        <div className="w-16 h-16 bg-[#FFD93D] border-[3px] border-ink rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3 shadow-hard-sm">
          <Icon size={26} />
        </div>
        <h2 className="font-display font-bold text-xl mb-1.5">{title}</h2>
        <p className="text-sm text-ink/50 max-w-xs mx-auto mb-5">{description}</p>
        <span className="inline-block bg-ink text-white text-[10px] font-display font-semibold px-3 py-1.5 rounded-full">
          Coming soon
        </span>
      </div>
    </div>
  )
}