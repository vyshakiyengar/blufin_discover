import { Link } from 'react-router-dom'
import { ShieldCheck, ShieldAlert, Shield, Check } from 'lucide-react'
import { Avatar, OrgMark, Chip, initials } from './ui'
import { verifiedLine, connectionsOf, KIND_LABEL } from '../lib/ecosystem'
import { useStore } from '../store'

export function EntityMark({ e, size = 44 }) {
  if (e.kind === 'athlete' || ['coach', 'physio', 'nutritionist', 'psychologist'].includes(e.kind)) return <Avatar person={e} size={size} />
  if (e.kind === 'gym') return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center font-bold text-white" style={{ width: size, height: size, borderRadius: size * 0.22, background: '#3F5F2A', fontSize: size * 0.32, fontVariationSettings: '"wdth" 100' }}>{initials(e.name)}</span>
  )
  return <OrgMark id={e.id} size={size} />
}

export function VerifiedBadge({ e }) {
  const v = verifiedLine(e)
  if (e.official) return <Chip tone="grass"><ShieldCheck className="size-3.5" />Official account</Chip>
  if (v.strength >= 0.75) return <Chip tone="grass"><ShieldCheck className="size-3.5" />Verified</Chip>
  if (v.strength > 0) return <Chip tone="amber"><ShieldAlert className="size-3.5" />Partly verified</Chip>
  return <Chip><Shield className="size-3.5" />Not verified yet</Chip>
}

export function ConnectionsPanel({ e, compact }) {
  const ctx = useStore()
  const groups = connectionsOf(e, ctx)
  if (!groups.length) return <div className="text-sm text-ink-3">No confirmed connections yet.</div>
  return (
    <div className={compact ? 'space-y-4' : 'grid md:grid-cols-2 gap-4'}>
      {groups.map(g => (
        <section key={g.label} className="rounded-xl border border-line bg-white p-4">
          <h3 className="text-sm font-semibold text-ink-3 mb-3">{g.label}</h3>
          <ul className="space-y-2.5">
            {g.items.map(it => {
              const target = ctx.entities.find(x => x.id === it.id)
              return (
                <li key={it.id + (it.note || '')}>
                  <Link to={it.href} className="flex items-center gap-3 rounded-lg -m-1.5 p-1.5 hover:bg-paper">
                    {target && <EntityMark e={target} size={36} />}
                    <span className="min-w-0 flex-1"><span className="font-semibold block truncate">{it.name}</span>{it.note && <span className="text-xs text-ink-3 block truncate">{it.note}</span>}</span>
                    <span className="text-grass" title="Confirmed by both sides"><Check className="size-4" aria-label="Confirmed" /></span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function EntityCard({ e, actions }) {
  const ctx = useStore()
  const v = verifiedLine(e)
  const groups = connectionsOf(e, ctx)
  const count = groups.reduce((n, g) => n + g.items.length, 0)
  const sub = e.kind === 'athlete' ? [e.sport, e.classification?.cls].filter(Boolean).join(' ') : e.sport
  const href = e.kind === 'athlete' ? `/p/${e.id}` : e.official ? `/org/${e.id}` : `/team/${e.id}`
  return (
    <div className="card p-4 flex flex-col gap-3 hover:border-deep transition-colors">
      <Link to={href} className="flex items-start gap-3">
        <EntityMark e={e} size={48} />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-ink-3">{KIND_LABEL[e.kind]}</span>
          <span className="block font-bold leading-snug">{e.name}</span>
          <span className="block text-sm text-ink-2 truncate">{[sub, e.city].filter(Boolean).join(', ')}</span>
        </span>
      </Link>
      <div className="flex flex-wrap items-center gap-2"><VerifiedBadge e={e} />{!e.official && <span className="text-xs text-ink-3">{v.text}</span>}</div>
      {count > 0 && (
        <div className="text-sm text-ink-2 border-t border-line pt-3">
          <span className="font-semibold tabular">{count}</span> confirmed connection{count === 1 ? '' : 's'}
          <span className="text-ink-3">: {groups.flatMap(g => g.items).slice(0, 2).map(i => i.name).join(', ')}{count > 2 ? ' and more' : ''}</span>
        </div>
      )}
      {actions}
    </div>
  )
}
