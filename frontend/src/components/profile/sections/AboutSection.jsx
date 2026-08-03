import { GraduationCap, BookOpen, Users2, Calendar, Hash, MapPin, Home } from 'lucide-react'

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b-2 border-ink/10 last:border-b-0">
    <span className="flex items-center gap-2 text-xs text-ink/50 font-medium"><Icon size={14} /> {label}</span>
    <span className="text-sm font-semibold">{value || '—'}</span>
  </div>
)

export default function AboutSection({ data }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-sunny/40 border-[3px] border-ink rounded-2xl p-5 shadow-hard -rotate-1 hover:rotate-0 transition-transform">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 bg-white border-[3px] border-ink rounded-lg flex items-center justify-center rotate-3">
            <GraduationCap size={16} />
          </div>
          <h3 className="font-display font-semibold text-base">College Information</h3>
        </div>
        <InfoRow icon={GraduationCap} label="College" value={data.college.collegeName} />
        <InfoRow icon={BookOpen} label="Course" value={data.college.course} />
        <InfoRow icon={Hash} label="Department" value={data.college.department} />
        <InfoRow icon={Users2} label="Branch" value={data.college.branch} />
        <InfoRow icon={Calendar} label="Year" value={data.college.year && `${data.college.year}${['st','nd','rd'][data.college.year - 1] || 'th'} year`} />
        <InfoRow icon={Hash} label="Section" value={data.college.section} />
      </div>

      <div className="bg-sky/30 border-[3px] border-ink rounded-2xl p-5 shadow-hard rotate-1 hover:rotate-0 transition-transform">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 bg-white border-[3px] border-ink rounded-lg flex items-center justify-center -rotate-3">
            <MapPin size={16} />
          </div>
          <h3 className="font-display font-semibold text-base">Location</h3>
        </div>
        <InfoRow icon={MapPin} label="Current city" value={data.location.city} />
        <InfoRow icon={Home} label="Home town" value={data.location.homeTown} />
      </div>
    </div>
  )
}