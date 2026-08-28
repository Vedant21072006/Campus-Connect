import { useEffect, useRef, useState } from 'react'
import {
  UserPlus,
  Clock,
  Check,
  MoreHorizontal,
  Flag,
  UserX,
  MessageCircle,
} from 'lucide-react'

import { removeFriend,  reportUser, getFriendshipStatus, sendRequest} from '../../../services/friendshipApi.js'

// status: 'none' | 'pending' | 'friends'
export default function FriendshipControls({
  targetUserId,
  initialStatus = 'none',
  onChat,
  onStatusChange,
}) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef(null)

  const updateStatus = (next) => {
    setStatus(next)
    onStatusChange?.(next)
  }

  // -----------------------------------
  // Close the dropdown on outside click
  // -----------------------------------

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // -----------------------------------
  // While a request is pending, poll for
  // the other person accepting/rejecting.
  // Swap this for a socket event if you have one.
  // -----------------------------------

  useEffect(() => {
    if (status !== 'pending' || !targetUserId) return

    const interval = setInterval(async () => {
      try {
        const result = await getFriendshipStatus(targetUserId)
        // Rejected requests should come back from your API as 'none'
        if (result?.status && result.status !== 'pending') {
          updateStatus(result.status)
        }
      } catch (error) {
        console.error('Friendship status check failed:', error)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [status, targetUserId])

  // -----------------------------------
  // TOGGLE BUTTON
  // -----------------------------------

  const handleToggleClick = async () => {
    if (loading || status === 'friends') return

    try {
      setLoading(true)

      if (status === 'none') {
        await sendRequest(targetUserId)
        updateStatus('pending')
      } else if (status === 'pending') {
        await removeFriend(targetUserId)
        updateStatus('none')
      }
    } catch (error) {
      console.error('Friendship action failed:', error)
      alert(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------------
  // MENU ACTIONS
  // -----------------------------------

  const handleUnfriend = async () => {
    if (loading) return
    setMenuOpen(false)

    try {
      setLoading(true)
      await removeFriend(targetUserId)
      updateStatus('none')
    } catch (error) {
      console.error('Unfriend failed:', error)
      alert(error.message || 'Could not remove friend')
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    setMenuOpen(false)
    const reason = window.prompt('Tell us why you are reporting this profile:')
    if (!reason) return

    try {
      await reportUser(targetUserId, reason)
      alert('Report submitted. Our team will review it shortly.')
    } catch (error) {
      console.error('Report failed:', error)
      alert(error.message || 'Could not submit report')
    }
  }

  const handleChat = () => {
    setMenuOpen(false)
    onChat?.(targetUserId)
  }

  // -----------------------------------
  // RENDER
  // -----------------------------------

  const toggleConfig = {
    none: {
      label: 'Add Friend',
      icon: <UserPlus size={14} />,
      className: 'bg-bubblegum rotate-1',
    },
    pending: {
      label: 'Pending',
      icon: <Clock size={14} />,
      className: 'bg-sunny -rotate-1',
    },
    friends: {
      label: 'Friends',
      icon: <Check size={14} />,
      className: 'bg-lime rotate-1',
    },
  }[status]

  return (
    <div className="flex items-center gap-2 mb-1">

      {/* Toggle: Add Friend -> Pending -> Friends */}
      <button
        type="button"
        disabled={loading || status === 'friends'}
        onClick={handleToggleClick}
        className={`font-display font-semibold text-xs sm:text-sm flex items-center gap-1.5 ${toggleConfig.className} border-[3px] border-ink px-3 sm:px-4 py-2 rounded-xl shadow-hard hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-default`}
      >
        {loading ? (
          <span className="text-xs font-bold">...</span>
        ) : (
          <>
            {toggleConfig.icon}
            {toggleConfig.label}
          </>
        )}
      </button>

      {/* Three-dot menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="bg-white border-[3px] border-ink p-2.5 rounded-xl shadow-hard-sm -rotate-2 hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border-[3px] border-ink rounded-xl shadow-hard z-20 overflow-hidden">

            <button
              type="button"
              onClick={handleChat}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-display font-semibold hover:bg-cream transition-colors"
            >
              <MessageCircle size={14} />
              Chat
            </button>

            {status === 'friends' && (
              <button
                type="button"
                onClick={handleUnfriend}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-display font-semibold hover:bg-cream transition-colors border-t-[3px] border-ink"
              >
                <UserX size={14} />
                Unfriend
              </button>
            )}

            <button
              type="button"
              onClick={handleReport}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-display font-semibold text-red-500 hover:bg-cream transition-colors border-t-[3px] border-ink"
            >
              <Flag size={14} />
              Report
            </button>

          </div>
        )}
      </div>

    </div>
  )
}