import { Github, Linkedin, Globe, FileText, Link2 } from 'lucide-react'

const FIELDS = [
  { key: 'githubUrl', label: 'GitHub', icon: Github, placeholder: 'https://github.com/yourusername' },
  { key: 'linkedinUrl', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourusername' },
  { key: 'portfolioUrl', label: 'Portfolio', icon: Globe, placeholder: 'https://yourportfolio.com' },
  { key: 'resumeUrl', label: 'Resume', icon: FileText, placeholder: 'Link to your resume' },
  { key: 'website', label: 'Personal website', icon: Link2, placeholder: 'https://yourwebsite.com' },
]

export default function ProfessionalStep({ data, onChange }) {
  return (
    <div className="space-y-4">
      <span className="inline-block bg-sunny border-[3px] border-ink px-3 py-1 rounded-full text-xs font-display font-semibold -rotate-1 mb-1">
        All optional — add what you've got
      </span>
      {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key}>
          <label className="text-xs font-display font-semibold mb-1.5 block">{label}</label>
          <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
            />
          </div>
        </div>
      ))}
    </div>
  )
}