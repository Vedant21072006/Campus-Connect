import { Github, Linkedin, Globe, FileText, Link2, Code2, ExternalLink } from 'lucide-react'

const LINKS = [
  { key: 'githubUrl', label: 'GitHub', icon: Github, color: 'bg-ink text-cream', rotate: '-rotate-1' },
  { key: 'linkedinUrl', label: 'LinkedIn', icon: Linkedin, color: 'bg-sky', rotate: 'rotate-1' },
  { key: 'codingPlatformUrl', label: 'Coding Profile', icon: Code2, color: 'bg-sunny', rotate: '-rotate-1' },
  { key: 'portfolioUrl', label: 'Portfolio', icon: Globe, color: 'bg-lime', rotate: 'rotate-1' },
  { key: 'resumeUrl', label: 'Resume', icon: FileText, color: 'bg-bubblegum', rotate: '-rotate-1' },
  { key: 'website', label: 'Website', icon: Link2, color: 'bg-white', rotate: 'rotate-1' },
]

export default function ProfessionalSection({ data }) {
  const filled = LINKS.filter(({ key }) => data?.[key])

  if (filled.length === 0) {
    return (
      <div className="bg-white border-[3px] border-ink rounded-2xl p-8 text-center shadow-hard-sm">
        <p className="text-sm text-ink/50">No professional links added yet.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3.5">
      {filled.map(({ key, label, icon: Icon, color, rotate }) => (
        <a
          key={key}
          href={data[key]}
          target="_blank"
          rel="noopener noreferrer"
          className={`${color} ${rotate} border-[3px] border-ink rounded-2xl p-4 flex items-center justify-between shadow-hard hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
        >
          <span className="flex items-center gap-2.5 font-display font-semibold text-sm">
            <Icon size={18} /> {label}
          </span>
          <ExternalLink size={15} className="opacity-50" />
        </a>
      ))}
    </div>
  )
}