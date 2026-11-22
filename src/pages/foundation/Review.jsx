import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Star } from 'lucide-react'
import { useStore, fmtDate, inr } from '../../store'
import { STAGES } from '../../data/calls'
import { evidence, callFit } from '../../lib/eligibility'
import { Avatar, Chip, Btn, Modal } from '../../components/ui'
import { IdentityPage, ResultsLedger, ClassStatus } from '../../components/Passport'

function EvidenceChips({ a, app, compact }) {
  return (
    <div className="flex flex-wrap gap-1">
      {evidence(a, app).filter(e => !compact || !e.label.startsWith('Class status')).map(e => (
        <span key={e.label} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${e.warn ? 'bg-amber-soft text-amber' : e.ok ? 'bg-grass-soft text-grass' : 'bg-paper text-ink-3'}`}>
          {e.warn ? <AlertTriangle className="size-3" /> : e.ok ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}{e.label}
        </span>
      ))}
    </div>
  )
}

function ApplicantDrawer({ a, app, call, onClose }) {
  const { moveStage } = useStore()
  const idx = STAGES.indexOf(app.stage)
  const fit = callFit(call, a)
  return (
    <Modal title={`${a.name}: ${app.stage}`} onClose={onClose} wide>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {STAGES.map((st, i) => <Chip key={st} tone={i < idx ? 'grass' : i === idx ? 'dark' : 'outline'}>{st}</Chip>)}
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {idx < STAGES.length - 1 && <Btn onClick={() => { moveStage(call.id, a.id, STAGES[idx + 1]); onClose() }}>Move to {STAGES[idx + 1]}<ArrowRight className="size-4" /></Btn>}
        {app.stage !== 'Selected' && <Btn kind="go" onClick={() => { moveStage(call.id, a.id, 'Selected'); onClose() }}>Select</Btn>}
        <Btn kind="danger" onClick={() => { moveStage(call.id, a.id, 'Not selected'); onClose() }}>Decline with feedback</Btn>
      </div>
      <IdentityPage a={a} compact />
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <section className="rounded-xl border border-line p-4">
          <h3 className="font-semibold mb-2">Criteria</h3>
          <ul className="space-y-1.5 text-sm">{fit.checks.map(c => <li key={c.label} className="flex gap-2">{c.ok ? <CheckCircle2 className="size-4 text-grass shrink-0 mt-0.5" /> : <XCircle className="size-4 text-rope shrink-0 mt-0.5" />}<span>{c.label}<span className="block text-xs text-ink-3">{c.detail}</span></span></li>)}</ul>
        </section>
        <section className="rounded-xl border border-line p-4">
          <h3 className="font-semibold mb-2">Application</h3>
          <EvidenceChips a={a} app={app} />
          {a.season && <div className="mt-3 text-sm"><span className="text-ink-3">Season budget:</span> <b>{inr(a.season.total)}</b>, {inr(a.season.secured)} secured<div className="text-xs text-ink-3">{a.season.goal}</div></div>}
          {app.score && <div className="mt-3 text-sm"><span className="text-ink-3">Panel scores so far:</span> <b className="tabular">{app.score.join(', ')}</b> out of 5</div>}
          <div className="text-xs text-ink-3 mt-3">Applied {fmtDate(app.at)}</div>
        </section>
      </div>
      <section className="mt-4"><h3 className="font-semibold mb-2">Results</h3><ResultsLedger a={a} limit={5} /></section>
      <Link to={`/p/${a.id}`} className="inline-block mt-4 text-sm font-semibold text-pool hover:underline">Open full passport</Link>
    </Modal>
  )
}

export default function Review() {
  const { calls, applications, byId, session, done } = useStore()
  const [params, setParams] = useSearchParams()
  const mine = calls.filter(c => c.orgId === session.id && c.mode === 'open')
  const call = mine.find(c => c.id === params.get('call')) || mine.find(c => c.id === 'blufin-psa-2027') || mine[0]
  const [open, setOpen] = useState(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  useEffect(() => { done('fd-review') }, []) // eslint-disable-line react-hooks/exhaustive-deps
  if (!call) return <div className="p-10 text-center">No open calls yet. <Link to="/f/calls" className="text-pool font-semibold">Create one</Link></div>
  const apps = Object.values(applications[call.id] || {}).filter(x => byId[x.athleteId])
  const columns = [...STAGES, 'Not selected']

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <select className="text-sm font-semibold text-ink-2 bg-transparent" value={call.id} onChange={e => setParams({ call: e.target.value })} aria-label="Choose call">{mine.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
          <h1 className="display text-[clamp(1.6rem,3vw,2.2rem)]">Review applicants</h1>
          <p className="text-ink-2 mt-1 max-w-[70ch]">Every applicant already meets your criteria. Cards show what is verified at the source and what is not, so the panel spends its time on judgement, not paperwork.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="size-4 accent-[#0E3B43]" />Age verified only</label>
      </div>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-4 snap-x">
        {columns.map(st => {
          const list = apps.filter(x => x.stage === st && (!verifiedOnly || byId[x.athleteId].dobVerified))
          if (st === 'Not selected' && !list.length) return null
          return (
            <section key={st} className="w-[272px] shrink-0 snap-start rounded-2xl bg-white/60 border border-line p-2.5">
              <div className="flex items-center justify-between px-1.5 py-1"><h2 className="font-semibold text-sm">{st}</h2><span className="text-xs font-bold tabular text-ink-3">{list.length}</span></div>
              <div className="space-y-2 mt-1">
                {list.map(app => {
                  const a = byId[app.athleteId]
                  const fresh = app.at === '2026-11-22'
                  return (
                    <button key={a.id} onClick={() => setOpen(app)} className={`w-full text-left rounded-xl bg-white border p-3 hover:border-deep ${fresh ? 'border-deep ring-2 ring-pool/30' : 'border-line'}`}>
                      <div className="flex items-center gap-2.5"><Avatar person={a} size={34} /><div className="min-w-0"><div className="font-semibold leading-tight flex items-center gap-1">{a.name}{fresh && <Star className="size-3.5 text-gold" fill="currentColor" aria-label="New today" />}</div><div className="text-xs text-ink-3">{a.classification?.cls}, {a.state}, age {a.age}</div></div></div>
                      {a.classification && <div className="mt-2"><ClassStatus cls={a.classification} /></div>}
                      <div className="mt-2"><EvidenceChips a={a} app={app} compact /></div>
                    </button>
                  )
                })}
                {!list.length && <div className="text-xs text-ink-3 px-2 py-3">Nobody here yet</div>}
              </div>
            </section>
          )
        })}
      </div>
      {open && <ApplicantDrawer a={byId[open.athleteId]} app={open} call={call} onClose={() => setOpen(null)} />}
    </div>
  )
}
