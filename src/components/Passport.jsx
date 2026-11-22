import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, AlertTriangle, FileBadge2, Download, Target, CheckCircle2, CircleDashed } from 'lucide-react'
import { fmtDate, inr } from '../store'
import { ORGS, orgShort } from '../data/orgs'
import { LEVELS } from '../data/people'
import { Avatar, MedalDisc, MEDAL, Chip, SourceTag, Progress, OrgMark, Empty } from './ui'
import { allResults } from '../lib/eligibility'

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
const INKS = ['#B3261E', '#3B4BA8', '#1F7A4D', '#7A3FA0', '#8A5A12', '#0E6E7A']

// ── Machine-readable zone, like the bottom of a passport identity page ──
function mrz(a) {
  const clean = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '<')
  const [first, ...rest] = a.name.split(' ')
  const pad = (s) => (s + '<'.repeat(44)).slice(0, 44)
  const l1 = pad(`SP<IND${clean(rest.join(' ') || first)}<<${clean(first)}`)
  const uid = (a.ids?.[0]?.value || 'UNREGISTERED').replace(/-/g, '')
  const dob = a.dob ? a.dob.slice(2).replace(/-/g, '') : '<<<<<<'
  const l2 = pad(`${clean(uid)}<IND${dob}${a.gender || '<'}<${clean(a.classification?.cls || '')}<${clean(a.sport)}`)
  return [l1, l2]
}

export function IdentityPage({ a, compact, publicView }) {
  const [l1, l2] = useMemo(() => mrz(a), [a])
  const cls = a.classification
  return (
    <div className="leaf rounded-xl border border-line overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 text-[11px] font-semibold text-ink-3" style={{ fontVariationSettings: '"wdth" 112' }}>
        <span>Sports Passport, Republic of India</span>
        <span>Blufin Discover</span>
      </div>
      <div className="p-4 sm:p-5 grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-6">
        <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
          <div className="rounded-lg border border-line bg-white p-2"><Avatar person={a} size={compact ? 72 : 104} /></div>
          {a.dobVerified
            ? <Chip tone="grass"><ShieldCheck className="size-3.5" />Identity verified</Chip>
            : <Chip tone="amber"><AlertTriangle className="size-3.5" />Age not verified</Chip>}
        </div>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm min-w-0">
          <Fact k="Name" v={a.name} wide />
          <Fact k="Sport" v={a.sport} />
          <Fact k="Events" v={a.events?.join(', ')} />
          {cls && <Fact k="Sport class" v={<span className="flex items-center gap-1.5 flex-wrap">{cls.cls}<ClassStatus cls={cls} /></span>} />}
          <Fact k={publicView ? 'Year of birth' : 'Date of birth'} v={a.dob ? (publicView ? a.dob.slice(0, 4) : fmtDate(a.dob)) : `Age ${a.age}`} sub={a.dobVerified ? `Verified by ${orgShort(a.dobVerified.by)}: ${a.dobVerified.doc}` : (a.ageFlag || 'No verified birth record yet')} warn={!a.dobVerified} />
          <Fact k="Represents" v={a.represents} sub={a.club} />
          {a.minor && <Fact k="Managed by" v="Athlete with parent or guardian" />}
        </dl>
      </div>
      {!compact && (
        <div className="px-4 sm:px-5 pb-4">
          <div className="text-xs font-semibold text-ink-3 mb-2">Federation IDs</div>
          <div className="flex flex-wrap gap-2">
            {(a.ids || []).map(i => (
              <span key={i.label} className={`rounded-lg border px-3 py-1.5 text-sm bg-white ${i.valid ? 'border-line' : 'border-rope/50'}`}>
                <span className="text-ink-3 text-xs block">{i.label}{i.season ? `, ${i.season}` : ''}</span>
                <span className="mrz text-[13px] tracking-normal">{i.value}</span>
                {!i.valid && <span className="block text-xs font-semibold text-rope">Expired: renew to enter events</span>}
              </span>
            ))}
            {(a.ids || []).length === 0 && <span className="text-sm text-ink-3">No federation IDs added</span>}
          </div>
        </div>
      )}
      <div className="bg-white/70 border-t border-line px-4 sm:px-5 py-2.5 overflow-hidden" aria-hidden>
        <div className="mrz text-[11px] sm:text-[13px] text-ink-2 whitespace-nowrap">{l1}</div>
        <div className="mrz text-[11px] sm:text-[13px] text-ink-2 whitespace-nowrap">{l2}</div>
      </div>
    </div>
  )
}

