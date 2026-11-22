import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useStore } from '../store'
import { LEVELS } from '../data/people'
import { Modal, Field, inputCls, MedalDisc, Btn } from './ui'

export default function AddResultModal({ athlete, onClose }) {
  const { addResult, byId } = useStore()
  const coach = athlete.team?.find(([, r]) => /coach/i.test(r))?.[0]
  const stateBody = athlete.sport.includes('Swim') && athlete.represents === 'Karnataka' ? 'ksa' : athlete.sport.includes('Badminton') ? 'bai' : athlete.para ? 'pci' : null
  const [f, setF] = useState({ event: '', level: 'State', date: '2026-11-21', result: '', medal: 'gold', mark: '', verifier: stateBody || coach || '' })
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e?.target ? e.target.value : e }))
  const example = () => setF(x => ({ ...x, event: 'KSA Inter-District Para Meet 2026, Bengaluru', level: 'State', date: '2026-11-21', result: `Gold, 200m Freestyle ${athlete.classification?.cls || ''}`.trim(), medal: 'gold', mark: '2:21.40' }))
  const ok = f.event.trim() && f.result.trim()
  const submit = (e) => {
    e.preventDefault(); if (!ok) return
    addResult(athlete.id, { event: f.event.trim(), level: f.level, date: f.date, result: f.result.trim(), medal: f.medal || null, mark: f.mark.trim(), pendingWith: f.verifier || null, source: 'self' })
    onClose()
  }
  return (
    <Modal title="Add a result" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <button type="button" onClick={example} className="text-sm font-semibold text-pool hover:underline">Fill with Saturday's result</button>
        <Field label="Competition"><input className={inputCls} value={f.event} onChange={set('event')} placeholder="KSA State Senior Aquatic Championship 2026" required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Level"><select className={inputCls} value={f.level} onChange={set('level')}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></Field>
          <Field label="Date"><input type="date" className={inputCls} value={f.date} onChange={set('date')} /></Field>
        </div>
        <Field label="Result" hint="Medal or placing, and the event. For example: Gold, 100m Butterfly S9"><input className={inputCls} value={f.result} onChange={set('result')} required /></Field>
        <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
          <Field label="Time, score or mark"><input className={inputCls} value={f.mark} onChange={set('mark')} placeholder="1:08.42" /></Field>
          <div className="flex gap-1.5 pb-0.5" role="radiogroup" aria-label="Medal">
            {['gold', 'silver', 'bronze', ''].map(m => (
              <button type="button" key={m || 'none'} role="radio" aria-checked={f.medal === m} aria-label={m || 'No medal'} onClick={() => set('medal')(m)}
                className={`size-10 rounded-full flex items-center justify-center border-2 ${f.medal === m ? 'border-deep' : 'border-transparent'}`}><MedalDisc medal={m} size={26} /></button>
            ))}
          </div>
        </div>
        <Field label="Who can confirm this?" hint="The organiser's confirmation turns it green on your passport. A coach co-sign helps, but counts for less.">
          <select className={inputCls} value={f.verifier} onChange={set('verifier')}>
            {stateBody && <option value={stateBody}>Organiser: {stateBody === 'ksa' ? 'Karnataka Swimming Association' : stateBody === 'bai' ? 'Badminton Association of India' : 'Paralympic Committee of India'}</option>}
            {coach && <option value={coach}>My coach: {byId[coach]?.name}</option>}
            <option value="">Nobody for now (self-reported)</option>
          </select>
        </Field>
        <div className="flex gap-2 rounded-lg bg-pool-soft p-3 text-sm text-deep"><ShieldCheck className="size-5 shrink-0" />Foundations and selectors filter on verified results. Self-reported ones stay visible but marked.</div>
        <div className="flex justify-end gap-2"><Btn kind="ghost" type="button" onClick={onClose}>Cancel</Btn><Btn disabled={!ok}>Add result</Btn></div>
      </form>
    </Modal>
  )
}
