import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useStore, fmtDate, daysLeft } from '../../store'
import { ORGS } from '../../data/orgs'
import { STAGES } from '../../data/calls'
import { callFit, circularFit } from '../../lib/eligibility'
import { CallCard, ApplyModal, CriteriaList, AsksList, MODE_LABEL } from '../../components/Call'
import { CircularRow, CircularModal } from '../../components/Circular'
import { OrgMark, Chip, Btn } from '../../components/ui'

export function OpportunitiesList() {
  const { me, calls, circulars, markRead } = useStore()
  const [open, setOpen] = useState(null)
  const sorted = [...calls].sort((a, b) => (callFit(b, me)?.eligible ? 1 : 0) - (callFit(a, me)?.eligible ? 1 : 0))
  const entries = circulars.filter(c => c.action && ['entry', 'register'].includes(c.action.kind) && (!me || circularFit(c, me)?.forYou))
  return (
    <div className="max-w-[900px] mx-auto px-4 py-6 space-y-10">
      <header>
        <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Opportunities</h1>
        <p className="text-ink-2 mt-1 max-w-[62ch]">Funding from foundations, and entries and trials from federations. {me ? 'Each one is checked against your passport.' : ''}</p>
      </header>
      <section>
        <h2 className="display-tight text-lg mb-3">Funding and programmes</h2>
        <div className="space-y-3">{sorted.map(c => <CallCard key={c.id} call={c} athlete={me} />)}</div>
      </section>
      <section>
        <h2 className="display-tight text-lg mb-3">Entries and trials{me ? ' you can enter' : ''}</h2>
        <div className="space-y-2">{entries.map(c => <CircularRow key={c.id} c={c} athlete={me} onOpen={() => { setOpen(c); markRead(c.id) }} />)}</div>
      </section>
      {open && <CircularModal c={open} athlete={me} onClose={() => setOpen(null)} />}
    </div>
  )
}

export function CallDetail() {
  const { id } = useParams()
  const { calls, me, applications } = useStore()
  const [applying, setApplying] = useState(false)
  const call = calls.find(c => c.id === id)
  if (!call) return <div className="p-10 text-center">Not found</div>
  const fit = me ? callFit(call, me) : null
  const app = me && applications[call.id]?.[me.id]
  const d = daysLeft(call.closes)
  const stageIdx = app ? STAGES.indexOf(app.stage) : -1

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6 space-y-5">
      <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-2 hover:text-ink"><ArrowLeft className="size-4" />Opportunities</Link>
      <div className="card overflow-hidden">
        <div className="lane-rope" />
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3"><OrgMark id={call.orgId} size={48} /><div><div className="font-bold">{ORGS[call.orgId].name}</div><div className="text-xs text-ink-3">{MODE_LABEL[call.mode]}</div></div></div>
          <h1 className="display text-[clamp(1.7rem,3.6vw,2.4rem)] mt-4">{call.title}</h1>
          <p className="text-[17px] text-ink-2 mt-2 max-w-[62ch]">{call.pitch}</p>
          <dl className="mt-5 grid sm:grid-cols-3 gap-2">
            {call.support.map(([k, v]) => <div key={k} className="rounded-lg bg-paper p-3"><dt className="text-xs text-ink-3">{k}</dt><dd className="font-semibold leading-snug">{v}</dd></div>)}
          </dl>
          <ol className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li><span className="text-ink-3">Opened</span> <b>{fmtDate(call.opens, { day: 'numeric', month: 'short' })}</b></li>
            <li><span className="text-ink-3">Closes</span> <b className={d <= 21 ? 'text-rope' : ''}>{fmtDate(call.closes, { day: 'numeric', month: 'short' })} ({d} days)</b></li>
            <li><span className="text-ink-3">Decision</span> <b>{call.decision.includes('-') ? fmtDate(call.decision, { day: 'numeric', month: 'short', year: 'numeric' }) : call.decision}</b></li>
            {call.seats && <li><span className="text-ink-3">Places</span> <b>{call.seats}</b></li>}
          </ol>

          <div className="mt-6">
            {!me ? <Link to="/" className="h-11 px-5 rounded-full bg-deep text-white font-semibold inline-flex items-center">Sign in as an athlete to apply</Link>
              : app ? (
                <div>
                  <div className="text-sm font-semibold mb-2">Your application</div>
                  <ol className="flex flex-wrap gap-1.5">
                    {STAGES.map((st, i) => <li key={st}><Chip tone={i < stageIdx ? 'grass' : i === stageIdx ? 'dark' : 'outline'}>{i < stageIdx && <Check className="size-3.5" />}{st}</Chip></li>)}
                  </ol>
                  <p className="text-sm text-ink-3 mt-2">Sent {fmtDate(app.at)}. You'll be told here when it moves.</p>
                </div>
              ) : call.mode === 'nomination' ? (
                <Btn disabled={!fit.eligible} onClick={() => setApplying(true)}>Ask my coach to nominate me</Btn>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Btn disabled={!fit.eligible} onClick={() => setApplying(true)}>Apply with my passport</Btn>
                  {!fit.eligible && <span className="text-sm text-rope font-semibold">You don't meet every criterion yet.</span>}
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card p-5"><h2 className="display-tight text-lg mb-3">{me ? 'Criteria, checked for you' : 'Criteria'}</h2><CriteriaList call={call} athlete={me} /></section>
        <section className="card p-5"><h2 className="display-tight text-lg mb-3">What the panel sees</h2><AsksList call={call} />
          {call.panel && <><div className="text-sm font-semibold mt-5 mb-1">Selection panel</div><ul className="text-sm text-ink-2 space-y-0.5">{call.panel.map(p => <li key={p}>{p}</li>)}</ul></>}
        </section>
      </div>
      {applying && me && <ApplyModal call={call} athlete={me} onClose={() => setApplying(false)} />}
    </div>
  )
}
