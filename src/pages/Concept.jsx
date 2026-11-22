import { Link } from 'react-router-dom'
import { PROBLEM, BENCHMARKS, PILLARS, PERSONAS, ROADMAP, METRICS } from '../data/concept'

const DEMO_SCRIPT = [
  ['Sign in as Meera Iyer', 'An S9 para swimmer backed by Blufin. The feed opens with Blufin\'s Para Swim Accelerator call at the top.'],
  ['Scroll the feed', 'Results, funding calls from GoSports and OGQ, PCI and federation competition alerts, media highlights. Filter by Results, Funding & calls, Competitions or Media.'],
  ['Add a result', 'Use "Add a result" in the composer or on the profile. Pick a medal, request verification from the coach or federation, and share it to the feed.'],
  ['Open your profile', 'Medal cabinet, personal bests, rankings, team (coach, nutritionist, physio, backers) and an itemised fundraiser.'],
  ['Apply to a call', 'From the right rail, open a matching call and apply with your profile. Verified results travel with the application.'],
  ['Follow and discover', 'Search for "javelin", "S9" or "Hyderabad"; filter for athletes raising funds; follow coaches and foundations.'],
  ['Switch to Blufin Foundation', 'From the account menu, switch to Blufin. Open the Accelerator call to see ranked applicants and shortlist them.'],
]

const SOURCES = [
  ['Front Office Sports: young athletes have entered their LinkedIn era', 'https://frontofficesports.com/article/young-athletes-have-entered-their-linkedin-era/'],
  ['Hudl: athlete profiles', 'https://www.hudl.com/athletes'],
  ['Rivals (On3): claim and verify a profile', 'https://www.on3.com/rivals/jaidyn-hampton-277147/claim-profile/'],
  ['SportsRecruits: athlete insights and Roster Needs', 'https://sportsrecruits.com/athletes/insights'],
  ['NCSA: athlete features', 'https://www.ncsasports.org/?p=2986'],
  ['FieldLevel (Wikipedia)', 'https://www.wikipedia.org/wiki/FieldLevel'],
  ['Strava feed and clubs (AOL)', 'https://www.aol.com/strava-everywhere-heres-know-tracking-194500210.html'],
  ['GMTM social network for athletes (KARE 11)', 'https://www.kare11.com/article/news/local/kare11-sunrise/gmtm-social-network-athletes-sports/89-402764f6-7575-4c9f-a934-2d4df0f954c0'],
  ['Opendorse public athlete marketplace', 'https://biz.opendorse.com/?p=6814'],
  ['Money: Olympians and crowdfunding', 'https://money.com/celebrities-crowdfunding-help-olympians-pay-bills'],
  ['Australian Sports Foundation', 'https://asf.org.au/'],
  ['GLL Sport Foundation Awards 2026', 'https://www.gll.org/articles/gsf-awards-2026'],
  ['Khelo India NSRS', 'https://nsrsold.kheloindia.gov.in/home/about'],
  ['Outlook: KIRTI talent identification', 'https://www.outlookindia.com/iitm/hub4sportstech/khelo-india-kirti-ai-for-grassroots-sports-talent-in-india'],
  ['GoSports Foundation (Wikipedia)', 'https://en.wikipedia.org/wiki/GoSports_Foundation'],
  ['OGQ FAQ', 'https://ogq.org/faq'],
]

function H2({ children }) { return <h2 className="display text-[clamp(1.5rem,3vw,2rem)] mb-4">{children}</h2> }

