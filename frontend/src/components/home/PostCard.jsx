import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'

// Badge styling matches the reference exactly: "Achievement" is a solid warm pill,
// "Question"/"Event" are light pastel pills with colored text — not uniform solid colors.
const BADGE_STYLE = {
  solid: (color) => ({ backgroundColor: color, color: '#fff' }),
  pastel: (color) => ({ backgroundColor: `${color}1A`, color }),
}

export default function PostCard({ post }) {
  const { author, meta, tag, title, description, image, imageLabel, likes, comments, shares } = post

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-4">
      {/* Author row comes first, matching the reference — not image-first */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#F3EFFC] flex items-center justify-center text-sm font-semibold text-[#7C3AED] shrink-0">
            {author[0]}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{author}</p>
            <p className="text-xs text-[#9CA3AF]">{meta}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tag && (
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={BADGE_STYLE[tag.style || 'solid'](tag.color)}
            >
              {tag.label}
            </span>
          )}
          <button className="text-[#9CA3AF]"><MoreHorizontal size={16} /></button>
        </div>
      </div>

      <p className="font-semibold text-sm mb-1">{title}</p>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{description}</p>

      {/* Image/graphic sits after the text, at the bottom of the card */}
      {image && (
        <div className="w-full h-32 sm:h-36 bg-gradient-to-br from-[#1F2937] to-[#374151] rounded-xl flex items-center justify-center mb-3">
          <span className="text-white/70 text-sm font-medium">{imageLabel}</span>
        </div>
      )}

      <div className="flex items-center gap-5 text-[#6B7280] text-xs">
        <span className="flex items-center gap-1.5"><Heart size={16} className="text-[#EF4444]" /> {likes}</span>
        <span className="flex items-center gap-1.5"><MessageCircle size={16} /> {comments}</span>
        {shares > 0 && <span className="flex items-center gap-1.5"><Share2 size={16} /> {shares}</span>}
        <button className="ml-auto text-[#9CA3AF]"><Bookmark size={16} /></button>
      </div>
    </div>
  )
}