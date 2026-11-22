import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Send } from 'lucide-react'
import { useStore } from '../../store'
import { evidence, verifiedResults } from '../../lib/eligibility'
import { Avatar, Chip, Btn, inputCls } from '../../components/ui'
import { ClassStatus } from '../../components/Passport'

export default function Scout() {
  const { athletes, watch, toggleWatch, invite, invites, applications, calls, session } = useStore()
  const myCalls = calls.filter(c => c.orgId === session.id)
  const sports = [...new Set(athletes.map(a => a.sport))].sort()
  const states = [...new Set(athletes.map(a => a.state))].sort()
  const [f, setF] = useState({ sport: 'Para Swimming', state: '', unbacked: true, ageOk: false, intl: false, budget: false, q: '' })
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))
  const list = useMemo(() => athletes.filter(a =>
    (!f.sport || a.sport === f.sport) && (!f.state || a.state === f.state) && (!f.unbacked || !(a.backing || []).length) &&
    (!f.ageOk || a.dobVerified) && (!f.intl || (a.stamps || []).length) && (!f.budget || a.season) &&
    (!f.q || `${a.name} ${a.city} ${a.classification?.cls || ''}`.toLowerCase().includes(f.q.toLowerCase()))
  ).sort((x, y) => verifiedResults(y).length - verifiedResults(x).length), [athletes, f])

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Scout</h1>
      <p className="text-ink-2 mt-1 max-w-[64ch]">Most foundations find athletes through coaches and scouts before any call opens. Search verified passports, keep a watchlist, and invite the ones you want to apply.</p>
      <div className="mt-5 grid lg:grid-cols-[250px_1fr] gap-6 items-start">
        <aside className="card p-4 space-y-3 lg:sticky lg:top-24">
          <input className={inputCls} placeholder="Name, city or class" value={f.q} onChange={e => set('q', e.target.value)} aria-label="Search" />
          <label className="block text-sm font-semibold">Sport<select className={`${inputCls} mt-1`} value={f.sport} onChange={e => set('sport', e.target.value)}><option value="">Any sport</option>{sports.map(s => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm font-semibold">State<select className={`${inputCls} mt-1`} value={f.state} onChange={e => set('state', e.target.value)}><option value="">All India</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
          {[['unbacked', 'Not backed by anyone yet'], ['ageOk', 'Age verified by a federation'], ['intl', 'Has an international result'], ['budget', 'Has a season budget']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f[k]} onChange={e => set(k, e.target.checked)} className="size-4 accent-[#0E3B43]" />{l}</label>
          ))}
          <div className="pt-2 border-t border-line text-sm"><b className="tabular">{watch.length}</b> on your watchlist</div>
        </aside>
        <div>
          <div className="text-sm text-ink-3 mb-3">{list.length} athletes, most verified results first</div>
          <ul className="space-y-2">
            {list.map(a => {
              const w = watch.includes(a.id)
              return (
                <li key={a.id} className="card p-4 flex flex-wrap items-center gap-4">
                  <Avatar person={a} size={46} />
                  <div className="min-w-0 flex-1">
                    <Link to={`/p/${a.id}`} className="font-semibold hover:underline">{a.name}</Link>
                    <div className="text-sm text-ink-3">{a.sport}, {a.city}, {a.state}, age {a.age}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.classification && <ClassStatus cls={a.classification} />}
                      {evidence(a).filter(e => e.ok && !e.label.startsWith('Class status')).slice(0, 3).map(e => <Chip key={e.label} tone="grass">{e.label}</Chip>)}
                      {myCalls.map(c => applications[c.id]?.[a.id] && <Chip key={c.id} tone="dark">Applied to {c.title}: {applications[c.id][a.id].stage}</Chip>)}
                      {a.season && <Chip tone="gold">Needs funding</Chip>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn kind={w ? 'soft' : 'ghost'} onClick={() => toggleWatch(a.id)} aria-pressed={w}><Star className="size-4" fill={w ? 'currentColor' : 'none'} />{w ? 'Watching' : 'Watch'}</Btn>
                    <Btn kind="ghost" disabled={invites.includes(a.id)} onClick={() => invite(a.id)}><Send className="size-4" />{invites.includes(a.id) ? 'Invited' : 'Invite to apply'}</Btn>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