export default function Concept() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-12">
      <header>
        <div className="lane-rope rounded-full w-40 mb-6" />
        <h1 className="display text-[clamp(2.2rem,6vw,4rem)] max-w-[18ch]">Blufin Discover: concept and benchmarking</h1>
        <p className="mt-5 text-lg text-ink-2 max-w-[62ch] leading-relaxed">A LinkedIn for Indian sport: one verified profile per athlete, linked to the coaches, support staff and funders behind them, with a feed and an opportunity marketplace on top.</p>
        <div className="mt-6 flex gap-3 flex-wrap"><Link to="/" className="h-11 px-5 rounded-full bg-deep text-white font-semibold inline-flex items-center">Try the demo</Link><a href="#benchmarks" className="h-11 px-5 rounded-full border border-line font-semibold inline-flex items-center">Jump to benchmarks</a></div>
      </header>

      <section>
        <H2>The problem</H2>
        <ul className="grid sm:grid-cols-2 gap-3">{PROBLEM.map(p => <li key={p} className="card p-4 text-ink-2 leading-relaxed">{p}</li>)}</ul>
      </section>

      <section id="benchmarks">
        <H2>Benchmarking: twelve platforms, five categories</H2>
        <p className="text-ink-2 mb-5 max-w-[65ch]">No single platform combines verified sporting results, the support ecosystem, funding and a social feed. Each of these does one piece well.</p>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-paper text-left"><tr>{['Platform', 'What it does', 'What we borrow', 'Gap for Indian sport'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
            <tbody>{BENCHMARKS.map(b => (
              <tr key={b.name} className="border-t border-line align-top">
                <td className="p-3"><div className="font-bold">{b.name}</div><div className="text-xs text-ink-3">{b.category}, {b.region}</div></td>
                <td className="p-3 text-ink-2">{b.what}</td>
                <td className="p-3 text-deep font-medium">{b.borrow}</td>
                <td className="p-3 text-ink-2">{b.gap}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section>
        <H2>Six pillars</H2>
        <div className="grid md:grid-cols-2 gap-4">{PILLARS.map(p => (
          <div key={p.title} className="card p-5">
            <h3 className="display-tight text-xl">{p.title}</h3>
            <p className="text-ink-2 mt-2 leading-relaxed">{p.body}</p>
            <ul className="mt-3 space-y-1 text-sm">{p.features.map(f => <li key={f} className="flex gap-2"><span className="mt-2 size-1.5 rounded-full bg-rope shrink-0" />{f}</li>)}</ul>
          </div>
        ))}</div>
      </section>

      <section>
        <H2>Who it's for</H2>
        <div className="card divide-y divide-line">{PERSONAS.map(([r, who, need]) => (
          <div key={r} className="p-4 grid sm:grid-cols-[160px_1fr_1.3fr] gap-1 sm:gap-4"><div className="font-bold">{r}</div><div className="text-ink-2">{who}</div><div className="text-ink">{need}</div></div>
        ))}</div>
      </section>

      <section>
        <H2>How to demo it</H2>
        <ol className="space-y-3">{DEMO_SCRIPT.map(([t, d], i) => (
          <li key={t} className="card p-4 flex gap-4"><span className="display text-2xl text-rope tabular w-8 shrink-0">{i + 1}</span><span><span className="block font-bold">{t}</span><span className="block text-ink-2 mt-0.5">{d}</span></span></li>
        ))}</ol>
      </section>

      <section>
        <H2>Roadmap</H2>
        <ol className="relative border-l-2 border-line ml-3 space-y-5">{ROADMAP.map(([t, d]) => (
          <li key={t} className="ml-6 relative"><span className="absolute -left-[33px] top-1 size-4 rounded-full bg-deep ring-4 ring-paper" /><div className="font-bold">{t}</div><div className="text-ink-2">{d}</div></li>
        ))}</ol>
      </section>

      <section>
        <H2>What we'd measure</H2>
        <div className="grid sm:grid-cols-2 gap-3">{METRICS.map(([m, d]) => <div key={m} className="card p-4"><div className="font-bold">{m}</div><div className="text-sm text-ink-2 mt-1">{d}</div></div>)}</div>
      </section>

      <section>
        <H2>Sources</H2>
        <ul className="space-y-1.5 text-sm">{SOURCES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer" className="text-pool hover:underline">{t}</a></li>)}</ul>
        <p className="text-xs text-ink-3 mt-6">All people on this demo are fictional. Organisation profiles use public names for illustration; their posts, calls and figures here are sample content, not real announcements.</p>
      </section>
    </div>
  )
}
