import { Users, Crown } from 'lucide-react'

const CommunityCard = ({ name, members, color, rotate }) => (
  <div className={`${color} ${rotate} border-[3px] border-ink rounded-2xl p-4 shadow-hard hover:rotate-0 transition-transform`}>
    <div className="w-10 h-10 bg-white border-[3px] border-ink rounded-xl flex items-center justify-center mb-3 -rotate-3">
      <Users size={16} />
    </div>
    <p className="font-display font-semibold text-sm mb-0.5">{name}</p>
    <p className="text-xs text-ink/60">{members} members</p>
  </div>
)

const COLORS = ['bg-sunny/50', 'bg-sky/40', 'bg-lime/40', 'bg-bubblegum/30']
const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

export default function CommunitiesSection({ data }) {
  const { joined, created } = data.communities

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-white border-[3px] border-ink rounded-lg flex items-center justify-center rotate-3 shadow-hard-sm">
            <Users size={16} />
          </div>
          <h3 className="font-display font-semibold text-base">Joined Communities ({joined.length})</h3>
        </div>
        {joined.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {joined.map((c, i) => (
              <CommunityCard key={c.id} {...c} color={COLORS[i % COLORS.length]} rotate={ROTATIONS[i % ROTATIONS.length]} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink/40">Not part of any communities yet.</p>
        )}
      </div>

      {created.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-bubblegum/30 border-[3px] border-ink rounded-lg flex items-center justify-center -rotate-3 shadow-hard-sm">
              <Crown size={16} />
            </div>
            <h3 className="font-display font-semibold text-base">Created by you ({created.length})</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {created.map((c, i) => (
              <CommunityCard key={c.id} {...c} color="bg-bubblegum/25" rotate={ROTATIONS[i % ROTATIONS.length]} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}