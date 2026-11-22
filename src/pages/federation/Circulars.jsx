import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Users, AlertTriangle } from 'lucide-react'
import { useStore } from '../../store'
import { CIRCULAR_TYPES } from '../../data/circulars'
import { circularFit } from '../../lib/eligibility'
import { CircularRow, CircularModal, audienceText } from '../../components/Circular'
import { Btn, Modal, Field, inputCls, Chip } from '../../components/ui'

const PRESETS = {
  ksa: {
    sports: ['Swimming', 'Para Swimming'],
    groups: [['Group III (10 to 11)', [10, 11]], ['Group II (12 to 14)', [12, 14]], ['Group I (15 to 17)', [15, 17]], ['Senior (18 and over)', [18, 99]]],
    requirements: ['Valid SFI UID for 2026-27', 'Para events: national classification card', 'Registered with a KSA-affiliated club'],
    template: {
      type: 'championship', title: 'Karnataka State Para Swimming Championship 2027: entries open', sports: ['Para Swimming'], groups: ['Group I (15 to 17)', 'Senior (18 and over)'], para: true,
      summary: 'Selection event for the Karnataka para swimming team for the National Para Swimming Championships 2027. National classifiers will be on site.',
      facts: [['Dates', '9 to 10 Jan 2027'], ['Venue', 'LaneSix Aquatics, Bengaluru'], ['Entries close', '28 Dec 2026']],
      requirements: ['Valid SFI UID for 2026-27', 'Para events: national classification card'], action: { kind: 'entry', label: 'Enter through my club' },
    },
    states: ['Karnataka'],
  },
  bai: {
    sports: ['Badminton', 'Para Badminton'],
    groups: [['U-13', [8, 13]], ['U-15', [8, 15]], ['U-17', [8, 17]], ['U-19', [8, 19]], ['Senior', [17, 99]]],
    requirements: ['BAI Player ID', 'Age proof (birth certificate) in BAI format', 'BWF ID and sport class'],
    template: {
      type: 'championship', title: 'Yonex-Sunrise All India Sub-Junior Ranking Tournament (U-15, U-17), Bengaluru', sports: ['Badminton'], groups: ['U-15', 'U-17'], para: false,
      summary: 'Ranking tournament for U-15 and U-17 players. No entry will be accepted without a BAI Player ID and age proof in the BAI format.',
      facts: [['Main draw', '5 to 11 Jan 2027'], ['Venue', 'Padukone-Dravid Centre for Sports Excellence, Bengaluru'], ['Last date for entries', '20 Dec 2026']],
      requirements: ['BAI Player ID', 'Age proof (birth certificate) in BAI format'], action: { kind: 'entry', label: 'Enter with my BAI ID' },
    },
    states: null,
  },
}

