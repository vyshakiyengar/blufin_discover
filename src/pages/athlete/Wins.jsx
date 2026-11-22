import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useStore, fmtDate } from '../../store'
import { orgShort } from '../../data/orgs'
import { allResults } from '../../lib/eligibility'
import { Avatar, MedalDisc } from '../../components/ui'
import { SportPattern } from '../../components/SportPattern'

export default function Wins() {
  const { athletes, follows, toggleFollow, cheers, toggleCheer, session } = useStore()
  const [f, setF] = useState('all')
  const wins = useMemo(() => athletes.flatMap(a => allResults(a).filter(r => r.verifiedBy && r.medal && r.date >= '2026-06-01').map(r => ({ a, r })))
    .filter(({ a }) => f === 'all' || (f === 'following' ? follows.includes(a.id) : f === 'para' ? a.para : !a.para))
    .sort((x, y) => y.r.date.localeCompare(x.r.date)), [athletes, f, follows])

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Wins</h1>
      <p className="text-ink-2 mt-1 max-w-[62ch]">Medals from the last six months. Only results verified by a federation appear here, so every one is real.</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        {[['all', 'All'], ['following', 'Following'], ['para', 'Para sport'], ['olympic', 'Olympic sport']].map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} aria-pressed={f === k} className={`h-9 px-4 rounded-full text-sm font-semibold border ${f === k ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line'}`}>{l}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wins.map(({ a, r }) => {
          const cheered = cheers.includes(r.id)
          return (
            <article key={r.id} className="card overflow-hidden flex flex-col">
              <div className="relative bg-deep text-white p-4 min-h-[132px] overflow-hidden">
                <SportPattern sport={a.sport} className="absolute inset-0 h-full w-full opacity-70" />
                <div className="relative flex justify-between gap-3">
                  <div><div className="text-xs text-white/75">{r.result.split(',').slice(1).join(',').trim() || r.result}</div><div className="display text-3xl tabular mt-1">{r.mark || r.result.split(',')[0]}</div></div>
                  <MedalDisc medal={r.medal} size={44} />
                </div>
                <div className="relative text-xs text-white/80 mt-2">{r.event}</div>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Link to={`/p/${a.id}`}><Avatar person={a} size={38} /></Link>
                <div className="min-w-0 flex-1"><Link to={`/p/${a.id}`} className="font-semibold hover:underline">{a.name}</Link><div className="text-xs text-ink-3">{fmtDate(r.date, { day: 'numeric', month: 'short' })}, <ShieldCheck className="inline size-3.5 text-grass" /> {orgShort(r.verifiedBy)}</div></div>
              </div>
              {session && (
                <div className="mt-auto border-t border-line grid grid-cols-2 text-sm font-semibold">
                  <button onClick={() => toggleCheer(r.id)} aria-pressed={cheered} className={`h-10 hover:bg-paper ${cheered ? 'text-rope' : 'text-ink-2'}`}>{cheered ? 'Cheered' : 'Cheer'}</button>
                  <button onClick={() => toggleFollow(a.id)} aria-pressed={follows.includes(a.id)} className="h-10 hover:bg-paper text-ink-2 border-l border-line">{follows.includes(a.id) ? 'Following' : 'Follow'}</button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
