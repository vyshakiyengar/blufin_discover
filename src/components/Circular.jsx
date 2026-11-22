import { CheckCircle2, XCircle, HelpCircle, Paperclip, Users } from 'lucide-react'
import { useStore, fmtDate } from '../store'
import { ORGS } from '../data/orgs'
import { CIRCULAR_TYPES } from '../data/circulars'
import { circularFit } from '../lib/eligibility'
import { Chip, Modal, OrgMark, Btn } from './ui'

export function audienceText(aud = {}) {
  const parts = []
  parts.push(aud.sports ? aud.sports.join(' and ') : 'All sports')
  if (aud.para === true) parts.push('para athletes only')
  if (aud.gender) parts.push(aud.gender === 'F' ? 'women and girls' : 'men and boys')
  if (aud.ages) parts.push(aud.ages[1] >= 99 ? `aged ${aud.ages[0]} and over` : `aged ${aud.ages[0]} to ${aud.ages[1]}`)
  if (aud.groups?.length) parts.push(aud.groups.join(', '))
  parts.push(aud.states ? aud.states.join(', ') : 'all states')
  return parts.join(', ')
}

export const reachOf = (aud, athletes) => athletes.filter(a => circularFit({ audience: aud, requirements: [] }, a)?.forYou)

const TYPE_TONE = { championship: 'teal', selection: 'grass', registration: 'amber', trials: 'teal', results: 'default', rules: 'rope', change: 'amber' }

export function CircularRow({ c, onOpen, athlete }) {
  const { read, actions } = useStore()
  const fit = athlete ? circularFit(c, athlete) : null
  const unread = athlete && !read.includes(c.id)
  const acted = athlete && actions[`${c.id}:${athlete.id}`]
  const selected = athlete && c.selected?.includes(athlete.id)
  return (
    <button onClick={onOpen} className="w-full text-left rounded-xl border border-line bg-white hover:border-deep p-4 flex gap-3 transition-colors">
      <OrgMark id={c.orgId} size={40} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-ink-2">{ORGS[c.orgId]?.short}</span>
          <span className="text-ink-3">{c.ref}</span>
          <span className="text-ink-3">{fmtDate(c.date, { day: 'numeric', month: 'short' })}</span>
          {unread && <span className="size-2 rounded-full bg-rope" aria-label="Unread" />}
        </span>
        <span className="block font-semibold leading-snug mt-1">{c.title}</span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          <Chip tone={TYPE_TONE[c.type]}>{CIRCULAR_TYPES[c.type]}</Chip>
          {selected && <Chip tone="grass">You are selected</Chip>}
          {fit && fit.blocking.length > 0 && <Chip tone="rope">{fit.blocking.length} thing{fit.blocking.length > 1 ? 's' : ''} to fix</Chip>}
          {fit && fit.blocking.length === 0 && c.action && !acted && <Chip tone="grass">You're eligible</Chip>}
          {acted && <Chip tone="dark">Done</Chip>}
        </span>
      </span>
    </button>
  )
}

export function CircularModal({ c, onClose, athlete }) {
  const { doAction, actions, byId, athletes } = useStore()
  const fit = athlete ? circularFit(c, athlete) : null
  const acted = athlete && actions[`${c.id}:${athlete.id}`]
  const reach = !athlete ? reachOf(c.audience, athletes) : null
  return (
    <Modal title={`${ORGS[c.orgId]?.short} circular`} onClose={onClose} wide>
      <article className="leaf rounded-xl border border-line p-5 sm:p-6">
        <header className="flex items-start gap-3 border-b border-line pb-4">
          <OrgMark id={c.orgId} size={48} />
          <div className="flex-1">
            <div className="font-bold">{ORGS[c.orgId]?.name}</div>
            <div className="text-sm text-ink-3">Ref. {c.ref}, dated {fmtDate(c.date)}</div>
          </div>
          <Chip tone={TYPE_TONE[c.type]}>{CIRCULAR_TYPES[c.type]}</Chip>
        </header>
        <div className="text-sm text-ink-3 mt-4">To: {audienceText(c.audience)}</div>
        <h3 className="display-tight text-xl mt-2">{c.title}</h3>
        <p className="text-ink-2 mt-2 leading-relaxed max-w-[68ch]">{c.summary}</p>
        {c.facts?.length > 0 && (
          <dl className="mt-4 grid sm:grid-cols-2 gap-2">
            {c.facts.map(([k, v]) => <div key={k} className="rounded-lg bg-white border border-line p-3"><dt className="text-xs text-ink-3">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
          </dl>
        )}
        {c.selected && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Selected athletes on Blufin Discover</div>
            <div className="flex flex-wrap gap-2">{c.selected.map(id => byId[id] && <Chip key={id} tone={athlete?.id === id ? 'grass' : 'outline'}>{byId[id].name}</Chip>)}<Chip>+ {64 - c.selected.length} more</Chip></div>
          </div>
        )}
        {c.requirements?.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-semibold mb-2">{fit ? 'Requirements, checked against your passport' : 'Requirements'}</div>
            <ul className="space-y-2">
              {(fit ? fit.checks : c.requirements.map(r => ({ label: r }))).map(r => (
                <li key={r.label} className="flex gap-2 text-sm">
                  {r.ok === true ? <CheckCircle2 className="size-5 text-grass shrink-0" /> : r.ok === false ? <XCircle className="size-5 text-rope shrink-0" /> : <HelpCircle className="size-5 text-ink-3 shrink-0" />}
                  <span>{r.label}{r.detail && <span className={`block text-xs ${r.ok === false ? 'text-rope font-semibold' : 'text-ink-3'}`}>{r.detail}</span>}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {c.attachments?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{c.attachments.map(x => <span key={x} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-sm"><Paperclip className="size-3.5" />{x}</span>)}</div>}
      </article>

      {athlete && c.action && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {acted ? <Chip tone="dark">{acted}</Chip> : (
            <Btn disabled={fit.blocking.length > 0} onClick={() => doAction(c.id, athlete.id, c.action.kind === 'entry' ? 'Entry request sent to your club' : c.action.kind === 'uid' ? 'UID valid for 2026-27' : c.action.kind === 'upload' ? 'Age proof sent for verification' : 'Registered. Confirmation sent.')}>{c.action.label}</Btn>
          )}
          {fit.blocking.length > 0 && <span className="text-sm text-rope font-semibold">Fix the items marked above before you can {c.action.label.toLowerCase()}.</span>}
        </div>
      )}
      {!athlete && reach && (
        <div className="mt-4 rounded-xl bg-pool-soft p-4 flex items-center gap-3"><Users className="size-6 text-deep" /><div><div className="font-semibold">Reached {reach.length} athletes on Blufin Discover</div><div className="text-sm text-ink-2">{reach.filter(a => a.minor).length} of them are under 18, so their parents or guardians were notified too.</div></div></div>
      )}
    </Modal>
  )
}
