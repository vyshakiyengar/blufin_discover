import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, HelpCircle, Paperclip, Video, UserCheck } from 'lucide-react'
import { useStore, fmtDate, daysLeft } from '../store'
import { ORGS } from '../data/orgs'
import { callFit } from '../lib/eligibility'
import { Chip, Modal, OrgMark, Btn } from './ui'

export const MODE_LABEL = { open: 'Open call', nomination: 'Coach nomination', rolling: 'Rolling requests' }

export function CallCard({ call, athlete }) {
  const { applications } = useStore()
  const fit = athlete ? callFit(call, athlete) : null
  const applied = athlete && applications[call.id]?.[athlete.id]
  const d = daysLeft(call.closes)
  return (
    <Link to={`/opportunities/${call.id}`} className="block rounded-xl border border-line bg-white hover:border-deep p-4 sm:p-5 transition-colors">
      <div className="flex gap-3">
        <OrgMark id={call.orgId} size={44} />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-ink-3">{ORGS[call.orgId]?.name}</div>
          <div className="display-tight text-lg leading-snug">{call.title}</div>
          <p className="text-sm text-ink-2 mt-1 max-w-[62ch]">{call.pitch}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone="outline">{MODE_LABEL[call.mode]}</Chip>
            <Chip tone={d <= 21 ? 'rope' : 'default'}>Closes {fmtDate(call.closes, { day: 'numeric', month: 'short' })}, {d} days</Chip>
            {fit && (applied ? <Chip tone="dark">Applied: {applied.stage}</Chip> : fit.eligible ? <Chip tone="grass">You meet {fit.met} of {fit.total}</Chip> : <Chip tone="amber">You meet {fit.met} of {fit.total}</Chip>)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ApplyModal({ call, athlete, onClose }) {
  const { apply, byId } = useStore()
  const coach = athlete.team?.find(([, r]) => /coach/i.test(r))
  const [coachAsk, setCoachAsk] = useState(!!coach)
  const [video, setVideo] = useState(false)
  return (
    <Modal title={`Apply: ${call.title}`} onClose={onClose}>
      <p className="text-sm text-ink-2">{ORGS[call.orgId]?.name} will see your Sports Passport. Results marked verified carry the most weight with the panel.</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        <li className="flex gap-2"><CheckCircle2 className="size-5 text-grass shrink-0" />Sports Passport: IDs, classification, {athlete.results.length + athlete.stamps.length} results, certificates</li>
        <li className="flex gap-2">{athlete.season ? <CheckCircle2 className="size-5 text-grass shrink-0" /> : <XCircle className="size-5 text-rope shrink-0" />}Season budget{athlete.season ? ` (${athlete.season.items.length} items)` : ': add one on your passport'}</li>
        {coach && <li><label className="flex gap-2 items-center"><input type="checkbox" checked={coachAsk} onChange={e => setCoachAsk(e.target.checked)} className="size-4 accent-[#0E3B43]" /><UserCheck className="size-5 text-deep" />Ask {byId[coach[0]]?.name} to endorse</label></li>}
        <li><label className="flex gap-2 items-center"><input type="checkbox" checked={video} onChange={e => setVideo(e.target.checked)} className="size-4 accent-[#0E3B43]" /><Video className="size-5 text-deep" />Attach training video <span className="text-ink-3">(training-set.mp4)</span></label></li>
      </ul>
      <div className="mt-3 text-xs text-ink-3">Demo only: nothing leaves your browser.</div>
      <div className="flex justify-end gap-2 mt-5">
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => { apply(call.id, athlete.id, { coach: coachAsk, video }); onClose() }}>Send application</Btn>
      </div>
    </Modal>
  )
}

export function CriteriaList({ call, athlete }) {
  const fit = athlete ? callFit(call, athlete) : null
  const rows = fit ? fit.checks : call.criteria.map(c => ({ label: c.label }))
  return (
    <ul className="space-y-2.5">
      {rows.map(r => (
        <li key={r.label} className="flex gap-2 text-sm">
          {r.ok === true ? <CheckCircle2 className="size-5 text-grass shrink-0" /> : r.ok === false ? <XCircle className="size-5 text-rope shrink-0" /> : <HelpCircle className="size-5 text-ink-3 shrink-0" />}
          <span>{r.label}{r.detail && <span className={`block text-xs ${r.ok === false ? 'text-rope font-semibold' : 'text-ink-3'}`}>{r.detail}</span>}</span>
        </li>
      ))}
    </ul>
  )
}

export function AsksList({ call }) {
  return (
    <ul className="space-y-2.5">
      {call.asks.map(a => (
        <li key={a.key} className="flex gap-2 text-sm"><Paperclip className="size-5 text-pool shrink-0" /><span>{a.label}{a.auto && <span className="block text-xs text-grass font-semibold">Filled from your passport</span>}</span></li>
      ))}
    </ul>
  )
}
