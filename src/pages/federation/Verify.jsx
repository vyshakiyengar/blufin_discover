import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, X, Upload, CheckCircle2 } from 'lucide-react'
import { useStore, fmtDate, RESULT_BATCHES } from '../../store'
import { Avatar, MedalDisc, Btn, Chip, Empty } from '../../components/ui'

export default function Verify() {
  const { athletes, byId, session, org, verify, publishBatch, published } = useStore()
  const [certs, setCerts] = useState(true)
  const queue = athletes.flatMap(a => a.results.filter(r => r.pendingWith === session.id).map(r => ({ a, r })))
  const batch = RESULT_BATCHES[session.id]
  const isPublished = batch && published.includes(batch.id)

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-10">
      <header>
        <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Verify and publish</h1>
        <p className="text-ink-2 mt-1 max-w-[64ch]">You already hold the official results. Publishing them here writes verified results straight onto athletes' passports, so nobody needs to photocopy or attest a certificate again.</p>
      </header>

      <section>
        <div className="flex items-end justify-between mb-3"><h2 className="display-tight text-lg">Results athletes have claimed</h2><span className="text-sm text-ink-3">{queue.length} waiting</span></div>
        {queue.length ? (
          <ul className="space-y-2">
            {queue.map(({ a, r }) => (
              <li key={r.id} className={`card p-4 flex flex-wrap items-center gap-4 ${r.date === '2026-11-21' ? 'ring-2 ring-pool/30 border-deep' : ''}`}>
                <Avatar person={a} size={42} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm"><Link to={`/p/${a.id}`} className="font-semibold hover:underline">{a.name}</Link> <span className="text-ink-3">{a.ids?.[0]?.label} {a.ids?.[0]?.value}</span></div>
                  <div className="font-semibold flex items-center gap-2 mt-1"><MedalDisc medal={r.medal} size={20} />{r.result}{r.mark && <span className="tabular text-deep">{r.mark}</span>}</div>
                  <div className="text-sm text-ink-2">{r.event}, {fmtDate(r.date)}</div>
                </div>
                <div className="flex gap-2">
                  <Btn kind="go" onClick={() => verify(r.id, 'verified', session.id)}><ShieldCheck className="size-4" />Matches our records</Btn>
                  <Btn kind="danger" onClick={() => verify(r.id, 'rejected', session.id)}><X className="size-4" />No match</Btn>
                </div>
              </li>
            ))}
          </ul>
        ) : <Empty>Nothing waiting. Results athletes claim and send to {org.short} land here.</Empty>}
      </section>

      {batch && (
        <section>
          <h2 className="display-tight text-lg mb-3">Publish official results</h2>
          <div className="card overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-line">
              <div><div className="text-xs text-ink-3">Results sheet uploaded {fmtDate(batch.date)}</div><div className="display-tight text-lg">{batch.event}</div></div>
              {isPublished ? <Chip tone="grass"><CheckCircle2 className="size-3.5" />Published to passports</Chip> : <Chip tone="amber"><Upload className="size-3.5" />Ready to publish</Chip>}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-paper text-left"><tr><th className="p-3 font-semibold">Athlete, matched by ID</th><th className="p-3 font-semibold">Result</th><th className="p-3 font-semibold text-right">Mark</th></tr></thead>
              <tbody>
                {batch.rows.map((r, i) => {
                  const a = byId[r.athleteId]
                  return (
                    <tr key={i} className="border-t border-line">
                      <td className="p-3"><div className="flex items-center gap-2"><Avatar person={a} size={28} /><span><Link to={`/p/${a.id}`} className="font-semibold hover:underline">{a.name}</Link><span className="block text-xs text-ink-3">{a.ids?.[0]?.value}</span></span></div></td>
                      <td className="p-3"><span className="flex items-center gap-2"><MedalDisc medal={r.medal} size={18} />{r.result}</span></td>
                      <td className="p-3 text-right tabular">{r.mark}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/50">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={certs} onChange={e => setCerts(e.target.checked)} className="size-4 accent-[#0E3B43]" disabled={isPublished} />Issue {batch.level === 'National' ? 'Form 2' : 'merit'} certificates digitally</label>
              {isPublished
                ? <span className="text-sm text-grass font-semibold">Done. {new Set(batch.rows.map(r => r.athleteId)).size} passports now show these results as verified by {org.short}.</span>
                : <Btn onClick={() => publishBatch(batch, certs)}><ShieldCheck className="size-4" />Publish to {new Set(batch.rows.map(r => r.athleteId)).size} passports</Btn>}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
