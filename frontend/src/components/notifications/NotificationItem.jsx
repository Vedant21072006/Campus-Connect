import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, MoreHorizontal, Ban, UserCheck, Send } from 'lucide-react'

export default function NotificationItem({ type, request, onAccept, onReject, onBlock }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const person = type === 'incoming' ? request.requester : request.recipient
  const name = `${person?.firstName || ''} ${person?.lastName || ''}`.trim() || person?.username || 'Unknown user'
  const meta = [person?.college?.branch, person?.college?.course].filter(Boolean).join(' · ')
  const accepted = request._status === 'accepted'

  const goToProfile = () => {
    // TODO: route to `/profile/${person.username}` once dynamic profile viewing exists
    navigate('/profile')
  }

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-3.5 flex items-center gap-3">
      <button onClick={goToProfile} className="shrink-0">
        {person?.profilePicture ? (
          <img src={person.profilePicture} alt={name} className="w-12 h-12 rounded-full border-2 border-ink object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-ink bg-[#7C3AED] flex items-center justify-center text-white font-display font-semibold">
            {name[0]?.toUpperCase() || '?'}
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <button onClick={goToProfile} className="text-left">
          <p className="font-display font-semibold text-sm truncate">{name}</p>
        </button>
        {meta && <p className="text-xs text-ink/50 truncate">{meta}</p>}

        {type === 'incoming' && (
          accepted ? (
            <p className="text-xs font-semibold text-[#16A34A] mt-1">🎉 You are now friends!</p>
          ) : (
            <p className="text-xs text-ink/60 mt-0.5">sent you a friend request</p>
          )
        )}
        {type === 'sent' && (
          <p className="text-xs text-ink/60 mt-0.5 flex items-center gap-1">
            <Send size={11} /> Friend request sent · <span className="font-semibold text-[#F59E0B]">Pending</span>
          </p>
        )}
      </div>

      {type === 'incoming' && !accepted && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAccept}
            className="w-9 h-9 bg-[#86EFAC] border-2 border-ink rounded-full flex items-center justify-center shadow-hard-sm"
            aria-label="Accept"
          >
            <Check size={16} />
          </button>
          <button
            onClick={onReject}
            className="w-9 h-9 bg-white border-2 border-ink rounded-full flex items-center justify-center shadow-hard-sm"
            aria-label="Reject"
          >
            <X size={16} />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen((p) => !p)} className="text-ink/40">
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border-2 border-ink rounded-xl shadow-hard-sm z-50 overflow-hidden">
                  <button
                    onClick={() => { setMenuOpen(false); onBlock() }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-[#EF4444] hover:bg-[#F3EFFC] transition"
                  >
                    <Ban size={13} /> Block user
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {accepted && <UserCheck size={18} className="text-[#16A34A] shrink-0" />}
    </div>
  )
}