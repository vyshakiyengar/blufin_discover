import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, Compass, HandCoins, Lightbulb, Search, LogOut, RotateCcw, UserRound } from 'lucide-react'
import { useStore } from '../store'
import { Avatar } from './ui'

export function Logo({ light = false }) {
  return (
    <Link to="/feed" className="flex items-center gap-2 shrink-0" aria-label="Blufin Discover home">
      <svg viewBox="0 0 64 64" className="size-9"><rect width="64" height="64" rx="14" fill={light ? '#fff' : '#0B3A5B'} /><path d="M14 42c8-2 14-10 18-24 3 10 9 18 18 22-10 0-22 2-36 2z" fill={light ? '#0B3A5B' : '#fff'} /><path d="M10 50h44" stroke="#E0453A" strokeWidth="4" strokeDasharray="4 4" /></svg>
      <span className={`leading-none ${light ? 'text-white' : 'text-deep'}`}>
        <span className="display text-[17px] block">Blufin</span>
        <span className="text-[11px] font-semibold tracking-wide block" style={{ fontVariationSettings: '"wdth" 112' }}>Discover</span>
      </span>
    </Link>
  )
}

const NAV = [
  ['/feed', 'Feed', Home],
  ['/discover', 'Discover', Compass],
  ['/opportunities', 'Opportunities', HandCoins],
  ['/concept', 'Concept', Lightbulb],
]

export default function Shell({ children }) {
  const { me, signOut, resetDemo, toast } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState(false)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="bg-ink text-white/85 text-xs text-center px-4 py-1.5">
        Demo with sample data. People are fictional; organisation posts and calls are illustrative, not real announcements.
      </div>
      <header className="sticky top-0 z-40 bg-white border-b border-line">
        <div className="max-w-[1180px] mx-auto px-4 h-16 flex items-center gap-3">
          <Logo />
          <form className="flex-1 max-w-sm relative" onSubmit={e => { e.preventDefault(); nav(`/discover?q=${encodeURIComponent(q)}`) }} role="search">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search athletes, coaches, foundations" aria-label="Search"
              className="w-full h-10 rounded-full bg-paper pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pool/40" />
          </form>
          <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Main">
            {NAV.map(([to, label, I]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `h-16 px-3 flex flex-col items-center justify-center gap-0.5 text-xs font-semibold border-b-[3px] ${isActive ? 'border-rope text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}>
                <I className="size-5" />{label}
              </NavLink>
            ))}
          </nav>
          <div className="relative ml-auto md:ml-2">
            {me ? (
              <button onClick={() => setMenu(m => !m)} className="flex items-center gap-2 rounded-full hover:bg-paper p-1 pr-2" aria-haspopup="menu" aria-expanded={menu}>
                <Avatar e={me} size={34} /><span className="hidden lg:block text-sm font-semibold max-w-[120px] truncate">{me.name.split(' ')[0]}</span>
              </button>
            ) : (
              <Link to="/" className="h-10 px-4 rounded-full bg-deep text-white text-sm font-semibold inline-flex items-center">Sign in</Link>
            )}
            {menu && me && (
              <div className="absolute right-0 mt-2 w-64 card p-2 shadow-lg rise" role="menu" onMouseLeave={() => setMenu(false)}>
                <div className="p-3 border-b border-line mb-1"><div className="font-semibold">{me.name}</div><div className="text-xs text-ink-3">Signed in for this demo</div></div>
                <MenuItem icon={UserRound} onClick={() => { setMenu(false); nav(`/u/${me.id}`) }}>View my profile</MenuItem>
                <MenuItem icon={RotateCcw} onClick={() => { setMenu(false); nav('/') }}>Switch demo account</MenuItem>
                <MenuItem icon={RotateCcw} onClick={() => { setMenu(false); resetDemo(); nav('/') }}>Reset demo data</MenuItem>
                <MenuItem icon={LogOut} onClick={() => { setMenu(false); signOut(); nav('/') }}>Sign out</MenuItem>
              </div>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line grid grid-cols-4" aria-label="Main">
        {NAV.map(([to, label, I]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${isActive ? 'text-deep' : 'text-ink-3'}`}>
            <I className="size-5" />{label}
          </NavLink>
        ))}
      </nav>
      {toast && <div key={toast.id} className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 rise rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold shadow-lg" role="status">{toast.msg}</div>}
    </div>
  )
}

function MenuItem({ icon: I, children, onClick }) {
  return <button role="menuitem" onClick={onClick} className="w-full flex items-center gap-2 px-3 h-10 rounded-lg text-sm hover:bg-paper text-left"><I className="size-4 text-ink-3" />{children}</button>
}
