import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CalendarDays, MapPin, Users, CheckCircle2, ShieldCheck, FileText, ArrowLeft, Star } from 'lucide-react'
import { useStore, daysLeft, fmtDate } from '../store'
import { Avatar, NameLink, Chip, Modal, MedalDisc } from '../components/ui'
import { OPP_GROUPS, OPP_TYPES } from '../data/opportunities'
import { matchesMe } from './Feed'

const isEntry = (o) => o.type === 'competition' || o.type === 'trial'
const tone = (t) => ['funding', 'scholarship', 'grant'].includes(t) ? 'grass' : ['sponsorship', 'inkind'].includes(t) ? 'gold' : 'pool'

function OppRow({ o }) {
  const { byId, applications, me } = useStore()
  const org = byId[o.orgId]
  const d = daysLeft(o.deadline)
  return (
    <Link to={`/opportunities/${o.id}`} className="card p-4 sm:p-5 flex gap-4 hover:border-pool transition-colors">
      <Avatar e={org} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2 items-center">
          <Chip tone={tone(o.type)}>{OPP_TYPES[o.type]}</Chip>
          {matchesMe(o, me) && <Chip tone="dark"><Star className="size-3" />Matches you</Chip>}
          {applications[o.id] && <Chip tone="pool"><CheckCircle2 className="size-3.5" />{isEntry(o) ? 'Entered' : 'Applied'}</Chip>}
        </div>
        <div className="display-tight text-lg mt-2">{o.title}</div>
        <div className="text-sm text-ink-2">{org?.name}</div>
        <p className="text-sm text-ink-2 mt-2 max-w-[70ch]">{o.summary}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
          {o.amount && <span className="font-semibold text-ink">{o.amount}</span>}
          {o.eventDate && <span className="flex items-center gap-1"><CalendarDays className="size-4" />{fmtDate(o.eventDate)}</span>}
          <span className="flex items-center gap-1"><MapPin className="size-4" />{o.location}</span>
          <span className="flex items-center gap-1"><Users className="size-4" />{o.applicants.toLocaleString('en-IN')} {isEntry(o) ? 'entries' : 'applicants'}</span>
        </div>
      </div>
      <div className="hidden sm:block text-right shrink-0">
        <div className={`display text-3xl tabular ${d <= 14 ? 'text-rope' : 'text-deep'}`}>{d}</div>
        <div className="text-xs text-ink-3">days left</div>
        <div className="text-xs text-ink-3 mt-1">Closes {fmtDate(o.deadline, { day: 'numeric', month: 'short' })}</div>
      </div>
    </Link>
  )
}

