import { useState } from 'react'
import { Grid3x3, Bookmark, Heart } from 'lucide-react'

const SUB_TABS = [
  { key: 'own', label: 'Posts', icon: Grid3x3 },
  { key: 'saved', label: 'Saved', icon: Bookmark, ownerOnly: true },
  { key: 'liked', label: 'Liked', icon: Heart, ownerOnly: true },
]

const CARD_ROTATE = ['-rotate-1', 'rotate-1']

export default function PostsSection({ data, isOwner }) {
  const [subTab, setSubTab] = useState('own')
  const visibleTabs = SUB_TABS.filter((t) => !t.ownerOnly || isOwner)
  const activePosts = data.posts[subTab] || []

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {visibleTabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`font-display font-semibold text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg border-[3px] border-ink transition-all ${
              subTab === key ? 'bg-sunny translate-x-[1px] translate-y-[1px] shadow-none' : 'bg-white shadow-hard-sm hover:-translate-y-0.5'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activePosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {activePosts.map((post, i) => (
            <div key={post.id} className={`bg-white border-[3px] border-ink rounded-2xl p-4 shadow-hard ${CARD_ROTATE[i % 2]} hover:rotate-0 transition-transform`}>
              <p className="text-sm mb-3">{post.caption}</p>
              <p className="text-xs text-ink/50 flex items-center gap-1"><Heart size={12} className="text-bubblegum" fill="currentColor" /> {post.likes} likes</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-[3px] border-ink rounded-2xl p-8 text-center shadow-hard-sm">
          <p className="text-sm text-ink/50">Nothing here yet.</p>
        </div>
      )}
    </div>
  )
}