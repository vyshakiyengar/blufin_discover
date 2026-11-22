import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useStore, compact, inr } from '../store'
import { Avatar, Verified, FollowButton, MedalDisc, Progress, inputCls } from '../components/ui'
import { Cover } from '../components/SportPattern'
import { ROLE_GROUPS, ROLE_LABELS, STATES } from '../data/entities'

function EntityCard({ e }) {
  const { donations } = useStore()
  const medals = e.achievements ? ['gold', 'silver', 'bronze'].map(m => [m, e.achievements.filter(a => a.medal === m).length]) : null
  return (
    <Link to={`/u/${e.id}`} className="card overflow-hidden flex flex-col hover:border-pool transition-colors">
      <Cover sport={e.sport} role={e.role} className="h-16" />
      <div className="relative px-4 pb-4 -mt-7 flex-1 flex flex-col">
        <div className="flex items-end justify-between"><Avatar e={e} size={56} ring /><FollowButton id={e.id} size="sm" /></div>
        <div className="mt-2 font-bold flex items-center gap-1">{e.name}<Verified e={e} /></div>
        <div className="text-xs text-ink-3">{e.role === 'athlete' ? [e.sport, e.classification].filter(Boolean).join(' ') : ROLE_LABELS[e.role]}, {e.city}</div>
        <div className="text-sm text-ink-2 mt-2 leading-snug line-clamp-2">{e.headline}</div>
        <div className="mt-auto pt-3">
          {medals && medals.some(([, n]) => n) && <div className="flex gap-3">{medals.map(([m, n]) => <span key={m} className="flex items-center gap-1"><MedalDisc medal={m} size={18} /><span className="text-sm font-bold tabular">{n}</span></span>)}</div>}
          {e.funding && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-grass">Raising funds</span><span className="text-ink-3 tabular">{inr(e.funding.raised + (donations[e.id] || 0))} of {inr(e.funding.goal)}</span></div>
              <Progress value={e.funding.raised + (donations[e.id] || 0)} goal={e.funding.goal} />
            </div>
          )}
          {!medals && <div className="text-xs text-ink-3"><b className="text-ink tabular">{compact(e.followers)}</b> followers</div>}
        </div>
      </div>
    </Link>
  )
}

export default function Discover() {
  const { entities } = useStore()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [group, setGroup] = useState(params.get('role') || 'all')
  const [sport, setSport] = useState('')
  const [state, setState] = useState('')
  const [para, setPara] = useState('any')
  const [raising, setRaising] = useState(false)
  const [sponsor, setSponsor] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const sports = useMemo(() => [...new Set(entities.map(e => e.sport).filter(Boolean))].sort(), [entities])
  const list = useMemo(() => {
    const g = ROLE_GROUPS.find(x => x.key === group)
    const needle = q.trim().toLowerCase()
    return entities.filter(e => {
      if (g && !g.roles.includes(e.role)) return false
      if (needle && ![e.name, e.sport, e.city, e.state, e.headline, e.discipline, e.classification].filter(Boolean).join(' ').toLowerCase().includes(needle)) return false
      if (sport && e.sport !== sport) return false
      if (state && e.state !== state) return false
      if (para === 'para' && !e.para) return false
      if (para === 'olympic' && (e.para || e.role !== 'athlete')) return false
      if (raising && !e.funding) return false
      if (sponsor && !e.openTo?.includes('Sponsorship')) return false
      if (verifiedOnly && !e.verified) return false
      return true
    }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.followers - a.followers)
  }, [entities, group, q, sport, state, para, raising, sponsor, verifiedOnly])

  const athleteFilters = group === 'all' || group === 'athlete'

  return (
    <div className="max-w-[1180px] mx-auto px-3 sm:px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,4vw,2.6rem)]">Discover</h1>
      <p className="text-ink-2 mt-1">Find athletes, coaches, support staff, academies and the organisations backing Indian sport.</p>

      <form className="mt-5 flex gap-2" onSubmit={e => { e.preventDefault(); setParams(q ? { q } : {}) }}>
        <div className="relative flex-1">
          <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Name, sport, city or classification (try S9, javelin, Hyderabad)" className={`${inputCls} h-12 pl-11 rounded-full`} aria-label="Search" />
        </div>
        <button type="button" onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} className="h-12 px-4 rounded-full border border-line bg-white font-semibold inline-flex items-center gap-2"><SlidersHorizontal className="size-4" /><span className="hidden sm:inline">Filters</span></button>
      </form>

      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none" role="tablist">
        {[{ key: 'all', label: 'Everyone' }, ...ROLE_GROUPS].map(g => (
          <button key={g.key} role="tab" aria-selected={group === g.key} onClick={() => setGroup(g.key)}
            className={`h-9 px-4 rounded-full text-sm font-semibold whitespace-nowrap border ${group === g.key ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line hover:border-ink-3'}`}>{g.label}</button>
        ))}
      </div>

      {showFilters && (
        <div className="card p-4 mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 rise">
          <label className="text-sm font-semibold">Sport<select className={`${inputCls} mt-1`} value={sport} onChange={e => setSport(e.target.value)}><option value="">Any sport</option>{sports.map(s => <option key={s}>{s}</option>)}</select></label>
          <label className="text-sm font-semibold">State<select className={`${inputCls} mt-1`} value={state} onChange={e => setState(e.target.value)}><option value="">Any state</option>{STATES.map(s => <option key={s}>{s}</option>)}</select></label>
          {athleteFilters && <label className="text-sm font-semibold">Discipline<select className={`${inputCls} mt-1`} value={para} onChange={e => setPara(e.target.value)}><option value="any">Para and Olympic</option><option value="para">Para sports only</option><option value="olympic">Olympic sports only</option></select></label>}
          <div className="flex flex-col gap-2 justify-end text-sm">
            {athleteFilters && <label className="flex items-center gap-2"><input type="checkbox" checked={raising} onChange={e => setRaising(e.target.checked)} className="size-4 accent-[#0B3A5B]" />Raising funds</label>}
            {athleteFilters && <label className="flex items-center gap-2"><input type="checkbox" checked={sponsor} onChange={e => setSponsor(e.target.checked)} className="size-4 accent-[#0B3A5B]" />Open to sponsorship</label>}
            <label className="flex items-center gap-2"><input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="size-4 accent-[#0B3A5B]" />Verified only</label>
          </div>
        </div>
      )}

      <div className="mt-5 text-sm text-ink-3">{list.length} profiles</div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map(e => <EntityCard key={e.id} e={e} />)}
      </div>
      {list.length === 0 && <div className="card p-10 text-center text-ink-2 mt-3">No profiles match. Clear a filter or try a different search.</div>}
    </div>
  )
}