export function OpportunitiesList() {
  const { opportunities, me } = useStore()
  const [params] = useSearchParams()
  const [group, setGroup] = useState('all')
  const [forMe, setForMe] = useState(params.get('for') === 'me')
  const list = useMemo(() => {
    const g = OPP_GROUPS.find(x => x.key === group)
    return opportunities.filter(o => daysLeft(o.deadline) > 0 && (!g?.types || g.types.includes(o.type)) && (!forMe || matchesMe(o, me)))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
  }, [opportunities, group, forMe, me])

  return (
    <div className="max-w-[1000px] mx-auto px-3 sm:px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,4vw,2.6rem)]">Opportunities</h1>
      <p className="text-ink-2 mt-1 max-w-[65ch]">Funding calls, scholarships, trials, competitions and sponsorships from foundations, federations, brands and academies. Apply with your profile; your verified results go with it.</p>
      <div className="mt-5 flex gap-2 flex-wrap items-center">
        {OPP_GROUPS.map(g => (
          <button key={g.key} onClick={() => setGroup(g.key)} aria-pressed={group === g.key}
            className={`h-9 px-4 rounded-full text-sm font-semibold border ${group === g.key ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line'}`}>{g.label}</button>
        ))}
        {me?.role === 'athlete' && (
          <label className="ml-auto flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={forMe} onChange={e => setForMe(e.target.checked)} className="size-4 accent-[#0B3A5B]" />Only show matches for me</label>
        )}
      </div>
      <div className="mt-5 space-y-3">{list.map(o => <OppRow key={o.id} o={o} />)}</div>
      {list.length === 0 && <div className="card p-10 text-center text-ink-2 mt-3">No open opportunities match these filters.</div>}
    </div>
  )
}

function ApplyModal({ opp, onClose }) {
  const { me, apply, byId } = useStore()
  const entry = isEntry(opp)
  const verified = (me.achievements || []).filter(a => a.verifiedBy).length
  const coach = me.coachedBy?.[0] && byId[me.coachedBy[0]]
  const [askCoach, setAskCoach] = useState(!!coach)
  const [note, setNote] = useState('')
  return (
    <Modal title={entry ? `Enter: ${opp.title}` : `Apply: ${opp.title}`} onClose={onClose}>
      <div className="text-sm font-semibold mb-2">Sent with your application</div>
      <ul className="space-y-2 text-sm">
        <li className="flex gap-2 items-center"><CheckCircle2 className="size-5 text-grass" />Your Blufin Discover profile ({me.name})</li>
        <li className="flex gap-2 items-center"><ShieldCheck className="size-5 text-grass" />{verified} verified results, {(me.achievements || []).length} in total</li>
        {me.funding && !entry && <li className="flex gap-2 items-center"><FileText className="size-5 text-grass" />Your itemised season budget</li>}
        {coach && !entry && (
          <li><label className="flex gap-2 items-center"><input type="checkbox" checked={askCoach} onChange={e => setAskCoach(e.target.checked)} className="size-4 accent-[#0B3A5B]" />Ask {coach.name} for a recommendation</label></li>
        )}
      </ul>
      {!entry && (
        <label className="block mt-4">
          <span className="text-sm font-semibold">Why this programme? <span className="font-normal text-ink-3">(optional)</span></span>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-line p-3 focus:outline-none focus:border-pool" placeholder="Two or three lines is enough" />
        </label>
      )}
      <div className="mt-3 text-xs text-ink-3">Demo only: nothing is sent to {byId[opp.orgId]?.name}.</div>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} className="h-11 px-5 rounded-full border border-line font-semibold">Cancel</button>
        <button onClick={() => { apply(opp.id); onClose() }} className="h-11 px-5 rounded-full bg-deep text-white font-semibold">{entry ? 'Submit entry' : 'Submit application'}</button>
      </div>
    </Modal>
  )
}