function Composer({ onClose }) {
  const { session, athletes, publishCircular } = useStore()
  const preset = PRESETS[session.id]
  const [f, setF] = useState({ ...preset.template, facts: preset.template.facts.map(x => [...x]) })
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))
  const toggleIn = (k, v) => setF(x => ({ ...x, [k]: x[k].includes(v) ? x[k].filter(i => i !== v) : [...x[k], v] }))
  const ranges = preset.groups.filter(([g]) => f.groups.includes(g)).map(([, r]) => r)
  const audience = { sports: f.sports, states: preset.states || undefined, para: f.para ? true : undefined, ages: ranges.length ? [Math.min(...ranges.map(r => r[0])), Math.max(...ranges.map(r => r[1]))] : undefined, groups: f.groups }
  const circular = { orgId: session.id, ref: `${session.id.toUpperCase()}/${f.type === 'championship' ? 'T' : 'GEN'}/2026-27/${String(40 + (f.title.length % 50)).padStart(3, "0")}`, type: f.type, title: f.title, summary: f.summary, facts: f.facts, requirements: f.requirements, audience, action: f.action, attachments: ['Circular (PDF)'] }
  const reach = useMemo(() => athletes.map(a => ({ a, fit: circularFit(circular, a) })).filter(x => x.fit?.forYou), [athletes, f]) // eslint-disable-line react-hooks/exhaustive-deps
  const blocked = reach.filter(x => x.fit.blocking.length)

  return (
    <Modal title="New circular" onClose={onClose} wide>
      <div className="grid md:grid-cols-[1fr_270px] gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Field label="Title"><input className={inputCls} value={f.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Type"><select className={inputCls} value={f.type} onChange={e => set('type', e.target.value)}>{Object.entries(CIRCULAR_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          </div>
          <Field label="Summary"><textarea className={`${inputCls} h-24 py-2`} value={f.summary} onChange={e => set('summary', e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-2">
            {f.facts.map(([k, v], i) => <Field key={k} label={k}><input className={inputCls} value={v} onChange={e => set('facts', f.facts.map((x, j) => j === i ? [k, e.target.value] : x))} /></Field>)}
          </div>
          <fieldset>
            <legend className="text-sm font-semibold mb-2">Send to</legend>
            <div className="flex flex-wrap gap-2 mb-2">{preset.sports.map(s => <Toggle key={s} on={f.sports.includes(s)} onClick={() => toggleIn('sports', s)}>{s}</Toggle>)}</div>
            <div className="flex flex-wrap gap-2 mb-2">{preset.groups.map(([g]) => <Toggle key={g} on={f.groups.includes(g)} onClick={() => toggleIn('groups', g)}>{g}</Toggle>)}</div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.para} onChange={e => set('para', e.target.checked)} className="size-4 accent-[#0E3B43]" />Para athletes only</label>
            <div className="text-xs text-ink-3 mt-2">{preset.states ? 'Karnataka only (your jurisdiction)' : 'All India'}</div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold mb-2">Requirements, checked for every athlete</legend>
            <div className="flex flex-wrap gap-2">{preset.requirements.map(r => <Toggle key={r} on={f.requirements.includes(r)} onClick={() => toggleIn('requirements', r)}>{r}</Toggle>)}</div>
          </fieldset>
        </div>
        <aside className="rounded-xl bg-pool-soft p-4 self-start md:sticky md:top-20">
          <Users className="size-6 text-deep" />
          <div className="display text-4xl tabular text-deep mt-2">{reach.length}</div>
          <div className="text-sm text-ink-2">athletes will get this, and {reach.filter(x => x.a.minor).length} parents or guardians of under-18s</div>
          <div className="text-xs text-ink-3 mt-2">{audienceText(audience)}</div>
          {blocked.length > 0 && (
            <div className="mt-4 rounded-lg bg-white p-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-rope"><AlertTriangle className="size-4" />{blocked.length} can't enter yet</div>
              <ul className="mt-1 space-y-1 text-xs text-ink-2">{blocked.map(({ a, fit }) => <li key={a.id}><b>{a.name}</b>: {fit.blocking[0].detail}</li>)}</ul>
              <div className="text-xs text-ink-3 mt-2">They'll see exactly what to fix.</div>
            </div>
          )}
        </aside>
      </div>
      <div className="flex justify-end gap-2 mt-6"><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn disabled={!reach.length} onClick={() => { publishCircular(circular); onClose() }}>Publish to {reach.length} athletes</Btn></div>
    </Modal>
  )
}

function Toggle({ on, onClick, children }) {
  return <button type="button" onClick={onClick} aria-pressed={on} className={`h-8 px-3 rounded-full text-sm font-semibold border ${on ? 'bg-deep text-white border-deep' : 'bg-white text-ink-2 border-line'}`}>{children}</button>
}

export default function FedCirculars() {
  const { circulars, session, org } = useStore()
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(null)
  const composing = params.get('new') === '1'
  const mine = circulars.filter(c => c.orgId === session.id)
  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Circulars</h1><p className="text-ink-2 mt-1 max-w-[62ch]">Championship notices, selection lists, ID deadlines and rule changes from {org.short}. Each one reaches only the athletes it applies to, with requirements already checked.</p></div>
        <Btn onClick={() => setParams({ new: '1' })}><Plus className="size-4" />New circular</Btn>
      </div>
      <div className="mt-6 space-y-2">
        {mine.map(c => <div key={c.id} className="relative">{c.fresh && <Chip tone="grass" className="absolute right-3 top-3 z-10">Just published</Chip>}<CircularRow c={c} onOpen={() => setOpen(c)} /></div>)}
      </div>
      {composing && <Composer onClose={() => setParams({})} />}
      {open && <CircularModal c={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
