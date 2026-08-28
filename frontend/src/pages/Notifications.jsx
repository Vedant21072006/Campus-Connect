import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import NotificationItem from '../components/notifications/NotificationItem.jsx'
import Toast from '../components/Toast.jsx'
import Loader from '../components/Loader.jsx'
import {
  getIncomingRequests, getSentRequests, acceptFriendRequest, rejectFriendRequest, blockUser,
} from '../services/friendshipApi.js'

// No websocket/push setup yet, so this polls for new incoming requests
// instead — swap for a socket event once real-time infra exists.
const POLL_INTERVAL = 20000

export default function Notifications() {
  const navigate = useNavigate()
  const [incoming, setIncoming] = useState([])
  const [sent, setSent] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const loadAll = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const [incomingRes, sentRes] = await Promise.all([getIncomingRequests(), getSentRequests()])

      // Merge rather than replace, so requests the user already accepted/rejected
      // locally don't get reset back to "pending" by the next poll.
      setIncoming((prev) => {
        const knownIds = new Set(prev.map((r) => r._id))
        const fresh = (incomingRes.requests || [])
          .filter((r) => !knownIds.has(r._id))
          .map((r) => ({ ...r, _status: 'pending' }))
        return [...fresh, ...prev]
      })

      if (isInitial) {
        setSent((sentRes.requests || []).map((r) => ({ ...r, _status: 'pending' })))
      }
    } catch (err) {
      setToast({ message: 'Could not load notifications.', type: 'error' })
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll(true)
    const interval = setInterval(() => loadAll(false), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadAll])

  const handleAccept = async (requesterId) => {
    try {
      await acceptFriendRequest(requesterId)
      setIncoming((prev) =>
        prev.map((r) => (r.requester?._id === requesterId ? { ...r, _status: 'accepted' } : r))
      )
      setToast({ message: 'You are now friends! 🎉', type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Could not accept request.', type: 'error' })
    }
  }

  const handleReject = async (requestId) => {
    try {
      await rejectFriendRequest(requestId)
      setIncoming((prev) => prev.filter((r) => r._id !== requestId))
      setToast({ message: 'Request declined.', type: 'info' })
    } catch (err) {
      setToast({ message: err.message || 'Could not reject request.', type: 'error' })
    }
  }

  const handleBlock = async (userId, requestId) => {
    try {
      await blockUser(userId)
      setIncoming((prev) => prev.filter((r) => r._id !== requestId))
      setToast({ message: 'User blocked.', type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Could not block user.', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F3EFFC]">
      <div className="sticky top-0 z-20 bg-[#F3EFFC] px-4 sm:px-6 pt-4 pb-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/feed')}
            className="w-10 h-10 bg-white border-[2.5px] border-ink rounded-full flex items-center justify-center shadow-hard-sm shrink-0"
          >
            <ArrowLeft size={17} />
          </button>
          <h1 className="font-display font-bold text-xl flex items-center gap-2">
            <Bell size={20} /> Notifications
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10 flex flex-col gap-5">
        {loading ? (
          <div className="flex justify-center py-16"><Loader color="#16151A" /></div>
        ) : (
          <>
            <section>
              <p className="font-display font-semibold text-sm text-ink/60 mb-2 px-1">Friend Requests</p>
              {incoming.length === 0 ? (
                <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-8 text-center">
                  <p className="text-sm text-ink/50">No friend requests right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {incoming.map((req) => (
                    <NotificationItem
                      key={req._id}
                      type="incoming"
                      request={req}
                      onAccept={() => handleAccept(req.requester?._id)}
                      onReject={() => handleReject(req._id)}
                      onBlock={() => handleBlock(req.requester?._id, req._id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {sent.length > 0 && (
              <section>
                <p className="font-display font-semibold text-sm text-ink/60 mb-2 px-1">Sent Requests</p>
                <div className="flex flex-col gap-3">
                  {sent.map((req) => (
                    <NotificationItem key={req._id} type="sent" request={req} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}