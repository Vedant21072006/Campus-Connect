import { useEffect } from 'react'
import { PartyPopper, XCircle, Info } from 'lucide-react'

const styles = {
  success: { bg: "bg-lime", icon: PartyPopper },
  error: { bg: "bg-bubblegum", icon: XCircle },
  info: { bg: "bg-sky", icon: Info },
}

export default function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  if (!message) return null

  const { bg, icon: Icon } = styles[type] || styles.info

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.2s_ease-out]">
      <div className={`${bg} text-ink border-[3px] border-ink px-5 py-3 rounded-2xl shadow-hard-sm flex items-center gap-2.5 max-w-sm font-body`}>
        <Icon size={18} className="shrink-0" />
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  )
}
