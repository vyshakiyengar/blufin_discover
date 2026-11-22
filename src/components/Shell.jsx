import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, BookUser, HandCoins, Trophy, Megaphone, ListChecks, Search, PieChart, ScrollText, ShieldCheck, Users, Lightbulb, RotateCcw, LogOut, Repeat, Check, ChevronDown, ChevronUp, Compass } from 'lucide-react'
import { useStore } from '../store'
import { Avatar, OrgMark } from './ui'
import { ORGS } from '../data/orgs'

export function Logo({ light }) {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Blufin Discover home">
      <svg viewBox="0 0 64 64" className="size-9"><rect width="64" height="64" rx="14" fill={light ? '#fff' : '#0E3B43'} /><path d="M14 42c8-2 14-10 18-24 3 10 9 18 18 22-10 0-22 2-36 2z" fill={light ? '#0E3B43' : '#fff'} /><path d="M10 50h44" stroke="#D8432F" strokeWidth="4" strokeDasharray="4 4" /></svg>
      <span className={`leading-none ${light ? 'text-white' : 'text-deep'}`}>
        <span className="display text-[17px] block">Blufin</span>
        <span className="text-[11px] font-semibold block" style={{ fontVariationSettings: '"wdth" 112' }}>Discover</span>
      </span>
    </Link>
  )
}

export const NAVS = {
  athlete: [['/today', 'Today', Home], ['/passport', 'Passport', BookUser], ['/opportunities', 'Opportunities', HandCoins], ['/wins', 'Wins', Trophy]],
  foundation: [['/f/calls', 'Calls', Megaphone], ['/f/review', 'Review', ListChecks], ['/f/scout', 'Scout', Search], ['/f/portfolio', 'Portfolio', PieChart]],
  federation: [['/g/circulars', 'Circulars', ScrollText], ['/g/verify', 'Verify & publish', ShieldCheck], ['/g/registry', 'Registry', Users]],
  public: [['/wins', 'Wins', Trophy], ['/explore', 'Explore', Compass]],
}

export const GUIDES = {
  athlete: [
    ['a-passport', 'Open your Sports Passport', 'IDs, classification, stamps and verified results in one place.', '/passport'],
    ['a-result', 'Add Saturday\'s result and ask KSA to verify it', 'Self-reported until the organiser confirms it.', '/passport?add=1'],
    ['a-circular', 'Act on a circular that applies to you', 'Only circulars you are eligible for reach you, with checks done.', '/today'],
    ['a-apply', 'Apply to Blufin\'s Para Swim Accelerator', 'Your passport is the application. No forms.', '/opportunities/blufin-psa-2027'],
  ],
  blufin: [
    ['fd-review', 'Open the Accelerator applicants', 'Evidence, not essays: what is verified and what is not.', '/f/review'],
    ['fd-select', 'Move a strong applicant to Selected', 'Drag them through the stages your panel uses.', '/f/review'],
    ['fd-scout', 'Scout an unbacked para swimmer', 'Search verified passports and add one to your watchlist.', '/f/scout'],
    ['fd-report', 'Generate the impact report for your CSR donor', 'Built from verified results and spend.', '/f/portfolio'],
  ],
  ksa: [
    ['f-verify', 'Verify a result an athlete claimed', 'Confirm it against your results and it turns green on their passport.', '/g/verify'],
    ['f-publish', 'Publish the Para Open results', 'One upload writes verified results to every swimmer\'s passport.', '/g/verify'],
    ['f-circular', 'Send a circular to exactly the right swimmers', 'Target by age group, para class and district; see reach before sending.', '/g/circulars?new=1'],
    ['f-remind', 'Remind swimmers with an expired SFI UID', 'Before they miss the state selection meet.', '/g/registry'],
  ],
  bai: [
    ['f-age', 'Clear an age-proof flag', 'Junior entries are blocked until the birth certificate is verified.', '/g/registry'],
    ['f-circular', 'Publish a ranking tournament circular', 'Entries check BAI ID and age proof automatically.', '/g/circulars?new=1'],
    ['f-publish', 'Publish Mini Nationals results', 'Rankings and passports update together.', '/g/verify'],
  ],
}

export function roleOf(session) {
  if (!session) return 'public'
  if (session.kind === 'athlete') return 'athlete'
  return ORGS[session.id]?.kind === 'foundation' ? 'foundation' : 'federation'
}
export const guideKey = (session) => !session ? null : session.kind === 'athlete' ? 'athlete' : session.id

