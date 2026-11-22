// Eligibility is computed from the passport, not self-declared.

const year = (d) => Number(String(d).slice(0, 4))
const LEVEL_RANK = { International: 5, National: 4, 'Khelo India': 4, State: 3, University: 2, School: 1, District: 1 }

export function allResults(a) {
  const intl = (a.stamps || []).map(s => ({ ...s, level: 'International' }))
  return [...intl, ...(a.results || [])]
}
export const verifiedResults = (a) => allResults(a).filter(r => r.verifiedBy)

function sportOk(a, sports) { return !sports || sports.includes(a.sport) }

function requirementCheck(a, req) {
  const r = req.toLowerCase()
  if (r.includes('sfi uid')) {
    const id = a.ids?.find(i => i.label === 'SFI UID')
    if (!id) return { ok: false, detail: 'No SFI UID on your passport' }
    return id.valid ? { ok: true, detail: `${id.value}, valid for ${id.season}` } : { ok: false, detail: `${id.value} expired (${id.season}). Renew before entering.` }
  }
  if (r.includes('bai player id')) {
    const id = a.ids?.find(i => i.label === 'BAI Player ID')
    return id ? { ok: true, detail: id.value } : { ok: false, detail: 'No BAI Player ID yet' }
  }
  if (r.includes('age proof') || r.includes('birth certificate')) {
    if (a.dobVerified) return { ok: true, detail: `Verified by ${a.dobVerified.by.toUpperCase()}` }
    return { ok: false, detail: a.ageFlag || 'Date of birth not yet verified' }
  }
  if (r.includes('classification')) {
    if (!a.para) return { ok: null, detail: 'Not applicable' }
    return a.classification ? { ok: true, detail: `${a.classification.cls}, international status ${a.classification.status}` } : { ok: false, detail: 'No classification on file' }
  }
  if (r.includes('bwf id')) {
    const id = a.ids?.find(i => i.label === 'BWF ID')
    return id ? { ok: true, detail: id.value } : { ok: false, detail: 'No BWF ID' }
  }
  if (r.includes('born on or after')) {
    const y = Number(r.match(/(\d{4})/)?.[1])
    const by = a.dob ? year(a.dob) : 2026 - a.age
    return by >= y ? { ok: true, detail: `Born ${by}` } : { ok: false, detail: `Born ${by}` }
  }
  return { ok: null, detail: 'Check yourself' }
}

export function circularFit(c, a) {
  if (!a || a.kind) return null
  const aud = c.audience || {}
  const basics = [
    sportOk(a, aud.sports),
    !aud.states || aud.states.includes(a.represents || a.state),
    aud.para === undefined || aud.para === !!a.para,
    !aud.gender || aud.gender === a.gender,
    !aud.ages || (a.age >= aud.ages[0] && a.age <= aud.ages[1]),
  ]
  const forYou = basics.every(Boolean)
  const checks = (c.requirements || []).map(req => ({ label: req, ...requirementCheck(a, req) }))
  const blocking = checks.filter(x => x.ok === false)
  return { forYou, checks, blocking }
}

const TESTS = {
  any: () => ({ ok: true }),
  para: (a) => ({ ok: !!a.para, detail: a.para ? `${a.sport}, ${a.classification?.cls || ''}`.trim() : 'Not a para athlete' }),
  paraSport: (a, sport) => ({ ok: a.sport === sport && !!a.classification, detail: a.classification ? `${a.classification.cls}, international status ${a.classification.status}` : 'No classification' }),
  medalSince: (a, { level, year: y }) => {
    const hit = [...allResults(a)].sort((p, q) => q.date.localeCompare(p.date)).find(r => r.medal && LEVEL_RANK[r.level] >= LEVEL_RANK[level] && year(r.date) >= y)
    return { ok: !!hit, detail: hit ? `${hit.result} (${year(hit.date)})` : `No ${level.toLowerCase()} medal since ${y}` }
  },
  levelSince: (a, { level, year: y }) => {
    const hit = [...allResults(a)].sort((p, q) => q.date.localeCompare(p.date)).find(r => LEVEL_RANK[r.level] >= LEVEL_RANK[level] && year(r.date) >= y)
    return { ok: !!hit, detail: hit ? `${hit.result}, ${hit.event || ''}`.replace(/, $/, '') : `No ${level.toLowerCase()} result since ${y}` }
  },
  ageRange: (a, [lo, hi]) => ({ ok: a.age >= lo && a.age <= hi, detail: `Age ${a.age}` }),
  dobVerified: (a) => ({ ok: !!a.dobVerified, detail: a.dobVerified ? `Verified by ${a.dobVerified.by.toUpperCase()}` : 'Not verified yet' }),
  notBackedBy: (a, org) => ({ ok: !(a.backing || []).some(b => b.orgId === org), detail: (a.backing || []).some(b => b.orgId === org) ? 'Already supported' : 'No current support' }),
  intlOrTop3: (a) => {
    const ok = (a.stamps || []).length > 0 || (a.rankings || []).some(r => r.rank <= 3)
    return { ok, detail: ok ? 'International result or top-3 ranking on passport' : 'Neither on passport yet' }
  },
}

export function callFit(call, a) {
  if (!a || a.kind) return null
  const checks = call.criteria.map(c => ({ label: c.label, ...(TESTS[c.test]?.(a, c.arg) || { ok: null }) }))
  const met = checks.filter(c => c.ok).length
  return { checks, met, total: checks.length, eligible: checks.every(c => c.ok !== false) }
}

// What a reviewer sees about the strength of evidence behind an application
export function evidence(a, app = {}) {
  const v = verifiedResults(a)
  return [
    { label: 'Age verified', ok: !!a.dobVerified },
    { label: `${v.length} verified result${v.length === 1 ? '' : 's'}`, ok: v.length > 0 },
    { label: `${(a.stamps || []).length} international`, ok: (a.stamps || []).length > 0 },
    a.para ? { label: `Class status: ${a.classification?.status || 'none'}`, ok: ['Confirmed', 'Review'].includes(a.classification?.status), warn: a.classification?.status === 'New' } : null,
    { label: 'Coach endorsement', ok: !!app.coach },
    { label: 'Video', ok: !!app.video },
  ].filter(Boolean)
}

export function completeness(a) {
  const v = verifiedResults(a)
  const all = allResults(a)
  const items = [
    { label: 'Date of birth verified by a federation', ok: !!a.dobVerified },
    { label: 'Federation IDs valid this season', ok: (a.ids || []).length > 0 && a.ids.every(i => i.valid) },
    ...(a.para ? [{ label: 'International classification confirmed', ok: a.classification?.status === 'Confirmed', detail: a.classification && a.classification.status !== 'Confirmed' ? `status ${a.classification.status}` : undefined }] : []),
    { label: 'Results verified at the source', ok: all.length > 0 && v.length / all.length >= 0.8, detail: `${v.length} of ${all.length}` },
    { label: 'Sports-quota certificates (Form 1 to 4)', ok: (a.certificates || []).length > 0 },
    { label: 'Coach and support team linked', ok: (a.team || []).length > 0 },
    { label: 'Season plan and budget', ok: !!a.season },
  ]
  return { items, pct: Math.round((items.filter(i => i.ok).length / items.length) * 100) }
}