function ApplicantsTable({ opp }) {
  const { entities, flash } = useStore()
  const [short, setShort] = useState([])
  const pool = entities.filter(e => e.role === 'athlete' && (opp.sports.includes(e.sport) || opp.sports.includes('All sports')))
    .map(e => ({ e, v: (e.achievements || []).filter(a => a.verifiedBy).length, m: (e.achievements || []).filter(a => a.medal).length }))
    .sort((a, b) => b.v - a.v || b.m - a.m)
  return (
    <section className="card p-5">
      <h2 className="display-tight text-lg">Applicants on Blufin Discover</h2>
      <p className="text-sm text-ink-2 mb-4">You are viewing this call as its organiser. Applicants are ranked by verified results.</p>
      <div className="divide-y divide-line">
        {pool.map(({ e, v, m }) => (
          <div key={e.id} className="py-3 flex items-center gap-3">
            <Avatar e={e} size={40} />
            <div className="flex-1 min-w-0"><NameLink e={e} /><div className="text-xs text-ink-3">{[e.sport, e.classification].filter(Boolean).join(' ')}, {e.city}</div></div>
            <div className="hidden sm:flex items-center gap-1 text-sm"><MedalDisc medal="gold" size={18} /><span className="tabular font-semibold">{m}</span></div>
            <Chip tone="pool"><ShieldCheck className="size-3.5" />{v} verified</Chip>
            <button onClick={() => { setShort(s => s.includes(e.id) ? s.filter(x => x !== e.id) : [...s, e.id]); flash(short.includes(e.id) ? 'Removed from shortlist' : `Shortlisted ${e.name}`) }}
              className={`h-8 px-3 rounded-full text-sm font-semibold ${short.includes(e.id) ? 'bg-grass text-white' : 'border border-line'}`}>{short.includes(e.id) ? 'Shortlisted' : 'Shortlist'}</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OpportunityDetail() {
  const { id } = useParams()
  const { opportunities, byId, me, applications } = useStore()
  const [open, setOpen] = useState(false)
  const o = opportunities.find(x => x.id === id)
  if (!o) return <div className="p-10 text-center">Not found. <Link to="/opportunities" className="text-pool font-semibold">Back to opportunities</Link></div>
  const org = byId[o.orgId]
  const d = daysLeft(o.deadline)
  const applied = applications[o.id]
  const entry = isEntry(o)
  const isOwner = me?.id === o.orgId

  return (
    <div className="max-w-[900px] mx-auto px-3 sm:px-4 py-6 space-y-4">
      <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-2 hover:text-ink"><ArrowLeft className="size-4" />All opportunities</Link>
      <div className="card overflow-hidden">
        <div className="lane-rope" />
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3"><Avatar e={org} size={48} /><div><NameLink e={org} /><div className="text-xs text-ink-3">Posted {fmtDate(o.opens, { day: 'numeric', month: 'short' })}</div></div></div>
          <div className="mt-4 flex gap-2 flex-wrap"><Chip tone={tone(o.type)}>{OPP_TYPES[o.type]}</Chip>{o.sports.slice(0, 4).map(s => <Chip key={s}>{s}</Chip>)}{o.sports.length > 4 && <Chip>+{o.sports.length - 4} sports</Chip>}</div>
          <h1 className="display text-[clamp(1.7rem,4vw,2.5rem)] mt-3">{o.title}</h1>
          <p className="text-ink-2 text-[17px] mt-2 max-w-[65ch]">{o.summary}</p>
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[[o.amount || (entry ? 'Entry' : 'Support'), o.amount ? 'Support' : 'Type'], [`${d} days`, `Left, closes ${fmtDate(o.deadline, { day: 'numeric', month: 'short' })}`], [o.seats ? String(o.seats) : 'Open', o.seats ? 'Places' : 'Places'], [o.applicants.toLocaleString('en-IN'), entry ? 'Entries so far' : 'Applicants so far']].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-paper p-3"><dt className="text-xs text-ink-3">{l}</dt><dd className={`display-tight text-lg mt-0.5 ${l.startsWith('Left') && d <= 14 ? 'text-rope' : ''}`}>{v}</dd></div>
            ))}
          </dl>
          {o.eventDate && <div className="mt-4 flex items-center gap-2 text-ink-2"><CalendarDays className="size-5" />Event on {fmtDate(o.eventDate)} at {o.location}</div>}
          {!o.eventDate && <div className="mt-4 flex items-center gap-2 text-ink-2"><MapPin className="size-5" />{o.location}</div>}
          <div className="mt-6">
            {isOwner ? <Chip tone="dark">You posted this</Chip>
              : !me ? <Link to="/" className="h-12 px-6 rounded-full bg-deep text-white font-semibold inline-flex items-center">Sign in to apply</Link>
              : me.role !== 'athlete' ? <div className="text-sm text-ink-2">Only athletes can apply. Coaches can recommend athletes from their profile.</div>
              : applied ? <div className="flex items-center gap-3 rounded-xl bg-grass-soft text-grass p-4 font-semibold"><CheckCircle2 className="size-6" />{entry ? 'Entry submitted' : 'Application submitted'}. Status: under review.</div>
              : <button onClick={() => setOpen(true)} className="h-12 px-6 rounded-full bg-deep text-white font-semibold">{entry ? 'Enter with my profile' : 'Apply with my profile'}</button>}
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card p-5"><h2 className="display-tight text-lg mb-3">Who can apply</h2><ul className="space-y-2">{o.eligibility.map(x => <li key={x} className="flex gap-2"><CheckCircle2 className="size-5 text-grass shrink-0" />{x}</li>)}</ul></section>
        <section className="card p-5"><h2 className="display-tight text-lg mb-3">What you'll need</h2><ul className="space-y-2">{o.asks.map(x => <li key={x} className="flex gap-2"><FileText className="size-5 text-pool shrink-0" />{x}</li>)}</ul></section>
      </div>
      {isOwner && <ApplicantsTable opp={o} />}
      {open && <ApplyModal opp={o} onClose={() => setOpen(false)} />}
    </div>
  )
}
