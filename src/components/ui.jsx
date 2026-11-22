import { Link } from 'react-router-dom'
import { BadgeCheck, Check, Plus } from 'lucide-react'
import { useStore } from '../store'
import { ROLE_LABELS } from '../data/entities'

const PERSON_ROLES = ['athlete', 'coach', 'nutritionist', 'physio', 'psychologist']
export const isPerson = (e) => PERSON_ROLES.includes(e.role)

const ROLE_TINT = {
  athlete: ['#0B3A5B', '#DDF0F4'], coach: ['#2E8B57', '#DFF1E6'], nutritionist: ['#8A5A00', '#F7EBCD'],
  physio: ['#6B3FA0', '#EEE6F8'], psychologist: ['#6B3FA0', '#EEE6F8'], gym: ['#A8653A', '#F2E1D5'],
  foundation: ['#FFFFFF', '#0B3A5B'], federation: ['#FFFFFF', '#12507A'], committee: ['#FFFFFF', '#1C93AE'],
  government: ['#FFFFFF', '#2E6E4F'], brand: ['#FFFFFF', '#3E4C5C'], media: ['#FFFFFF', '#E0453A'],
}
export const roleTint = (role) => ROLE_TINT[role] || ROLE_TINT.athlete

export function initials(name) {
  const parts = name.replace(/^Dr\.\s*/, '').split(/\s+/).filter(w => /^[A-Z]/.test(w))
  return (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
}

export function Avatar({ e, size = 44, ring = false }) {
  if (!e) return null
  const [fg, bg] = roleTint(e.role)
  const person = isPerson(e)
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center font-bold select-none ${ring ? 'ring-4 ring-white' : ''}`}
      style={{ width: size, height: size, borderRadius: person ? '999px' : size * 0.26, background: bg, color: fg, fontSize: size * 0.36, fontVariationSettings: '"wdth" 112' }}
    >
      {initials(e.name)}
    </span>
  )
}

export function Verified({ e, className = '' }) {
  if (!e?.verified) return null
  return <BadgeCheck aria-label="Verified profile" className={`inline size-4 text-pool shrink-0 ${className}`} />
}

export function NameLink({ e, className = '' }) {
  if (!e) return null
  return (
    <Link to={`/u/${e.id}`} className={`font-semibold text-ink hover:underline underline-offset-2 inline-flex items-center gap-1 ${className}`}>
      {e.name}<Verified e={e} />
    </Link>
  )
}

export function RoleTag({ e }) {
  const label = e.role === 'athlete' && e.para ? `Para athlete` : ROLE_LABELS[e.role]
  return <span className="text-xs text-ink-3">{label}</span>
}

export function FollowButton({ id, size = 'md' }) {
  const { me, isFollowing, toggleFollow } = useStore()
  if (!me || me.id === id) return null
  const on = isFollowing(id)
  const pad = size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4'
  return (
    <button
      onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); toggleFollow(id) }}
      aria-pressed={on}
      className={`${pad} inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors ${on ? 'bg-white text-ink border border-line hover:border-ink-3' : 'bg-deep text-white hover:bg-deep-2'}`}
    >
      {on ? <Check className="size-4" /> : <Plus className="size-4" />}{on ? 'Following' : 'Follow'}
    </button>
  )
}

export const MEDAL = {
  gold: { label: 'Gold', fg: 'var(--color-gold)', bg: 'var(--color-gold-soft)' },
  silver: { label: 'Silver', fg: 'var(--color-silver)', bg: 'var(--color-silver-soft)' },
  bronze: { label: 'Bronze', fg: 'var(--color-bronze)', bg: 'var(--color-bronze-soft)' },
}

export function MedalDisc({ medal, size = 28 }) {
  const m = MEDAL[medal]
  if (!m) return <span className="inline-block rounded-full border-2 border-dashed border-line" style={{ width: size, height: size }} aria-hidden />
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label={`${m.label} medal`} role="img">
      <circle cx="16" cy="16" r="15" fill={m.fg} />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      <path d="M16 9.5l1.9 4 4.4.5-3.3 3 .9 4.3-3.9-2.2-3.9 2.2.9-4.3-3.3-3 4.4-.5z" fill="#fff" fillOpacity=".85" />
    </svg>
  )
}

export function Chip({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-paper text-ink-2', pool: 'bg-pool-soft text-deep', rope: 'bg-rope-soft text-rope',
    grass: 'bg-grass-soft text-grass', gold: 'bg-gold-soft text-[#7A5A10]', dark: 'bg-deep text-white',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>
}

export function Progress({ value, goal }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div className="h-2.5 w-full rounded-full bg-paper overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-grass" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`rise w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <h2 className="display-tight text-lg">{title}</h2>
            <button onClick={onClose} className="size-9 rounded-full hover:bg-paper text-ink-2 text-xl" aria-label="Close">×</button>
          </div>
          <div className="lane-rope lane-rope-thin" />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ink mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-3 mt-1">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full h-11 rounded-lg border border-line bg-white px-3 text-ink placeholder:text-ink-3 focus:outline-none focus:border-pool focus:ring-2 focus:ring-pool/30'