function GuideDock() {
  const { session, guide } = useStore()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const gk = guideKey(session)
  const steps = GUIDES[gk]
  if (!steps) return null
  const isDone = (k) => guide.includes(`${gk === 'athlete' ? 'athlete' : gk}:${k}`)
  const doneN = steps.filter(s => isDone(s[0])).length
  const next = steps.find(s => !isDone(s[0]))
  return (
    <aside className="fixed z-40 bottom-20 md:bottom-5 right-3 md:right-5 w-[min(340px,calc(100vw-24px))] rounded-2xl bg-ink text-white shadow-2xl overflow-hidden" aria-label="Demo guide">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 pt-3 pb-2 text-left" aria-expanded={open}>
        <span className="text-xs text-white/60">Demo guide, {doneN} of {steps.length} done</span>
        {open ? <ChevronDown className="size-5" /> : <ChevronUp className="size-5" />}
      </button>
      {!open && (next ? (
        <button onClick={() => nav(next[3])} className="w-full text-left px-4 pb-3 flex items-center gap-3">
          <span className="size-6 shrink-0 rounded-full border border-white/40 flex items-center justify-center text-xs font-bold">{steps.indexOf(next) + 1}</span>
          <span className="flex-1 text-sm font-semibold leading-snug">{next[1]}</span>
          <span className="text-xs font-bold text-[#E9C77B]">Go</span>
        </button>
      ) : <div className="px-4 pb-3 text-sm font-semibold">All done. Switch role from the menu to see the other side.</div>)}
      {open && (
        <ol className="px-2 pb-2 space-y-1">
          {steps.map(([k, title, sub, to], i) => {
            const d = isDone(k)
            return (
              <li key={k}>
                <button onClick={() => nav(to)} className="w-full text-left rounded-xl px-2.5 py-2 flex gap-3 hover:bg-white/10">
                  <span className={`size-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${d ? 'bg-grass' : 'border border-white/40'}`}>{d ? <Check className="size-4" /> : i + 1}</span>
                  <span><span className={`block text-sm font-semibold ${d ? 'text-white/60 line-through' : ''}`}>{title}</span><span className="block text-xs text-white/60 leading-snug">{sub}</span></span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </aside>
  )
}

export default function Shell({ children }) {
  const { session, me, org, signOut, reset, toast } = useStore()
  const nav = useNavigate()
  const [menu, setMenu] = useState(false)
  const role = roleOf(session)
  const items = NAVS[role]

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <div className="bg-ink text-white/80 text-xs text-center px-4 py-1.5">Demo with sample data. People are fictional; organisation notices, calls and figures are illustrative.</div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-[1120px] mx-auto px-4 h-16 flex items-center gap-4">
          <Logo />
          {session && <span className="hidden sm:inline-flex items-center rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-2">{role === 'athlete' ? 'Athlete view' : role === 'foundation' ? 'Foundation view' : org?.kind === 'state' ? 'State federation view' : 'National federation view'}</span>}
          <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Main">
            {items.map(([to, label, I]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `h-16 px-3 flex items-center gap-2 text-sm font-semibold border-b-[3px] ${isActive ? 'border-rope text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}><I className="size-4" />{label}</NavLink>
            ))}
            <NavLink to="/concept" className={({ isActive }) => `h-16 px-3 flex items-center gap-2 text-sm font-semibold border-b-[3px] ${isActive ? 'border-rope text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}><Lightbulb className="size-4" />Concept</NavLink>
          </nav>
          <div className="relative ml-auto md:ml-2">
            {session ? (
              <button onClick={() => setMenu(m => !m)} className="flex items-center gap-2 rounded-full hover:bg-paper p-1 pr-3" aria-haspopup="menu" aria-expanded={menu}>
                {me ? <Avatar person={me} size={32} /> : <OrgMark id={session.id} size={32} />}
                <span className="hidden lg:block text-sm font-semibold max-w-[140px] truncate">{me?.name || org?.short}</span>
              </button>
            ) : <Link to="/" className="h-10 px-4 rounded-full bg-deep text-white text-sm font-semibold inline-flex items-center">Try the demo</Link>}
            {menu && session && (
              <div className="absolute right-0 mt-2 w-64 card p-2 shadow-xl rise" role="menu" onMouseLeave={() => setMenu(false)}>
                <div className="p-3 border-b border-line mb-1"><div className="font-semibold">{me?.name || org?.name}</div><div className="text-xs text-ink-3">Signed in for this demo</div></div>
                <MenuItem icon={Repeat} onClick={() => { setMenu(false); signOut(); nav('/') }}>Switch role</MenuItem>
                <MenuItem icon={RotateCcw} onClick={() => { setMenu(false); reset(); nav('/') }}>Reset demo data</MenuItem>
                <MenuItem icon={LogOut} onClick={() => { setMenu(false); signOut(); nav('/') }}>Sign out</MenuItem>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line flex" aria-label="Main">
        {[...items, ['/concept', 'Concept', Lightbulb]].map(([to, label, I]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex-1 h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${isActive ? 'text-deep' : 'text-ink-3'}`}><I className="size-5" />{label.split(' ')[0]}</NavLink>
        ))}
      </nav>
      <GuideDock />
      {toast && <div key={toast.t} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rise rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold shadow-lg max-w-[92vw] text-center" role="status">{toast.msg}</div>}
    </div>
  )
}

function MenuItem({ icon: I, children, onClick }) {
  return <button role="menuitem" onClick={onClick} className="w-full flex items-center gap-2 px-3 h-10 rounded-lg text-sm hover:bg-paper text-left"><I className="size-4 text-ink-3" />{children}</button>
}
