import { useNavigate } from 'react-router-dom'
import { Menu, Megaphone, Sparkles, Bell } from 'lucide-react'
import { getme } from '../../services/meApi.js'
import { useEffect, useState } from 'react'
import usePresence from '../../hooks/usePresence.js'
import socket from '../../socket/socket.js'
export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const { onlineUsers, isOnline } = usePresence()


  // console.log("Socket connected:", socket.connected);
  // console.log("Online users:", onlineUsers);


  useEffect(() => {
    const getID = async () => {
      let temp_id = await getme()
      setId(temp_id)
    }
    getID()
  }, [])

  console.log(isOnline(id))
  console.log(onlineUsers)

  return (
    <div className="sticky top-0 z-30 px-2 sm:px-4 pt-2 pb-3 bg-[#F3EFFC]">
      <div
        className="max-w-6xl mx-auto bg-[#F3EFFC] border-[3px] border-ink rounded-[26px] px-4 sm:px-5 py-2.5 flex items-center justify-between"
        style={{ boxShadow: '0 5px 0 0 #16151A' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 bg-white border-[2.5px] border-ink rounded-full flex items-center justify-center shrink-0"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">🚀</span>
            <span className="font-display font-bold text-lg text-ink">CampusConnect</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="w-10 h-10 bg-[#FFD93D] border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center" onClick={() => navigate('/suggestions')}>
            <Megaphone size={17} className="text-[#E8447A]" fill="#E8447A" fillOpacity={0.15} />
          </button>
          {/* <button className="w-10 h-10 bg-[#7C3AED] border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center">
            <Sparkles size={17} className="text-white" fill="white" />
          </button> */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 bg-white border-[2.5px] border-ink rounded-xl shadow-hard-sm flex items-center justify-center"
          >
            <Bell size={17} className="text-ink" />
            <span className="absolute -top-2 -right-2 bg-[#EF4444] border-2 border-white text-white text-[3px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
              
            </span>
          </button >
          {/* Placeholder avatar — swap for a real photo/uploaded image; can't generate a realistic person here */}
          <div
            className="relative w-11 h-11 shrink-0 cursor-pointer"
            onClick={() => navigate(`/profile/${id}`)}
          >
            <div className="w-full h-full rounded-full border-[2.5px] border-ink p-0.5 bg-[#7C3AED]">
              <div className="w-full h-full rounded-full bg-[#F3EFFC] flex items-center justify-center text-xs font-bold text-ink">
                🙎🏻‍♂️
              </div>
            </div>

            {/* Online / Offline indicator */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline(id) ? "bg-green-500" : "bg-gray-400"
                }`}
              title={isOnline(id) ? "Online" : "Offline"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}