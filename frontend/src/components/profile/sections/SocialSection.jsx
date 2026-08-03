import { UserPlus, UserCheck, Clock, MessageCircle, Users2 } from 'lucide-react'

const STATUS_CONFIG = {
  add: { label: 'Add Friend', icon: UserPlus, color: 'bg-bubblegum' },
  pending: { label: 'Request Sent', icon: Clock, color: 'bg-sunny' },
  friends: { label: 'Friends', icon: UserCheck, color: 'bg-lime' },
}

const AVATAR_COLORS = ['bg-sky/60', 'bg-bubblegum/50', 'bg-sunny/60', 'bg-lime/60']

export default function SocialSection({ data, isOwner }) {
  const status = STATUS_CONFIG[data.social.friendStatus]

  return (
    <div className="space-y-4">
      {!isOwner && status && (
        <div className="flex gap-3">
          <button className={`${status.color} font-display font-semibold text-sm flex items-center gap-2 border-[3px] border-ink px-4 py-2.5 rounded-xl shadow-hard -rotate-1 hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}>
            <status.icon size={16} /> {status.label}
          </button>
          <button className="bg-white font-display font-semibold text-sm flex items-center gap-2 border-[3px] border-ink px-4 py-2.5 rounded-xl shadow-hard rotate-1 hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <MessageCircle size={16} /> Message
          </button>
        </div>
      )}

      <div className="bg-white border-[3px] border-ink rounded-2xl p-5 shadow-hard">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-bubblegum/30 border-[3px] border-ink rounded-lg flex items-center justify-center rotate-3">
            <Users2 size={16} />
          </div>
          <h3 className="font-display font-semibold text-base">Friends ({data.social.friends.length})</h3>
        </div>
        {data.social.friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.social.friends.map((friend, i) => (
              <div key={friend.id} className="sticker-wiggle flex flex-col items-center text-center gap-1.5 p-2 rounded-xl hover:bg-cream transition cursor-pointer">
                <div className={`w-12 h-12 rounded-full border-[3px] border-ink ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center font-display font-semibold text-sm`}>
                  {friend.name[0]}
                </div>
                <p className="text-xs font-medium truncate w-full">{friend.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink/40">No friends yet.</p>
        )}
      </div>

      {data.social.mutualFriends.length > 0 && (
        <div className="bg-sunny/30 border-[3px] border-ink rounded-2xl p-5 shadow-hard-sm rotate-1">
          <h3 className="font-display font-semibold text-sm mb-2">Mutual Friends</h3>
          <p className="text-xs text-ink/60">{data.social.mutualFriends.length} mutual friends</p>
        </div>
      )}
    </div>
  )
}