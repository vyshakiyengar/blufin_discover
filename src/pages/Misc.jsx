import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShieldCheck, Clock, Briefcase, Building2, MapPin } from 'lucide-react'
import { useStore, daysLeft } from '../store'
import { ORGS } from '../data/orgs'
import { KIND_LABEL, connectionsOf, verifiedLine } from '../lib/ecosystem'
import { EntityMark, VerifiedBadge, ConnectionsPanel } from '../components/Entity'
import { CircularRow, CircularModal } from '../components/Circular'
import { CallCard } from '../components/Call'
import { Chip, Empty } from '../components/ui'

function Header({ e, children }) {
  const v = verifiedLine(e)
  return (
    <div className="card overflow-hidden">
      <div className="lane-rope" />
      <div className="p-6 flex flex-wrap gap-5 items-center">
        <EntityMark e={e} size={92} />
        <div className="min-w-0 flex-1">
          <div className="text-sm text-ink-3">{KIND_LABEL[e.kind]}{e.sport ? `, ${e.sport}` : ''}</div>
          <h1 className="display text-[clamp(1.7rem,3.4vw,2.4rem)]">{e.name}</h1>
          {e.headline && <p className="text-ink-2 mt-1 max-w-[62ch]">{e.headline}</p>}
          {e.about && <p className="text-ink-2 mt-1 max-w-[70ch]">{e.about}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-3">
            <VerifiedBadge e={e} />{!e.official && <span>{v.text}</span>}
            {e.city && <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{e.city}{e.state ? `, ${e.state}` : ''}</span>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export function TeamMember() {
  const { id } = useParams()
  const { byId, pros, gyms, session, done } = useStore()
  const p = byId[id]
  useEffect(() => { if (session?.kind === 'athlete' && p && p.role !== 'gym') done('a-discover') }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!p || ![...pros, ...gyms].some(x => x.id === id)) return <div className="p-10 text-center">Profile not found. <Link to="/discover" className="text-pool font-semibold">Go to Discover</Link></div>
  const e = { ...p, kind: p.role }
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-5">
      <Header e={e} />
      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h2 className="display-tight text-lg mb-3">{e.kind === 'gym' ? 'Verified checks' : 'Credentials'}</h2>
          <ul className="space-y-3">
            {p.credentials.map(c => (
              <li key={c.name} className="flex gap-3">
                {c.status === 'verified' ? <ShieldCheck className="size-5 text-grass shrink-0 mt-0.5" /> : <Clock className="size-5 text-amber shrink-0 mt-0.5" />}
                <span><span className="font-semibold">{c.name}</span>
                  <span className={`block text-sm ${c.status === 'verified' ? 'text-grass' : 'text-amber'}`}>{c.status === 'verified' ? `Verified by ${ORGS[c.by]?.short || c.by}` : 'Document uploaded, not yet checked'}</span></span>
              </li>
            ))}
          </ul>
        </section>
        {e.kind === 'gym' ? (
          <section className="card p-5">
            <h2 className="display-tight text-lg mb-3">Facilities and programmes</h2>
            <ul className="space-y-2">{p.facilities.map(f => <li key={f} className="flex gap-2"><Building2 className="size-5 text-ink-3 shrink-0" />{f}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-2">{p.programmes.map(x => <Chip key={x} tone="teal">{x}</Chip>)}</div>
          </section>
        ) : (
          <section className="card p-5">
            <h2 className="display-tight text-lg mb-3">Experience</h2>
            <ul className="space-y-3">{p.history.map(([r, o, w]) => <li key={r + o} className="flex gap-3"><Briefcase className="size-5 text-ink-3 shrink-0 mt-0.5" /><span><b>{r}</b><span className="block text-sm text-ink-2">{o}</span><span className="block text-xs text-ink-3">{w}</span></span></li>)}</ul>
          </section>
        )}
      </div>
      <section>
        <h2 className="display-tight text-lg mb-3">Connections</h2>
        <ConnectionsPanel e={e} />
        <p className="text-xs text-ink-3 mt-3">A connection shows once both sides confirm it: an athlete confirms their coach from their passport, and the coach confirms the athlete.</p>
      </section>
    </div>
  )
}

export function OrgPage() {
  const { id } = useParams()
  const ctx = useStore()
  const { circulars, calls } = ctx
  const [open, setOpen] = useState(null)
  const o = ORGS[id]
  if (!o || o.kind === 'donor') return <div className="p-10 text-center">Not found. <Link to="/discover" className="text-pool font-semibold">Go to Discover</Link></div>
  const e = { ...o, kind: o.kind, official: true }
  const conns = connectionsOf(e, ctx).reduce((n, g) => n + g.items.length, 0)
  const mineC = circulars.filter(c => c.orgId === id)
  const mineCalls = calls.filter(c => c.orgId === id && daysLeft(c.closes) > 0)
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-6">
      <Header e={e} />
      <div className="grid grid-cols-3 gap-3">
        {[[conns, o.kind === 'foundation' ? 'athletes backed on Blufin Discover' : 'registered athletes on Blufin Discover'], [mineC.length, 'circulars'], [mineCalls.length, 'open calls']].map(([n, l]) => (
          <div key={l} className="card p-4"><div className="display text-3xl tabular text-deep">{n}</div><div className="text-sm text-ink-2">{l}</div></div>
        ))}
      </div>
      {mineCalls.length > 0 && <section><h2 className="display-tight text-lg mb-3">Open calls</h2><div className="space-y-3">{mineCalls.map(c => <CallCard key={c.id} call={c} athlete={ctx.me} />)}</div></section>}
      {mineC.length > 0 && <section><h2 className="display-tight text-lg mb-3">Circulars</h2><div className="space-y-2">{mineC.map(c => <CircularRow key={c.id} c={c} athlete={ctx.me} onOpen={() => setOpen(c)} />)}</div></section>}
      <section><h2 className="display-tight text-lg mb-3">Connections</h2>{conns ? <ConnectionsPanel e={e} /> : <Empty>No connections on Blufin Discover yet.</Empty>}</section>
      {open && <CircularModal c={open} athlete={ctx.me} onClose={() => setOpen(null)} />}
    </div>
  )
}
