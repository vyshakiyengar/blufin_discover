import { Link } from 'react-router-dom'
import { INSIGHT, JOBS, PASSPORT_FIELDS, FOUNDATION_FLOW, PRINCIPLES, BENCHMARKS, ROADMAP, SOURCES } from '../data/concept'

function H2({ children }) { return <h2 className="display text-[clamp(1.5rem,3vw,2rem)] mb-4">{children}</h2> }

export default function Concept() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-14">
      <header>
        <div className="lane-rope w-32 rounded-full mb-6" />
        <h1 className="display text-[clamp(2.1rem,5vw,3.4rem)] max-w-[20ch]">How we designed Blufin Discover</h1>
        <p className="mt-5 text-lg text-ink-2 max-w-[62ch] leading-relaxed">{INSIGHT}</p>
        <div className="mt-6"><Link to="/" className="h-11 px-5 rounded-full bg-deep text-white font-semibold inline-flex items-center">Try the demo</Link></div>
      </header>

      <section>
        <H2>Four users, four jobs</H2>
        <div className="grid md:grid-cols-2 gap-4">
          {JOBS.map(j => (
            <div key={j.who} className="card p-5">
              <div className="text-xs font-semibold text-ink-3">{j.example}</div>
              <h3 className="display-tight text-xl">{j.who}</h3>
              <div className="mt-3 text-sm font-semibold">Jobs</div>
              <ul className="text-sm text-ink-2 list-disc pl-5 space-y-0.5">{j.jobs.map(x => <li key={x}>{x}</li>)}</ul>
              <div className="mt-3 text-sm font-semibold">What gets in the way today</div>
              <ul className="text-sm text-ink-2 list-disc pl-5 space-y-0.5">{j.pains.map(x => <li key={x}>{x}</li>)}</ul>
              <div className="mt-3 flex flex-wrap gap-1.5">{j.built.map(x => <span key={x} className="rounded-full bg-pool-soft text-deep px-2.5 py-0.5 text-xs font-semibold">{x}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>What goes on a Sports Passport, and why</H2>
        <dl className="card divide-y divide-line">
          {PASSPORT_FIELDS.map(([k, v]) => <div key={k} className="p-4 grid sm:grid-cols-[220px_1fr] gap-1 sm:gap-4"><dt className="font-semibold">{k}</dt><dd className="text-ink-2 leading-relaxed">{v}</dd></div>)}
        </dl>
      </section>

      <section>
        <H2>How foundations actually choose athletes</H2>
        <ol className="space-y-3">
          {FOUNDATION_FLOW.map(([t, d], i) => <li key={t} className="card p-4 flex gap-4"><span className="display text-2xl text-rope tabular w-7 shrink-0">{i + 1}</span><span><span className="block font-bold">{t}</span><span className="block text-ink-2 mt-0.5">{d}</span></span></li>)}
        </ol>
      </section>

      <section>
        <H2>What federations send, and to whom</H2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5"><h3 className="display-tight text-lg">State: Karnataka Swimming Association</h3><ul className="mt-2 text-sm text-ink-2 list-disc pl-5 space-y-1"><li>State championship notices by age group (Group I, II, III, now split into single-year sub-groups A, B, C)</li><li>State team selection lists for the Sub-Junior, Junior and Senior Nationals</li><li>SFI UID renewal deadlines, since nationals need a valid UID</li><li>Para swimming classification days with PCI</li><li>Results, heat sheets and Form 2 certificates</li></ul></div>
          <div className="card p-5"><h3 className="display-tight text-lg">National: Badminton Association of India</h3><ul className="mt-2 text-sm text-ink-2 list-disc pl-5 space-y-1"><li>Ranking tournament circulars (sub-junior, junior, senior) with entry deadlines and fees</li><li>Selection policies, such as naming a ranking event as the selection tournament for World Juniors</li><li>Player ID and age-proof rules, and age-fraud notices</li><li>Venue and date changes</li><li>Ranking updates, which drive entries to BWF events</li></ul></div>
        </div>
        <p className="text-sm text-ink-3 mt-3">BWF, the world body, sets international rules and rankings; in India the national federation (BAI) runs the circuit and sends entries.</p>
      </section>

      <section>
        <H2>Design principles</H2>
        <div className="grid sm:grid-cols-2 gap-3">{PRINCIPLES.map(([t, d]) => <div key={t} className="card p-4"><div className="font-bold">{t}</div><div className="text-sm text-ink-2 mt-1">{d}</div></div>)}</div>
      </section>

      <section>
        <H2>What we borrowed, and why we're not a social network</H2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-paper text-left"><tr>{['Platform', 'What it does', 'What we took', 'Why it isn\'t enough here'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody>{BENCHMARKS.map(r => <tr key={r[0]} className="border-t border-line align-top">{r.map((c, i) => <td key={i} className={`p-3 ${i === 0 ? 'font-bold' : i === 2 ? 'text-deep font-medium' : 'text-ink-2'}`}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section>
        <H2>Roadmap</H2>
        <ol className="relative border-l-2 border-line ml-3 space-y-5">{ROADMAP.map(([t, d]) => <li key={t} className="ml-6 relative"><span className="absolute -left-[33px] top-1 size-4 rounded-full bg-deep ring-4 ring-paper" /><div className="font-bold">{t}</div><div className="text-ink-2">{d}</div></li>)}</ol>
      </section>

      <section>
        <H2>Sources</H2>
        <ul className="space-y-1.5 text-sm">{SOURCES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer" className="text-pool hover:underline">{t}</a></li>)}</ul>
        <p className="text-xs text-ink-3 mt-6">All people in the demo are fictional. Organisation names are used for illustration; every notice, call, list and figure attached to them in the demo is sample content.</p>
      </section>
    </div>
  )
}
