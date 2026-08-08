import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Pencil, Settings, MapPin, Calendar, Flame, Star, Circle } from 'lucide-react'

// Fields counted toward the completion bar — extend this if you add more onboarding fields later.
const completionFields = (data = {}) => [
  data?.profilePicture,
  data?.bio,
  data?.college?.collegeName,
  data?.college?.department,
  data?.location?.current?.city,
  (data?.recommendation?.interests || []).length > 0,
  (data?.recommendation?.skills || []).length > 0,
  Object.values(data?.professional || {}).some(Boolean),
]

const STAT_COLORS = ['bg-sunny', 'bg-bubblegum', 'bg-sky']
const STAT_ROTATE = ['-rotate-2', 'rotate-1', '-rotate-1']

export default function ProfileHeader({ data, isOwner, onImageChange }) {
  const navigate = useNavigate()
  const coverInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  const filled = completionFields(data).filter(Boolean).length
  const total = completionFields(data).length
  const completion = Math.round((filled / total) * 100)

  const handleFile = (field) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onImageChange(field, reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white border-[3px] border-ink rounded-3xl shadow-hard-lg overflow-hidden mb-6">
      {/* Cover photo — patterned gradient when no image is set, instead of a flat tint */}
      <div className="relative h-36 sm:h-48 overflow-hidden">
        {data.coverPicture ? (
          <img src={data.coverPicture} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky via-lime/60 to-sunny relative">
            <Star className="absolute top-6 left-10 text-white/70" size={20} fill="currentColor" />
            <Circle className="absolute bottom-8 left-1/3 text-white/50" size={14} fill="currentColor" />
            <Star className="absolute top-10 right-1/4 text-white/60" size={16} fill="currentColor" />
            <Circle className="absolute bottom-4 right-14 text-white/50" size={10} fill="currentColor" />
          </div>
        )}
        {isOwner && (
          <>
            <button
              type="button"
              onClick={() => coverInputRef.current.click()}
              className="absolute top-3 right-3 bg-white border-[3px] border-ink rounded-xl p-2 shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              aria-label="Change cover photo"
            >
              <Camera size={16} />
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile('coverPicture')} />
          </>
        )}
      </div>

      <div className="px-5 sm:px-8 pb-6">
        {/* Avatar overlapping the cover, with a floating streak sticker */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-4">
          <div className="relative">
            <div className="sticker-wiggle w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-ink bg-bubblegum shadow-hard overflow-hidden flex items-center justify-center">
              {data.profilePicture ? (
                <img src={data.profilePicture} alt={data.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-semibold text-3xl">{data.firstName?.charAt(0).toUpperCase() || "?"}</span>
              )}
            </div>
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-sunny border-[3px] border-ink rounded-full p-1.5 shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                  aria-label="Change profile photo"
                >
                  <Camera size={13} />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile('profilePicture')} />
              </>
            )}
            {data.achievements?.streaks > 0 && (
              <span className="absolute -top-2 -left-3 bg-lime border-[3px] border-ink px-2 py-0.5 rounded-full text-[10px] font-display font-semibold shadow-hard-sm -rotate-6 flex items-center gap-0.5">
                <Flame size={11} /> {data.achievements.streaks}
              </span>
            )}
          </div>

          {isOwner && (
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="font-display font-semibold text-xs sm:text-sm flex items-center gap-1.5 bg-bubblegum border-[3px] border-ink px-3 sm:px-4 py-2 rounded-xl shadow-hard rotate-1 hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <Pencil size={14} /> Edit Profile
              </button>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="bg-white border-[3px] border-ink p-2.5 rounded-xl shadow-hard-sm -rotate-2 hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                aria-label="Settings"
              >
                <Settings size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Name, username, bio */}
        <h1 className="font-display font-semibold text-xl sm:text-2xl">{data.firstName} {data.lastName}</h1>
        <p className="text-sm text-ink/50 font-medium mb-2">@{data.username}</p>
        {data.bio && <p className="text-sm text-ink/70 leading-relaxed max-w-xl mb-3">{data.bio}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50 mb-4">
          {data?.location?.current?.city && (
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {data.location.current.city}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={13} /> Joined {new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Stats bar — tilted sticker-style cards, alternating colors */}
        <div className="flex flex-wrap gap-2.5 mb-5">
          {[
            ['Posts', data.stats?.postsCount || "0"],
            ['Friends', data.stats?.friendsCount || "0"],
            ['Communities', data.stats?.communitiesCount || "0"],
          ].map(([label, count], i) => (
            <div
              key={label}
              className={`${STAT_COLORS[i]} ${STAT_ROTATE[i]} border-[3px] border-ink rounded-xl px-4 py-1.5 text-center shadow-hard-sm hover:rotate-0 transition-transform`}
            >
              <p className="font-display font-semibold text-sm leading-none">{count}</p>
              <p className="text-[10px] text-ink/60 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Completion bar — owner only */}
        {isOwner && completion < 100 && (
          <div className="bg-cream border-[3px] border-ink rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-display font-semibold flex items-center gap-1.5">
                🎯 Profile completion
              </span>
              <span className="text-xs font-display font-semibold text-bubblegum-dark">{completion}%</span>
            </div>
            <div className="w-full h-3 bg-white border-[3px] border-ink rounded-full overflow-hidden">
              <div className="h-full bg-lime rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}