function Fact({ k, v, sub, wide, warn }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <dt className="text-[11px] font-semibold text-ink-3">{k}</dt>
      <dd className={`font-semibold leading-snug ${wide ? 'display-tight text-xl' : ''}`}>{v}</dd>
      {sub && <dd className={`text-xs mt-0.5 ${warn ? 'text-amber font-semibold' : 'text-ink-3'}`}>{sub}</dd>}
    </div>
  )
}

export function ClassStatus({ cls }) {
  const s = cls.status
  const tone = s === 'Confirmed' ? 'grass' : s === 'New' ? 'amber' : 'teal'
  const text = s === 'Review' && cls.reviewYear ? `Review ${cls.reviewYear}` : s
  return <Chip tone={tone}>International: {text}</Chip>
}

// ── Stamps: international results ──
export function Stamp({ s, i = 0, animate }) {
  const ink = INKS[hash(s.country) % INKS.length]
  const rot = ((hash(s.id + s.event) % 15) - 7)
  const shape = hash(s.cc) % 3
  const medal = MEDAL[s.medal]?.label?.toUpperCase()
  const head = (medal || s.result.split(',')[0]).toUpperCase()
  const ev = s.result.includes(',') ? s.result.split(',').slice(1).join(',').trim() : s.event
  const date = fmtDate(s.date, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const common = { fill: 'none', stroke: ink, strokeWidth: 2.2 }
  return (
    <figure className={`relative ${animate ? 'inkstamp' : ''}`} style={{ '--r': `${rot}deg`, transform: `rotate(${rot}deg)`, animationDelay: `${i * 90}ms` }}>
      <svg viewBox="0 0 200 200" className="w-full h-auto" role="img" aria-label={`${s.result}, ${s.event}, ${s.city}, ${s.country}, ${date}`} style={{ mixBlendMode: 'multiply', opacity: 0.88 }}>
        <defs>
          <path id={`top-${s.id}`} d="M 30 100 A 70 70 0 0 1 170 100" />
          <path id={`bot-${s.id}`} d="M 36 104 A 64 64 0 0 0 164 104" />
        </defs>
        {shape === 0 && <><circle cx="100" cy="100" r="92" {...common} /><circle cx="100" cy="100" r="84" {...common} strokeWidth="1.2" /></>}
        {shape === 1 && <><rect x="10" y="22" width="180" height="156" rx="16" {...common} /><rect x="17" y="29" width="166" height="142" rx="11" {...common} strokeWidth="1.2" /></>}
        {shape === 2 && <><polygon points="60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60" {...common} /><polygon points="63,18 137,18 182,63 182,137 137,182 63,182 18,137 18,63" {...common} strokeWidth="1.2" /></>}
        {shape === 0 ? (
          <>
            <text fill={ink} fontSize="15" fontWeight="800" letterSpacing="2" style={{ fontVariationSettings: '"wdth" 110' }}><textPath href={`#top-${s.id}`} startOffset="50%" textAnchor="middle">{s.country.toUpperCase()}</textPath></text>
            <text fill={ink} fontSize="12" fontWeight="700" letterSpacing="1.5"><textPath href={`#bot-${s.id}`} startOffset="50%" textAnchor="middle">{date}</textPath></text>
          </>
        ) : (
          <>
            <text x="100" y={shape === 1 ? 52 : 48} textAnchor="middle" fill={ink} fontSize="15" fontWeight="800" letterSpacing="2" style={{ fontVariationSettings: '"wdth" 110' }}>{s.country.toUpperCase()}</text>
            <text x="100" y={shape === 1 ? 162 : 165} textAnchor="middle" fill={ink} fontSize="12" fontWeight="700" letterSpacing="1.5">{date}</text>
          </>
        )}
        <text x="100" y="92" textAnchor="middle" fill={ink} fontSize={head.length > 10 ? 17 : 24} fontWeight="900" style={{ fontVariationSettings: '"wdth" 118' }}>{head.slice(0, 16)}</text>
        <text x="100" y="114" textAnchor="middle" fill={ink} fontSize="11" fontWeight="700">{ev.slice(0, 28)}</text>
        <text x="100" y="132" textAnchor="middle" fill={ink} fontSize="11" fontWeight="600">{s.city.toUpperCase()}{s.mark ? `  ${s.mark}` : ''}</text>
      </svg>
      <figcaption className="sr-only">{s.event}</figcaption>
    </figure>
  )
}

export function StampsPage({ a }) {
  const stamps = a.stamps || []
  return (
    <div className="leaf rounded-xl border border-line p-4 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3 className="display-tight text-lg">International stamps</h3>
        <span className="text-sm text-ink-3">{stamps.length} competition{stamps.length === 1 ? '' : 's'} abroad or international</span>
      </div>
      {stamps.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {stamps.map((s, i) => (
            <div key={s.id}>
              <Stamp s={s} i={i} animate />
              <div className="mt-2 text-xs text-ink-2 text-center leading-snug">{s.event}<br /><span className="text-ink-3">{s.verifiedBy ? `Verified by ${orgShort(s.verifiedBy)}` : 'Self-reported'}</span></div>
            </div>
          ))}
        </div>
      ) : <Empty>No international competitions yet. The first stamp lands here when a federation publishes an international entry or result.</Empty>}
    </div>
  )
}

