import { useState } from 'react'
import { Upload, ShieldCheck } from 'lucide-react'
import { useStore } from '../store'
import { Modal, Field, inputCls, MedalDisc } from './ui'

const LEVELS = ['International', 'National', 'State', 'District', 'University']

export default function AchievementModal({ onClose }) {
  const { me, addAchievement, byId } = useStore()
  const coach = me.coachedBy?.[0] && byId[me.coachedBy[0]]
  const [f, setF] = useState({
    title: '', event: '', level: 'National', medal: 'gold', date: '2026-11-20', result: '', location: '',
    verifier: coach ? coach.id : 'pci', share: true, proof: null,
  })
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target?.type === 'checkbox' ? e.target.checked : e.target ? e.target.value : e }))
  const valid = f.title.trim() && f.event.trim() && f.date

  const fillExample = () => setF(x => ({ ...x, title: `Gold, 50m Butterfly ${me.classification || ''}`.trim(), event: 'South Zone Para Aquatic Meet 2026', level: 'National', medal: 'gold', date: '2026-11-21', result: '31.42', location: 'Chennai', proof: 'result-sheet.pdf' }))

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const caption = f.share ? `New result: ${f.title} at the ${f.event}${f.result ? ` (${f.result})` : ''}.` : null
    addAchievement(me.id, {
      title: f.title.trim(), event: f.event.trim(), level: f.level, medal: f.medal || null, date: f.date, result: f.result.trim(),
      location: f.location.trim(), verifiedBy: null, pendingVerifier: f.verifier, proof: f.proof,
    }, caption)
    onClose()
  }

  return (
    <Modal title="Add a result" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <button type="button" onClick={fillExample} className="text-sm font-semibold text-pool hover:underline">Fill with an example result</button>
        <Field label="Medal">
          <div className="flex gap-2">
            {['gold', 'silver', 'bronze', ''].map(m => (
              <button type="button" key={m || 'none'} onClick={() => set('medal')(m)} aria-pressed={f.medal === m}
                className={`flex-1 h-14 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold ${f.medal === m ? 'border-deep bg-pool-soft' : 'border-line'}`}>
                <MedalDisc medal={m} size={24} />{m ? m[0].toUpperCase() + m.slice(1) : 'None'}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Result title" hint="For example: Gold, 100m Butterfly S9">
          <input className={inputCls} value={f.title} onChange={set('title')} required />
        </Field>
        <Field label="Competition">
          <input className={inputCls} value={f.event} onChange={set('event')} placeholder="National Para Swimming Championships 2026" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Level">
            <select className={inputCls} value={f.level} onChange={set('level')}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
          </Field>
          <Field label="Date"><input type="date" className={inputCls} value={f.date} onChange={set('date')} required /></Field>
          <Field label="Time, score or mark"><input className={inputCls} value={f.result} onChange={set('result')} placeholder="1:08.42" /></Field>
          <Field label="Venue"><input className={inputCls} value={f.location} onChange={set('location')} placeholder="Gwalior" /></Field>
        </div>
        <Field label="Proof" hint="Result sheet, certificate or federation link. Shared only with your verifier.">
          <button type="button" onClick={() => set('proof')(f.proof ? null : 'result-sheet.pdf')} className="w-full h-12 rounded-lg border-2 border-dashed border-line flex items-center justify-center gap-2 text-sm text-ink-2 hover:border-pool">
            <Upload className="size-4" />{f.proof ? `${f.proof} attached (tap to remove)` : 'Attach a file'}
          </button>
        </Field>
        <Field label="Ask to verify">
          <select className={inputCls} value={f.verifier} onChange={set('verifier')}>
            {coach && <option value={coach.id}>{coach.name} (your coach)</option>}
            <option value="pci">Paralympic Committee of India</option>
            <option value="sfi">Swimming Federation of India</option>
            <option value="afi">Athletics Federation of India</option>
            <option value="bai">Badminton Association of India</option>
            <option value="">Skip for now</option>
          </select>
        </Field>
        <div className="flex items-start gap-2 rounded-lg bg-pool-soft p-3 text-sm text-deep">
          <ShieldCheck className="size-5 shrink-0" />Verified results get a check mark and rank higher when funders search.
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.share} onChange={set('share')} className="size-4 accent-[#0B3A5B]" />Share this result to my feed
        </label>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="h-11 px-5 rounded-full border border-line font-semibold">Cancel</button>
          <button disabled={!valid} className="h-11 px-5 rounded-full bg-deep text-white font-semibold disabled:opacity-40">Add result</button>
        </div>
      </form>
    </Modal>
  )
}
