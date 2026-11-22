import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, UserCheck, CircleDashed, X } from 'lucide-react'
import { ORGS } from '../data/orgs'

export function initials(name = '') {
  const parts = name.replace(/^Dr\.\s*/, '').split(/\s+/).filter(w => /^[A-Z]/.test(w))
  return (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
}

const PERSON_TINTS = [['#0E3B43', '#DCEEEC'], ['#1F4E7A', '#E1EBF5'], ['#6B3A12', '#F4E6D8'], ['#4B2F7A', '#ECE5F6'], ['#1F5F3A', '#DFF0E6']]
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export function Avatar({ person, size = 40, ring }) {
  if (!person) return null
  const [fg, bg] = PERSON_TINTS[hash(person.id) % PERSON_TINTS.length]
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold select-none ${ring ? 'ring-4 ring-white' : ''}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36, fontVariationSettings: '"wdth" 112' }}>
      {initials(person.name)}
    </span>
  )
}

const ORG_COLORS = { foundation: '#0E3B43', state: '#7A3B12', national: '#1F3F7A', government: '#2E5F3A', donor: '#3D4B56' }
export function OrgMark({ id, size = 40 }) {
  const o = ORGS[id]
  if (!o) return null
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center font-bold text-white select-none"
      style={{ width: size, height: size, borderRadius: size * 0.22, background: ORG_COLORS[o.kind] || '#12202B', fontSize: size * (o.short.length > 4 ? 0.24 : 0.32), fontVariationSettings: '"wdth" 90' }}>
      {o.short.length > 5 ? initials(o.name) : o.short}
    </span>
  )
}

export function PersonLink({ person, className = '' }) {
  if (!person) return null
  const to = person.role ? `/team/${person.id}` : `/p/${person.id}`
  return <Link to={to} className={`font-semibold text-ink hover:underline underline-offset-2 ${className}`}>{person.name}</Link>
}

export const MEDAL = {
  gold: { label: 'Gold', fg: 'var(--color-gold)', bg: 'var(--color-gold-soft)' },
  silver: { label: 'Silver', fg: 'var(--color-silver)', bg: 'var(--color-silver-soft)' },
  bronze: { label: 'Bronze', fg: 'var(--color-bronze)', bg: 'var(--color-bronze-soft)' },
}

export function MedalDisc({ medal, size = 24 }) {
  const m = MEDAL[medal]
  if (!m) return <span className="inline-block rounded-full border-2 border-dashed border-line shrink-0" style={{ width: size, height: size }} aria-hidden />
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={`${m.label} medal`} className="shrink-0">
      <circle cx="16" cy="16" r="15" fill={m.fg} />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      <path d="M16 9.5l1.9 4 4.4.5-3.3 3 .9 4.3-3.9-2.2-3.9 2.2.9-4.3-3.3-3 4.4-.5z" fill="#fff" fillOpacity=".85" />
    </svg>
  )
}

export function Chip({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-paper text-ink-2', teal: 'bg-pool-soft text-deep', rope: 'bg-rope-soft text-rope', grass: 'bg-grass-soft text-grass',
    amber: 'bg-amber-soft text-amber', gold: 'bg-gold-soft text-[#6E4F0E]', dark: 'bg-ink text-white', outline: 'border border-line text-ink-2 bg-white',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tones[tone]} ${className}`}>{children}</span>
}

// How we know a result happened. This is the heart of the product.
export function SourceTag({ r }) {
  if (r.verifiedBy) return <Chip tone="grass"><ShieldCheck className="size-3.5" />Verified by {ORGS[r.verifiedBy]?.short || r.verifiedBy}</Chip>
  if (r.source === 'cosigned') return <Chip tone="teal"><UserCheck className="size-3.5" />Co-signed by coach</Chip>
  if (r.rejected) return <Chip tone="rope"><X className="size-3.5" />Not matched by organiser</Chip>
  if (r.pendingWith) return <Chip tone="amber"><Clock className="size-3.5" />Awaiting {ORGS[r.pendingWith]?.short || 'coach'}</Chip>
  return <Chip><CircleDashed className="size-3.5" />Self-reported</Chip>
}

export function Progress({ value, goal, tone = 'grass' }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div className="h-2 w-full rounded-full bg-paper overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${tone === 'grass' ? 'bg-grass' : tone === 'amber' ? 'bg-amber' : 'bg-deep'}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Ring({ pct, size = 56, label }) {
  const r = 22, c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`${pct}% ${label || ''}`}>
      <svg viewBox="0 0 52 52" width={size} height={size} className="-rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <span className="absolute text-[13px] font-bold tabular">{pct}%</span>
    </span>
  )
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`rise w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 border-b border-line flex items-center justify-between px-5 py-3.5">
          <h2 className="display-tight text-lg pr-4">{title}</h2>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-paper text-ink-2 inline-flex items-center justify-center" aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-3 mt-1">{hint}</span>}
    </label>
  )
}
export const inputCls = 'w-full h-11 rounded-lg border border-line bg-white px-3 placeholder:text-ink-3 focus:outline-none focus:border-pool focus:ring-2 focus:ring-pool/25'

export function Btn({ children, kind = 'primary', className = '', ...p }) {
  const k = {
    primary: 'bg-deep text-white hover:bg-deep-2', ghost: 'border border-line bg-white hover:border-ink-3', go: 'bg-grass text-white hover:brightness-95',
    soft: 'bg-pool-soft text-deep hover:brightness-95', danger: 'border border-rope/40 text-rope bg-white hover:bg-rope-soft',
  }
  return <button {...p} className={`h-10 px-4 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-40 ${k[kind]} ${className}`}>{children}</button>
}

export function SectionTitle({ children, aside }) {
  return <div className="flex items-end justify-between gap-3 mb-3"><h2 className="display-tight text-lg">{children}</h2>{aside}</div>
}

export function Empty({ children }) { return <div className="rounded-xl border border-dashed border-line p-6 text-center text-ink-2 text-sm">{children}</div> }
