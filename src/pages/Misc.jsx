import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Award, Briefcase } from 'lucide-react'
import { useStore } from '../store'
import { Avatar, Chip } from '../components/ui'
import { ClassStatus, MedalTally } from '../components/Passport'

const ROLE = { coach: 'Coach', physio: 'Physiotherapist', nutritionist: 'Nutritionist', psychologist: 'Sports psychologist' }

export function TeamMember() {
  const { id } = useParams()
  const { byId, athletes } = useStore()
  const p = byId[id]
  if (!p || !p.role) return <div className="p-10 text-center">Not found</div>
  const works = athletes.filter(a => a.team?.some(([pid]) => pid === id))
  return (
    <div className="max-w-[800px] mx-auto px-4 py-6 space-y-4">
      <div className="card p-6 flex flex-wrap gap-5 items-center">
        <Avatar person={p} size={88} />
        <div><div className="text-sm text-ink-3">{ROLE[p.role]}, {p.sport}</div><h1 className="display text-3xl">{p.name}</h1><p className="text-ink-2 mt-1">{p.headline}</p><div className="text-sm text-ink-3 mt-1">{p.city}, {p.state}</div></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card p-5"><h2 className="font-semibold mb-3">Credentials</h2><ul className="space-y-2 text-sm">{p.credentials.map(c => <li key={c} className="flex gap-2"><Award className="size-5 text-gold shrink-0" />{c}</li>)}</ul></section>
        <section className="card p-5"><h2 className="font-semibold mb-3">Experience</h2><ul className="space-y-3 text-sm">{p.history.map(([r, o, w]) => <li key={r + o} className="flex gap-2"><Briefcase className="size-5 text-ink-3 shrink-0" /><span><b>{r}</b><span className="block text-ink-2">{o}</span><span className="block text-xs text-ink-3">{w}</span></span></li>)}</ul></section>
      </div>
      <section className="card p-5">
        <h2 className="font-semibold mb-3">Athletes on Blufin Discover</h2>
        <ul className="grid sm:grid-cols-2 gap-3">{works.map(a => <li key={a.id}><Link to={`/p/${a.id}`} className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-paper"><Avatar person={a} size={38} /><span><b>{a.name}</b><span className="block text-xs text-ink-3">{a.sport}{a.classification ? `, ${a.classification.cls}` : ''}</span></span></Link></li>)}</ul>
        <p className="text-xs text-ink-3 mt-4">Coaches co-sign their athletes' training and local results. Co-signed results are marked separately from federation-verified ones.</p>
      </section>
    </div>
  )
}

export function Explore() {
  const { athletes } = useStore()
  const [sport, setSport] = useState('')
  const sports = [...new Set(athletes.map(a => a.sport))].sort()
  const list = useMemo(() => athletes.filter(a => !sport || a.sport === sport), [athletes, sport])
  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Explore passports</h1>
      <p className="text-ink-2 mt-1">Public passports. Funders and federations get richer views when signed in.</p>
      <div className="mt-4 flex gap-2 flex-wrap">{['', ...sports].map(s => <button key={s || 'all'} onClick={() => setSport(s)} aria-pressed={sport === s} className={`h-9 px-4 rounded-full text-sm font-semibold border ${sport === s ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line'}`}>{s || 'All sports'}</button>)}</div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(a => (
          <Link key={a.id} to={`/p/${a.id}`} className="card p-4 hover:border-deep flex flex-col gap-3">
            <div className="flex items-center gap-3"><Avatar person={a} size={44} /><div><div className="font-semibold">{a.name}</div><div className="text-xs text-ink-3">{a.sport}, {a.city}</div></div></div>
            <div className="flex flex-wrap gap-1.5">{a.classification && <ClassStatus cls={a.classification} />}{a.dobVerified ? <Chip tone="grass">Age verified</Chip> : <Chip tone="amber">Age not verified</Chip>}{a.stamps?.length > 0 && <Chip tone="teal">{a.stamps.length} international</Chip>}</div>
            <MedalTally a={a} />
          </Link>
        ))}
      </div>
    </div>
  )
}
