import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, Download } from 'lucide-react'
import { useStore, fmtDate, inr, lakh } from '../../store'
import { PORTFOLIO } from '../../data/calls'
import { ORGS } from '../../data/orgs'
import { allResults } from '../../lib/eligibility'
import { Avatar, Chip, Progress, Btn, Modal, MedalDisc } from '../../components/ui'

const since = '2026-04-01'

function stats(rows, byId) {
  const res = rows.flatMap(r => allResults(byId[r.athleteId]).filter(x => x.verifiedBy && x.date >= since))
  return {
    medals: res.filter(r => r.medal),
    intl: res.filter(r => r.level === 'International'),
    gold: res.filter(r => r.medal === 'gold').length, silver: res.filter(r => r.medal === 'silver').length, bronze: res.filter(r => r.medal === 'bronze').length,
  }
}

function ImpactReport({ p, onClose }) {
  const { byId, flash } = useStore()
  const st = stats(p.athletes, byId)
  const committed = p.athletes.reduce((s, r) => s + r.committed, 0)
  const spent = p.spendByCategory.reduce((s, [, v]) => s + v, 0)
  const max = Math.max(...p.spendByCategory.map(([, v]) => v))
  return (
    <Modal title="Impact report" onClose={onClose} wide>
      <article className="leaf rounded-xl border border-line p-6 sm:p-8">
        <div className="text-sm text-ink-3">Prepared for {ORGS[p.donor].name}, {p.period}</div>
        <h2 className="display text-3xl mt-1">What your grant did</h2>
        <p className="text-ink-2 mt-2 max-w-[62ch]">CSR contribution to Blufin Foundation under Schedule VII item (vii) of the Companies Act, 2013: training to promote Paralympic sports. Every result below is taken from a federation-verified record on Blufin Discover, not from athlete self-reports.</p>
        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[[p.athletes.length, 'para athletes supported'], [st.medals.length, 'verified medals'], [st.intl.length, 'international results'], [`${Math.round((spent / committed) * 100)}%`, 'of committed funds deployed']].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-white border border-line p-4"><dd className="display text-3xl tabular text-deep">{n}</dd><dt className="text-xs text-ink-2 mt-1">{l}</dt></div>
          ))}
        </dl>
        <div className="mt-6 flex gap-5">{[['gold', st.gold], ['silver', st.silver], ['bronze', st.bronze]].map(([m, n]) => <span key={m} className="flex items-center gap-2"><MedalDisc medal={m} size={26} /><b className="tabular text-lg">{n}</b></span>)}</div>
        <h3 className="font-semibold mt-8 mb-3">Where the money went</h3>
        <ul className="space-y-2">
          {p.spendByCategory.map(([k, v]) => (
            <li key={k} className="grid grid-cols-[170px_1fr_80px] sm:grid-cols-[240px_1fr_90px] items-center gap-3 text-sm">
              <span>{k}</span><span className="h-3 rounded-full bg-paper overflow-hidden"><span className="block h-full bg-deep rounded-full" style={{ width: `${(v / max) * 100}%` }} /></span><span className="tabular text-right font-semibold">{lakh(v)}</span>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold mt-8 mb-3">Athletes</h3>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white">
          {p.athletes.map(r => {
            const a = byId[r.athleteId]
            const best = allResults(a).filter(x => x.verifiedBy && x.medal).sort((x, y) => y.date.localeCompare(x.date))[0]
            return (
              <li key={a.id} className="p-3 flex items-center gap-3 text-sm">
                <Avatar person={a} size={34} /><span className="flex-1 min-w-0"><b>{a.name}</b>, {a.sport}<span className="block text-xs text-ink-3">{best ? `${best.result}, ${best.event}` : 'No medal yet this period'}</span></span>
                {best && <span className="hidden sm:inline-flex items-center gap-1 text-xs text-grass font-semibold"><ShieldCheck className="size-3.5" />{ORGS[best.verifiedBy]?.short}</span>}
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-ink-3 mt-6">Sample report generated from demo data on {fmtDate('2026-11-22')}.</p>
      </article>
      <div className="flex justify-end mt-4"><Btn onClick={() => flash('PDF ready to send (demo)')}><Download className="size-4" />Download PDF</Btn></div>
    </Modal>
  )
}

export default function Portfolio() {
  const { byId, session, done } = useStore()
  const [report, setReport] = useState(false)
  const p = PORTFOLIO[session.id]
  if (!p) return <div className="p-10 text-center">No portfolio yet.</div>
  const st = stats(p.athletes, byId)
  const committed = p.athletes.reduce((s, r) => s + r.committed, 0)
  const spent = p.athletes.reduce((s, r) => s + r.spent, 0)
  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Portfolio</h1><p className="text-ink-2 mt-1 max-w-[62ch]">Athletes you back, what you've spent and what they've won since April, from verified results.</p></div>
        <Btn onClick={() => { setReport(true); done('fd-report') }}><FileText className="size-4" />Impact report for {ORGS[p.donor].short}</Btn>
      </div>
      <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[[p.athletes.length, 'athletes backed'], [lakh(committed), 'committed'], [lakh(spent), `spent (${Math.round(spent / committed * 100)}%)`], [st.medals.length, 'verified medals since April']].map(([n, l]) => (
          <div key={l} className="card p-4"><dd className="display text-3xl tabular text-deep">{n}</dd><dt className="text-sm text-ink-2 mt-1">{l}</dt></div>
        ))}
      </dl>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-paper text-left"><tr>{['Athlete', 'Programme', 'Spent of committed', 'Latest verified result', 'Check-in', 'Next'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {p.athletes.map(r => {
              const a = byId[r.athleteId]
              const last = allResults(a).filter(x => x.verifiedBy).sort((x, y) => y.date.localeCompare(x.date))[0]
              return (
                <tr key={a.id} className="border-t border-line align-top">
                  <td className="p-3"><Link to={`/p/${a.id}`} className="flex items-center gap-2 font-semibold hover:underline"><Avatar person={a} size={30} />{a.name}</Link><div className="text-xs text-ink-3 ml-10">{a.sport}</div></td>
                  <td className="p-3 text-ink-2">{r.programme}</td>
                  <td className="p-3 w-48"><div className="tabular text-xs mb-1">{inr(r.spent)} of {inr(r.committed)}</div><Progress value={r.spent} goal={r.committed} tone="teal" /></td>
                  <td className="p-3">{last ? <><div className="font-semibold">{last.result}</div><div className="text-xs text-ink-3">{fmtDate(last.date, { day: 'numeric', month: 'short' })}, verified by {ORGS[last.verifiedBy]?.short}</div></> : '—'}</td>
                  <td className="p-3"><Chip tone={r.checkIn === 'On track' ? 'grass' : r.checkIn === 'Completed' ? 'default' : 'amber'}>{r.checkIn}</Chip>{r.note && <div className="text-xs text-ink-3 mt-1 max-w-[180px]">{r.note}</div>}</td>
                  <td className="p-3 text-ink-2">{r.next}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {report && <ImpactReport p={p} onClose={() => setReport(false)} />}
    </div>
  )
}
