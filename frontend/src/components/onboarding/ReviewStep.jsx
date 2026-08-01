import { PartyPopper, GraduationCap, Sparkles, Zap, Heart, Link2 } from 'lucide-react'
import Loader from '../Loader.jsx'

export default function ReviewStep({ formData, onSubmit, loading }) {
  const { firstName, lastName, username, bio, college, recommendation, professional } = formData
  const professionalLinks = Object.entries(professional).filter(([, v]) => v)

  return (
    <div className="space-y-4">
      <div className="bg-white border-[3px] border-ink rounded-2xl p-5 shadow-hard-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-bubblegum rounded-full border-[3px] border-ink flex items-center justify-center font-display font-semibold text-lg">
            {firstName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-display font-semibold">{firstName} {lastName}</p>
            <p className="text-xs text-ink/50">@{username || 'username'}</p>
          </div>
        </div>
        {bio && <p className="text-sm text-ink/70 mt-2">{bio}</p>}
      </div>

      <div className="bg-sunny/40 border-[3px] border-ink rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={16} />
          <h3 className="font-display font-semibold text-sm">College</h3>
        </div>
        <p className="text-sm text-ink/70">
          {[college.collegeName, college.department, college.branch, college.year && `Year ${college.year}`, college.section && `Sec ${college.section}`]
            .filter(Boolean).join(' · ') || 'Not provided'}
        </p>
      </div>

      <div className="bg-bubblegum/20 border-[3px] border-ink rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} />
          <h3 className="font-display font-semibold text-sm">Interests</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendation.interests.length > 0
            ? recommendation.interests.map((i) => (
                <span key={i} className="bg-white border-2 border-ink px-2.5 py-1 rounded-full text-xs font-medium">{i}</span>
              ))
            : <p className="text-xs text-ink/50">None selected</p>}
        </div>
      </div>

      <div className="bg-sky/20 border-[3px] border-ink rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} />
          <h3 className="font-display font-semibold text-sm">Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendation.skills.length > 0
            ? recommendation.skills.map((s) => (
                <span key={s} className="bg-white border-2 border-ink px-2.5 py-1 rounded-full text-xs font-medium">{s}</span>
              ))
            : <p className="text-xs text-ink/50">None selected</p>}
        </div>
      </div>

      <div className="bg-lime/20 border-[3px] border-ink rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} />
          <h3 className="font-display font-semibold text-sm">Activities & hobbies</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendation.hobbies.length > 0
            ? recommendation.hobbies.map((h) => (
                <span key={h} className="bg-white border-2 border-ink px-2.5 py-1 rounded-full text-xs font-medium">{h}</span>
              ))
            : <p className="text-xs text-ink/50">None selected</p>}
        </div>
      </div>

      {professionalLinks.length > 0 && (
        <div className="bg-white border-[3px] border-ink rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} />
            <h3 className="font-display font-semibold text-sm">Professional links</h3>
          </div>
          <ul className="space-y-1">
            {professionalLinks.map(([key, value]) => (
              <li key={key} className="text-xs text-sky-dark truncate">{value}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-bubblegum font-display font-semibold py-3.5 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader size={18} color="#16151A" /> : <><PartyPopper size={18} /> Complete Profile</>}
      </button>
    </div>
  )
}