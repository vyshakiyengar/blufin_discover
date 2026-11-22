import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { useStore, fmtDate, daysLeft } from '../../store'
import { STAGES } from '../../data/calls'
import { callFit } from '../../lib/eligibility'
import { MODE_LABEL } from '../../components/Call'
import { Btn, Chip, Modal, Field, inputCls } from '../../components/ui'

const CRITERIA_LIB = [
  { key: 'sport', label: 'Sport', make: (v) => ({ label: `${v} athlete with a national sport class`, test: 'paraSport', arg: v }) },
  { key: 'medal', label: 'National medal since 2025', make: () => ({ label: 'National medal in 2025 or 2026', test: 'medalSince', arg: { level: 'National', year: 2025 } }) },
  { key: 'intl', label: 'International result or top-3 ranking', make: () => ({ label: 'International result or top-3 national ranking', test: 'intlOrTop3' }) },
  { key: 'dob', label: 'Date of birth verified', make: () => ({ label: 'Date of birth verified by a federation', test: 'dobVerified' }) },
  { key: 'notbacked', label: 'Not already backed by us', make: (_, org) => ({ label: 'Not currently supported by us', test: 'notBackedBy', arg: org }) },
]

function CallBuilder({ onClose }) {
  const { athletes, publishCall, session } = useStore()
  const [f, setF] = useState({ title: 'Para Swim Development Squad 2027', pitch: 'Six months of coaching and pool time for juniors new to para swimming.', grant: 'Up to ₹1,50,000 per athlete', seats: 8, closes: '2027-01-15', sport: 'Para Swimming', on: ['sport', 'dob', 'notbacked'], ageLo: 12, ageHi: 20 })
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }))
  const toggle = (k) => setF(x => ({ ...x, on: x.on.includes(k) ? x.on.filter(i => i !== k) : [...x.on, k] }))
  const criteria = useMemo(() => [
    ...CRITERIA_LIB.filter(c => f.on.includes(c.key)).map(c => c.make(f.sport, session.id)),
    { label: `Aged ${f.ageLo} to ${f.ageHi}`, test: 'ageRange', arg: [Number(f.ageLo), Number(f.ageHi)] },
  ], [f, session.id])
  const call = { orgId: session.id, mode: 'open', title: f.title, pitch: f.pitch, support: [['Grant', f.grant]], seats: Number(f.seats), opens: '2026-11-22', closes: f.closes, decision: 'Rolling', criteria, asks: [{ key: 'passport', label: 'Sports Passport', auto: true }, { key: 'coach', label: 'Coach endorsement', auto: false }] }
  const eligible = athletes.filter(a => callFit(call, a)?.eligible)
  return (
    <Modal title="New call" onClose={onClose} wide>
      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-4">
          <Field label="Title"><input className={inputCls} value={f.title} onChange={set('title')} /></Field>
          <Field label="One-line description"><input className={inputCls} value={f.pitch} onChange={set('pitch')} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Support"><input className={inputCls} value={f.grant} onChange={set('grant')} /></Field>
            <Field label="Places"><input type="number" className={inputCls} value={f.seats} onChange={set('seats')} /></Field>
            <Field label="Closes"><input type="date" className={inputCls} value={f.closes} onChange={set('closes')} /></Field>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Who can apply</div>
            <p className="text-xs text-ink-3 mb-2">Each criterion is checked automatically against passports. Athletes who don't qualify never see the call, and you never read their forms.</p>
            <div className="space-y-2">
              {CRITERIA_LIB.map(c => (
                <label key={c.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={f.on.includes(c.key)} onChange={() => toggle(c.key)} className="size-4 accent-[#0E3B43]" />
                  {c.key === 'sport' ? <span className="flex items-center gap-2">Sport: <select className="h-8 rounded border border-line px-2" value={f.sport} onChange={set('sport')}>{['Para Swimming', 'Para Badminton', 'Para Athletics'].map(s => <option key={s}>{s}</option>)}</select></span> : c.label}
                </label>
              ))}
              <div className="flex items-center gap-2 text-sm">Age from <input type="number" className="h-8 w-16 rounded border border-line px-2" value={f.ageLo} onChange={set('ageLo')} /> to <input type="number" className="h-8 w-16 rounded border border-line px-2" value={f.ageHi} onChange={set('ageHi')} /></div>
            </div>
          </div>
        </div>
        <aside className="rounded-xl bg-pool-soft p-4 self-start">
          <Users className="size-6 text-deep" />
          <div className="display text-4xl tabular mt-2 text-deep">{eligible.length}</div>
          <div className="text-sm text-ink-2">athletes on Blufin Discover qualify right now</div>
          <ul className="mt-3 space-y-1 text-sm">{eligible.slice(0, 6).map(a => <li key={a.id}>{a.name}<span className="text-ink-3">, {a.classification?.cls || a.sport}, {a.state}</span></li>)}</ul>
          {eligible.length > 6 && <div className="text-xs text-ink-3 mt-1">and {eligible.length - 6} more</div>}
        </aside>
      </div>
      <div className="flex justify-end gap-2 mt-6"><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={() => { publishCall(call); onClose() }}>Publish call</Btn></div>
    </Modal>
  )
}

export default function FoundationCalls() {
  const { calls, applications, session } = useStore()
  const [building, setBuilding] = useState(false)
  const mine = calls.filter(c => c.orgId === session.id)
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Calls</h1><p className="text-ink-2 mt-1 max-w-[60ch]">Open calls, nominations and rolling requests. Criteria are checked against passports, so every applicant already qualifies.</p></div>
        <Btn onClick={() => setBuilding(true)}><Plus className="size-4" />New call</Btn>
      </div>
      <div className="mt-6 space-y-3">
        {mine.map(c => {
          const apps = Object.values(applications[c.id] || {})
          const d = daysLeft(c.closes)
          return (
            <div key={c.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><div className="flex gap-2 mb-1"><Chip tone="outline">{MODE_LABEL[c.mode]}</Chip><Chip tone={d <= 21 ? 'rope' : 'default'}>Closes {fmtDate(c.closes, { day: 'numeric', month: 'short' })}</Chip></div><div className="display-tight text-xl">{c.title}</div><div className="text-sm text-ink-2">{c.pitch}</div></div>
                <Link to={`/f/review?call=${c.id}`} className="h-10 px-4 rounded-full bg-deep text-white text-sm font-semibold inline-flex items-center">Review {apps.length} applicant{apps.length === 1 ? '' : 's'}</Link>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-1.5 text-center">
                {STAGES.map(st => <div key={st} className="rounded-lg bg-paper py-2"><div className="display text-xl tabular">{apps.filter(a => a.stage === st).length}</div><div className="text-[11px] text-ink-3">{st}</div></div>)}
              </div>
            </div>
          )
        })}
      </div>
      {building && <CallBuilder onClose={() => setBuilding(false)} />}
    </div>
  )
}
