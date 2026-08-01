import { UserCircle2, AtSign, Type, CheckCircle2 } from 'lucide-react'

export default function BasicInfoStep({ data, onChange }) {
  const bioLength = data.bio.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">First name</label>
          <div className="relative">
            <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              value={data.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="Aarav"
              className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Last name</label>
          <input
            value={data.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Sharma"
            className="w-full px-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-display font-semibold mb-1.5 block">Username</label>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <input
            value={data.username}
            onChange={(e) => onChange('username', e.target.value.replace(/\s/g, '').toLowerCase())}
            placeholder="aarav_sharma"
            className="w-full pl-11 pr-10 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
          {data.username.length >= 3 && (
            <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lime-dark" size={18} />
          )}
        </div>
        {data.username.length >= 3 && (
          <p className="text-xs text-lime-dark font-medium mt-1.5">@{data.username} looks available</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-display font-semibold block">Bio</label>
          <span className={`text-xs font-medium ${bioLength >= 300 ? 'text-bubblegum-dark' : 'text-ink/40'}`}>
            {bioLength}/300
          </span>
        </div>
        <div className="relative">
          <Type className="absolute left-3.5 top-3.5 text-ink/40" size={18} />
          <textarea
            value={data.bio}
            onChange={(e) => onChange('bio', e.target.value.slice(0, 300))}
            placeholder="Tell your campus a bit about yourself..."
            rows={4}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition resize-none"
          />
        </div>
      </div>
    </div>
  )
}