import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, Send, Trophy } from 'lucide-react'
import { useStore } from '../store'
import { GROUPS, verifiedLine } from '../lib/ecosystem'
import { EntityCard } from '../components/Entity'
import { Btn, inputCls } from '../components/ui'
import { roleOf } from '../components/Shell'

const selCls = inputCls.replace('w-full ', '') + ' w-auto rounded-full pr-8'

// With no group chosen, mix the groups so the first screen shows the whole ecosystem
function interleave(items) {
  const buckets = GROUPS.map(g => items.filter(g.test))
  const out = []
  for (let i = 0; out.length < items.length; i++) buckets.forEach(b => { if (b[i]) out.push(b[i]) })
  return out
}

export default function Discover() {
  const { entities, session, watch, toggleWatch, invite, invites, done } = useStore()
  const [params, setParams] = useSearchParams()
  const group = params.get('group') || ''
  const q = params.get('q') || ''
  const sport = params.get('sport') || ''
  const state = params.get('state') || ''
  const verifiedOnly = params.get('verified') === '1'
  const unbacked = params.get('unbacked') === '1'
  const set = (k, v) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }) }
  const isFoundation = roleOf(session) === 'foundation'

  const sports = useMemo(() => [...new Set(entities.filter(e => e.kind === 'athlete').map(e => e.sport))].sort(), [entities])
  const states = useMemo(() => [...new Set(entities.map(e => e.state).filter(Boolean))].sort(), [entities])
  const g = GROUPS.find(x => x.key === group)
  const list = useMemo(() => entities.filter(e =>
    (!g || g.test(e)) &&
    (!q || `${e.name} ${e.sport || ''} ${e.city || ''} ${e.classification?.cls || ''} ${e.headline || ''}`.toLowerCase().includes(q.toLowerCase())) &&
    (!sport || e.sport === sport || (e.kind !== 'athlete' && (e.sport || '').includes(sport.replace('Para ', '')))) &&
    (!state || e.state === state) &&
    (!verifiedOnly || verifiedLine(e).strength >= 0.75) &&
    (!unbacked || (e.kind === 'athlete' && !(e.backing || []).length))
  ).sort((a, b) => verifiedLine(b).strength - verifiedLine(a).strength), [entities, g, q, sport, state, verifiedOnly, unbacked])
  const shown = useMemo(() => (g ? list : interleave(list)), [g, list])

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Discover</h1>
          <p className="text-ink-2 mt-1 max-w-[64ch]">Everyone in the ecosystem, in one place. Each profile shows what has been verified and who it is connected to.</p>
        </div>
        <Link to="/wins" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pool hover:underline"><Trophy className="size-4" />Recent verified wins</Link>
      </div>

      <div className="mt-5 grid grid-cols-3 md:grid-cols-6 gap-2" role="tablist" aria-label="Who to show">
        {GROUPS.map(gr => {
          const n = entities.filter(gr.test).length
          const on = group === gr.key
          return (
            <button key={gr.key} role="tab" aria-selected={on} onClick={() => set('group', on ? '' : gr.key)}
              className={`rounded-xl p-3 text-left border-2 transition-colors ${on ? 'bg-deep text-white border-deep' : 'bg-white border-line hover:border-ink-3'}`}>
              <div className="display text-2xl tabular">{n}</div>
              <div className={`text-xs font-semibold leading-tight ${on ? 'text-white/85' : 'text-ink-2'}`}>{gr.label}</div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input defaultValue={q} onChange={e => set('q', e.target.value)} placeholder="Name, sport, city or class (try S9, physio, Hyderabad)" className={`${inputCls} pl-11 rounded-full`} aria-label="Search" />
        </div>
        <select className={selCls} value={sport} onChange={e => set('sport', e.target.value)} aria-label="Sport"><option value="">Any sport</option>{sports.map(s => <option key={s}>{s}</option>)}</select>
        <select className={selCls} value={state} onChange={e => set('state', e.target.value)} aria-label="State"><option value="">All India</option>{states.map(s => <option key={s}>{s}</option>)}</select>
        <label className="flex items-center gap-2 text-sm font-semibold px-2"><input type="checkbox" checked={verifiedOnly} onChange={e => set('verified', e.target.checked ? '1' : '')} className="size-4 accent-[#0E3B43]" />Verified only</label>
        {isFoundation && <label className="flex items-center gap-2 text-sm font-semibold px-2"><input type="checkbox" checked={unbacked} onChange={e => set('unbacked', e.target.checked ? '1' : '')} className="size-4 accent-[#0E3B43]" />Athletes not yet backed</label>}
      </div>

      <div className="mt-4 text-sm text-ink-3">{list.length} profiles{g ? ', most verified first' : ', mixed across the ecosystem'}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(e => (
          <EntityCard key={e.kind + e.id} e={e} actions={isFoundation && e.kind === 'athlete' && (
            <div className="flex gap-2 pt-1">
              <Btn kind={watch.includes(e.id) ? 'soft' : 'ghost'} className="h-9 flex-1" onClick={() => { toggleWatch(e.id); done('fd-scout') }} aria-pressed={watch.includes(e.id)}><Star className="size-4" fill={watch.includes(e.id) ? 'currentColor' : 'none'} />{watch.includes(e.id) ? 'Watching' : 'Watch'}</Btn>
              <Btn kind="ghost" className="h-9 flex-1" disabled={invites.includes(e.id)} onClick={() => invite(e.id)}><Send className="size-4" />{invites.includes(e.id) ? 'Invited' : 'Invite'}</Btn>
            </div>
          )} />
        ))}
      </div>
      {!list.length && <div className="card p-10 text-center text-ink-2 mt-3">No profiles match. Clear a filter or try another search.</div>}
    </div>
  )
}