export function ResultsLedger({ a, limit }) {
  const results = (a.results || []).slice(0, limit || 999)
  const byLevel = LEVELS.map(l => [l, results.filter(r => r.level === l)]).filter(([, rs]) => rs.length)
  return (
    <div className="space-y-5">
      {byLevel.map(([level, rs]) => (
        <section key={level}>
          <div className="text-xs font-semibold text-ink-3 mb-2">{level}</div>
          <ul className="divide-y divide-line rounded-xl border border-line bg-white">
            {rs.map(r => (
              <li key={r.id} className={`flex items-start gap-3 p-3 ${r.fresh || r.justVerified ? 'flash-ok' : ''}`}>
                <MedalDisc medal={r.medal} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug">{r.result}{r.mark ? <span className="tabular text-deep">, {r.mark}</span> : ''}</div>
                  <div className="text-sm text-ink-2">{r.event}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2"><span className="text-xs text-ink-3">{fmtDate(r.date)}</span><SourceTag r={r} /></div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {byLevel.length === 0 && <Empty>No results yet.</Empty>}
    </div>
  )
}

export function MedalTally({ a }) {
  const rs = allResults(a)
  return (
    <div className="flex gap-4">
      {['gold', 'silver', 'bronze'].map(m => (
        <span key={m} className="flex items-center gap-1.5"><MedalDisc medal={m} size={22} /><span className="font-bold tabular text-lg">{rs.filter(r => r.medal === m).length}</span></span>
      ))}
    </div>
  )
}

export function BestsPage({ a }) {
  return (
    <div className="space-y-3">
      {(a.bests || []).map(b => (
        <div key={b.event} className="rounded-xl border border-line bg-white p-4 flex flex-wrap items-center gap-4">
          <div className="min-w-[140px]"><div className="text-xs text-ink-3">{b.event}</div><div className="display text-3xl tabular">{b.mark}</div><div className="text-xs text-ink-3">{b.date}</div></div>
          {b.standard ? (
            <div className={`flex-1 min-w-[200px] rounded-lg p-3 ${b.standard.met ? 'bg-grass-soft' : 'bg-amber-soft'}`}>
              <div className="text-xs font-semibold text-ink-2 flex items-center gap-1"><Target className="size-3.5" />{b.standard.name}</div>
              <div className="flex items-baseline gap-2 mt-1"><span className="tabular font-bold">{b.standard.mark}</span>
                <span className={`text-sm font-semibold ${b.standard.met ? 'text-grass' : 'text-amber'}`}>{b.standard.met ? 'Standard met' : b.standard.gap}</span></div>
            </div>
          ) : <div className="text-sm text-ink-3">No qualifying standard tracked</div>}
        </div>
      ))}
      {(a.rankings || []).length > 0 && (
        <div className="rounded-xl border border-line bg-white divide-y divide-line">
          {a.rankings.map(r => <div key={r.list + r.event} className="flex justify-between gap-3 p-3 text-sm"><span className="text-ink-2">{r.list}, {r.event}</span><span className="display-tight tabular">#{r.rank}</span></div>)}
        </div>
      )}
      {!(a.bests || []).length && !(a.rankings || []).length && <Empty>No personal bests or rankings yet.</Empty>}
    </div>
  )
}

export function CertificatesPage({ a, owner }) {
  return (
    <div>
      <p className="text-sm text-ink-2 mb-3 max-w-[70ch]">Government sports-quota jobs and admissions ask for certificates in set formats: Form 1 for representing India (issued by the national federation), Form 2 for representing a state at nationals (state association), Form 3 for university and Form 4 for school competitions. They live here, issued digitally by the body that signs them.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {(a.certificates || []).map(c => (
          <div key={c.id} className="rounded-xl border border-line bg-white p-4 flex gap-3">
            <FileBadge2 className="size-8 text-deep shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{c.form}<span className="text-ink-3 font-normal">, {c.level}</span></div>
              <div className="text-sm text-ink-2">{c.forEvent}</div>
              <div className="text-xs text-ink-3 mt-1">Issued by {ORGS[c.issuer]?.name || c.issuer}</div>
            </div>
            {owner && <button className="self-start size-9 rounded-full hover:bg-paper inline-flex items-center justify-center" aria-label={`Download ${c.form}`}><Download className="size-4" /></button>}
          </div>
        ))}
      </div>
      {!(a.certificates || []).length && <Empty>No certificates yet. Federations can issue them when they publish results.</Empty>}
    </div>
  )
}

export function TeamPage({ a, byId }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="rounded-xl border border-line bg-white p-4">
        <h3 className="font-semibold mb-3">Team</h3>
        <ul className="space-y-3">
          {(a.team || []).map(([pid, role]) => byId[pid] && (
            <li key={pid} className="flex items-center gap-3"><Avatar person={byId[pid]} size={38} />
              <span><Link to={`/team/${pid}`} className="font-semibold hover:underline">{byId[pid].name}</Link><span className="block text-xs text-ink-3">{role}</span></span></li>
          ))}
          {!(a.team || []).length && <li className="text-sm text-ink-3">No coach or support staff linked</li>}
        </ul>
      </section>
      <section className="rounded-xl border border-line bg-white p-4">
        <h3 className="font-semibold mb-3">Backing and schemes</h3>
        <ul className="space-y-3">
          {(a.backing || []).map(b => (
            <li key={b.orgId + b.programme} className="flex items-center gap-3"><OrgMark id={b.orgId} size={38} />
              <span><span className="font-semibold">{ORGS[b.orgId]?.name}</span><span className="block text-xs text-ink-3">{b.programme}, since {fmtDate(b.since + '-01', { month: 'short', year: 'numeric' })}</span></span></li>
          ))}
          {(a.schemes || []).map(sc => <li key={sc} className="flex items-center gap-3"><OrgMark id="khelo" size={38} /><span className="font-semibold">{sc}</span></li>)}
          {!(a.backing || []).length && !(a.schemes || []).length && <li className="text-sm text-ink-3">Not backed by a foundation or scheme yet</li>}
        </ul>
      </section>
    </div>
  )
}

export function SeasonPage({ a }) {
  const s = a.season
  if (!s) return <Empty>No season plan yet.</Empty>
  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="text-xs text-ink-3">{s.label}</div>
      <div className="display-tight text-xl mt-0.5">{s.goal}</div>
      <div className="flex items-baseline gap-2 mt-4"><span className="display text-3xl tabular">{inr(s.total - s.secured)}</span><span className="text-ink-2">still needed of {inr(s.total)}</span></div>
      <div className="mt-2"><Progress value={s.secured} goal={s.total} /></div>
      <ul className="mt-4 divide-y divide-line">
        {s.items.map(([label, amt, note, secured]) => (
          <li key={label} className="py-2.5 flex items-start gap-3 text-sm">
            {secured >= amt ? <CheckCircle2 className="size-5 text-grass shrink-0" /> : <CircleDashed className="size-5 text-ink-3 shrink-0" />}
            <span className="flex-1">{label}{note && <span className="block text-xs text-ink-3">{note}</span>}</span>
            <span className="tabular font-semibold">{inr(amt)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function NextUp({ a }) {
  if (!a.next?.length) return null
  return (
    <ol className="grid sm:grid-cols-3 gap-3">
      {a.next.map((n) => (
        <li key={n.event} className="rounded-xl border border-line bg-white p-3">
          <div className="text-xs font-semibold text-rope">{fmtDate(n.date, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="font-semibold leading-snug mt-0.5">{n.event}</div>
          <div className="mt-2"><Chip tone={n.status === 'Qualified' ? 'grass' : n.status === 'Needs funding' ? 'rope' : 'teal'}>{n.status}</Chip></div>
        </li>
      ))}
    </ol>
  )
}
