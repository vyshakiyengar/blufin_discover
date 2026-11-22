// One graph for everyone in the demo: who they are, what is verified, who they are connected to.
import { ORGS } from '../data/orgs'
import { verifiedResults, allResults } from './eligibility'

export const GROUPS = [
  { key: 'athletes', label: 'Athletes', test: (e) => e.kind === 'athlete' },
  { key: 'coaches', label: 'Coaches', test: (e) => e.kind === 'coach' },
  { key: 'support', label: 'Support staff', test: (e) => ['physio', 'nutritionist', 'psychologist'].includes(e.kind) },
  { key: 'academies', label: 'Academies & gyms', test: (e) => e.kind === 'gym' },
  { key: 'foundations', label: 'Foundations', test: (e) => e.kind === 'foundation' },
  { key: 'federations', label: 'Federations', test: (e) => ['state', 'national', 'government'].includes(e.kind) },
]

export const KIND_LABEL = {
  athlete: 'Athlete', coach: 'Coach', physio: 'Physiotherapist', nutritionist: 'Nutritionist', psychologist: 'Sports psychologist',
  gym: 'Academy & gym', foundation: 'Foundation', state: 'State federation', national: 'National federation', government: 'Government programme',
}

// Which athletes a federation governs on the platform
export const FED_SCOPE = {
  ksa: (a) => a.represents === 'Karnataka' && ['Swimming', 'Para Swimming'].includes(a.sport),
  sfi: (a) => ['Swimming', 'Para Swimming'].includes(a.sport),
  bai: (a) => ['Badminton', 'Para Badminton'].includes(a.sport),
  pci: (a) => !!a.para,
  aai: (a) => a.sport === 'Archery',
  khelo: (a) => (a.ids || []).some(i => i.issuer === 'khelo') || (a.schemes || []).some(s => s.startsWith('Khelo')),
}

export function hrefOf(e) {
  if (e.kind === 'athlete') return `/p/${e.id}`
  if (ORGS[e.id]) return `/org/${e.id}`
  return `/team/${e.id}`
}

export function buildEntities(athletes, pros, gyms) {
  return [
    ...athletes.map(a => ({ ...a, kind: 'athlete' })),
    ...pros.map(p => ({ ...p, kind: p.role })),
    ...gyms.map(g => ({ ...g, kind: 'gym' })),
    ...Object.values(ORGS).filter(o => o.kind !== 'donor').map(o => ({ ...o, kind: o.kind, official: true, state: o.state || null })),
  ]
}

// What is verified about this profile, in one short line plus a strength (0 to 1)
export function verifiedLine(e) {
  if (e.kind === 'athlete') {
    const v = verifiedResults(e).length, all = allResults(e).length
    const parts = []
    if (e.dobVerified) parts.push(`age verified by ${ORGS[e.dobVerified.by]?.short || e.dobVerified.by}`)
    parts.push(`${v} of ${all} results verified`)
    return { text: parts.join(', '), strength: (e.dobVerified ? 0.4 : 0) + (all ? 0.6 * v / all : 0) }
  }
  if (e.credentials) {
    const v = e.credentials.filter(c => c.status === 'verified').length
    return { text: `${v} of ${e.credentials.length} ${e.kind === 'gym' ? 'checks' : 'credentials'} verified`, strength: v / e.credentials.length }
  }
  if (e.official) return { text: 'Official account', strength: 1 }
  return { text: 'Not verified yet', strength: 0 }
}

// Confirmed links between profiles
export function connectionsOf(e, ctx) {
  const { athletes, byId } = ctx
  const A = (a, note) => ({ id: a.id, name: a.name, href: `/p/${a.id}`, note, kind: 'athlete' })
  const P = (p, note) => p && ({ id: p.id, name: p.name, href: `/team/${p.id}`, note, kind: p.role })
  const O = (id, note) => ORGS[id] && ({ id, name: ORGS[id].name, href: `/org/${id}`, note, kind: 'org' })
  const groups = []
  if (e.kind === 'athlete') {
    const team = (e.team || []).map(([pid, role]) => P(byId[pid], role)).filter(Boolean)
    if (team.length) groups.push({ label: 'Team', items: team })
    if (e.trainsAt && byId[e.trainsAt]) groups.push({ label: 'Trains at', items: [P(byId[e.trainsAt], 'Academy')] })
    const backers = (e.backing || []).map(b => O(b.orgId, b.programme)).filter(Boolean)
    if (backers.length) groups.push({ label: 'Backed by', items: backers })
    const feds = Object.keys(FED_SCOPE).filter(f => FED_SCOPE[f](e)).map(f => O(f, 'Registered')).filter(Boolean)
    if (feds.length) groups.push({ label: 'Registered with', items: feds })
  } else if (['coach', 'physio', 'nutritionist', 'psychologist'].includes(e.kind)) {
    const ath = athletes.filter(a => (a.team || []).some(([pid]) => pid === e.id)).map(a => A(a, (a.team.find(([pid]) => pid === e.id) || [])[1]))
    if (ath.length) groups.push({ label: 'Athletes, confirmed by them', items: ath })
    if (e.worksAt && byId[e.worksAt]) groups.push({ label: 'Works at', items: [P(byId[e.worksAt], 'Academy')] })
  } else if (e.kind === 'gym') {
    const ath = athletes.filter(a => a.trainsAt === e.id).map(a => A(a, a.sport))
    if (ath.length) groups.push({ label: 'Athletes training here', items: ath })
    const staff = ctx.pros.filter(p => p.worksAt === e.id).map(p => P(p, p.role))
    if (staff.length) groups.push({ label: 'Coaches and staff', items: staff })
  } else if (e.kind === 'foundation') {
    const ath = athletes.filter(a => (a.backing || []).some(b => b.orgId === e.id)).map(a => A(a, a.backing.find(b => b.orgId === e.id).programme))
    if (ath.length) groups.push({ label: 'Athletes backed', items: ath })
  } else if (FED_SCOPE[e.id]) {
    const ath = athletes.filter(FED_SCOPE[e.id]).map(a => A(a, a.dobVerified ? 'Age verified' : 'Age not verified'))
    if (ath.length) groups.push({ label: 'Registered athletes', items: ath })
  }
  return groups
}

export const connectionCount = (e, ctx) => connectionsOf(e, ctx).reduce((n, g) => n + g.items.length, 0)
