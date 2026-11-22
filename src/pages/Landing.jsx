import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Link2, Search } from 'lucide-react'
import { useStore } from '../store'
import { Avatar, OrgMark } from '../components/ui'
import { Logo } from '../components/Shell'
import { GROUPS } from '../lib/ecosystem'

export function PassportCover({ className = '', name }) {
  return (
    <div className={`cover-tex rounded-l-md rounded-r-2xl shadow-2xl text-[#E9C77B] flex flex-col items-center justify-between py-8 px-6 aspect-[5/7] ${className}`} aria-hidden>
      <div className="text-center">
        <div className="text-[11px] tracking-[0.3em] font-semibold opacity-90">REPUBLIC OF SPORT</div>
        <div className="display text-2xl mt-2 tracking-wide">SPORTS<br />PASSPORT</div>
      </div>
      <svg viewBox="0 0 100 100" className="w-24 h-24">
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M24 62c11-3 19-13 25-33 4 14 13 25 27 31-14 0-31 2-52 2z" fill="currentColor" />
      </svg>
      <div className="text-center">
        {name && <div className="text-sm font-semibold text-white/90 mb-1">{name}</div>}
        <div className="text-[11px] tracking-[0.25em] font-semibold">BLUFIN DISCOVER</div>
      </div>
    </div>
  )
}

const BEFORE_AFTER = [
  ['Talent found through whoever you happen to know', 'Anyone can search everyone, by sport, state and what is verified'],
  ['A coach\'s record is whatever their bio says', 'Certifications confirmed by the body that issued them'],
  ['Circulars as PDFs forwarded on WhatsApp', 'Circulars reach only eligible athletes, with entry checks already done'],
  ['A new application form for every foundation', 'Apply with your passport; reviewers see what is verified'],
]

const HOW = [
  [ShieldCheck, 'Verified at the source', 'Results come from the federation that ran the meet. Certifications come from the body that issued them.'],
  [Link2, 'Connected both ways', 'A coach is linked to an athlete only when both confirm it, so a profile shows who really works with whom.'],
  [Search, 'Discoverable by everyone', 'Athletes find coaches and physios, foundations find talent, federations reach their members.'],
]

export default function Landing() {
  const { byId, signIn, entities } = useStore()
  const nav = useNavigate()
  const go = (kind, id, to) => { signIn(kind, id); nav(to) }
  const meera = byId.meera

  const seats = [
    { kind: 'athlete', id: 'meera', to: '/today', who: 'Meera Iyer', role: 'Athlete: S9 para swimmer, Bengaluru', does: 'Keep one verified record, get the circulars that apply to you, apply for funding with it.', mark: <Avatar person={meera} size={48} /> },
    { kind: 'org', id: 'blufin', to: '/f/review', who: 'Blufin Foundation', role: 'Foundation', does: 'Run a call, review applicants on evidence, scout, and report impact to CSR donors.', mark: <OrgMark id="blufin" size={48} /> },
    { kind: 'org', id: 'ksa', to: '/g/verify', who: 'Karnataka Swimming Association', role: 'State federation', does: 'Verify results, publish them to passports, and send circulars to the right swimmers.', mark: <OrgMark id="ksa" size={48} /> },
    { kind: 'org', id: 'bai', to: '/g/registry', who: 'Badminton Association of India', role: 'National federation', does: 'Clear age-proof flags, publish ranking circulars and results.', mark: <OrgMark id="bai" size={48} /> },
  ]

  return (
    <div className="min-h-screen">
      <div className="bg-ink text-white/80 text-xs text-center px-4 py-1.5">Demo with sample data. People are fictional; organisation notices, calls and figures are illustrative.</div>
      <div className="max-w-[1120px] mx-auto px-5">
        <header className="h-16 flex items-center justify-between">
          <Logo />
          <Link to="/concept" className="text-sm font-semibold text-deep hover:underline">How we designed it</Link>
        </header>

        <section className="grid lg:grid-cols-[1.25fr_1fr] gap-10 items-center pt-8 lg:pt-14">
          <div>
            <h1 className="display text-[clamp(2.2rem,4.6vw,3.7rem)] text-ink">All of Indian sport, verified and in one place.</h1>
            <p className="mt-5 text-lg text-ink-2 max-w-[54ch] leading-relaxed">Every athlete, coach, physio, academy, foundation and federation gets one profile, with its facts confirmed by whoever issued them. Everyone becomes discoverable, and the ecosystem starts working as one.</p>
            <div className="mt-7 flex flex-wrap gap-2 max-w-xl">
              {GROUPS.map(g => (
                <Link key={g.key} to={`/discover?group=${g.key}`} className="rounded-full bg-white border border-line px-3.5 py-1.5 text-sm hover:border-deep">
                  <span className="font-bold tabular-nums mr-1.5">{entities.filter(g.test).length}</span>{g.label.toLowerCase()}
                </Link>
              ))}
            </div>
            <Link to="/discover" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-deep text-white px-5 py-3 font-semibold hover:bg-ink">Explore the ecosystem <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative h-[380px] sm:h-[420px] hidden sm:block">
            <div className="absolute right-6 top-4 w-[250px] rotate-6"><PassportCover name="Meera Iyer" /></div>
            <div className="absolute left-4 lg:left-0 bottom-0 w-[300px] -rotate-3 leaf rounded-xl border border-line shadow-xl p-4">
              <div className="text-[10px] font-semibold text-ink-3">Sports Passport, identity page</div>
              <div className="flex gap-3 mt-2 items-center"><Avatar person={meera} size={52} /><div><div className="display-tight text-lg">Meera Iyer</div><div className="text-xs text-ink-2">Para Swimming, S9 (Review 2027)</div><div className="text-xs text-grass font-semibold mt-0.5">Date of birth verified by KSA</div></div></div>
              <div className="mrz text-[10px] text-ink-2 mt-3 whitespace-nowrap overflow-hidden">SP&lt;INDIYER&lt;&lt;MEERA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          {HOW.map(([I, t, d]) => (
            <div key={t}>
              <I className="size-6 text-rope" />
              <h3 className="font-bold text-lg mt-2">{t}</h3>
              <p className="text-ink-2 mt-1 leading-relaxed">{d}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="display-tight text-2xl">Take a seat</h2>
          <p className="text-ink-2 mt-1">Each view has a short guide in the corner. Do something in one seat, switch, and watch it arrive in another.</p>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {seats.map(s => (
              <button key={s.id} onClick={() => go(s.kind, s.id, s.to)} className="text-left card p-5 flex gap-4 hover:border-deep transition-colors group">
                {s.mark}
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold text-ink-3">{s.role}</span>
                  <span className="block font-bold text-lg leading-tight">{s.who}</span>
                  <span className="block text-sm text-ink-2 mt-1.5 leading-snug">{s.does}</span>
                </span>
                <ArrowRight className="size-5 text-ink-3 group-hover:text-deep shrink-0 mt-1" />
              </button>
            ))}
          </div>
          <div className="mt-3 text-sm"><Link to="/p/meera" className="font-semibold text-pool hover:underline">See a public passport without signing in</Link></div>
        </section>

        <section className="mt-14 mb-16">
          <h2 className="display-tight text-2xl">What it replaces</h2>
          <div className="mt-4 card overflow-hidden">
            {BEFORE_AFTER.map(([b, a]) => (
              <div key={b} className="grid sm:grid-cols-2 border-b last:border-b-0 border-line">
                <div className="p-4 text-ink-3 line-through decoration-rope/60">{b}</div>
                <div className="p-4 font-semibold sm:border-l border-line bg-pool-soft/40">{a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
