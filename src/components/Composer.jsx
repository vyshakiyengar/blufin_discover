import { useState } from 'react'
import { Trophy, Dumbbell, Megaphone, HandCoins } from 'lucide-react'
import { useStore } from '../store'
import { Avatar } from './ui'
import AchievementModal from './AchievementModal'

export default function Composer() {
  const { me, addPost, flash } = useStore()
  const [text, setText] = useState('')
  const [type, setType] = useState('update')
  const [achOpen, setAchOpen] = useState(false)
  if (!me) return null
  const isAthlete = me.role === 'athlete'
  const isOrg = ['foundation', 'federation', 'committee', 'government', 'brand', 'gym'].includes(me.role)

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addPost({ type, text: text.trim(), ...(type === 'fundraising' && me.funding ? { fundraiserOf: me.id } : {}) })
    setText('')
    flash('Posted to your followers')
  }

  const kinds = [
    ['update', 'Update', Megaphone],
    ['training', 'Training', Dumbbell],
    ...(isAthlete && me.funding ? [['fundraising', 'Fundraiser', HandCoins]] : []),
  ]

  return (
    <div className="card p-4">
      <form onSubmit={submit} className="flex gap-3">
        <Avatar e={me} size={46} />
        <div className="flex-1 min-w-0">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={text ? 3 : 1}
            placeholder={isOrg ? 'Share news, a call or an alert with your followers' : 'Share a result or an update'}
            className="w-full resize-none rounded-xl border border-line px-4 py-2.5 focus:outline-none focus:border-pool" />
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {isAthlete && (
              <button type="button" onClick={() => setAchOpen(true)} className="h-9 px-3 rounded-full bg-gold-soft text-[#7A5A10] text-sm font-semibold inline-flex items-center gap-1.5 hover:brightness-95">
                <Trophy className="size-4" />Add result
              </button>
            )}
            {kinds.map(([k, l, I]) => (
              <button type="button" key={k} onClick={() => setType(k)} aria-pressed={type === k}
                aria-label={l} className={`h-9 px-3 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 ${type === k ? 'bg-pool-soft text-deep' : 'text-ink-2 hover:bg-paper'}`}>
                <I className="size-4" /><span className="hidden sm:inline">{l}</span>
              </button>
            ))}
            <button disabled={!text.trim()} className="ml-auto h-9 px-5 rounded-full bg-deep text-white text-sm font-semibold disabled:opacity-40">Post</button>
          </div>
        </div>
      </form>
      {achOpen && <AchievementModal onClose={() => setAchOpen(false)} />}
    </div>
  )
}
