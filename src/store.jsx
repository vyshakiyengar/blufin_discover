import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { SEED_ATHLETES, PROS, GYMS } from './data/people'
import { buildEntities } from './lib/ecosystem'
import { ORGS } from './data/orgs'
import { SEED_CIRCULARS } from './data/circulars'
import { SEED_CALLS, SEED_APPLICATIONS } from './data/calls'

const KEY = 'blufin-discover-v2'
export const TODAY = '2026-11-22'
export const NOW = new Date(TODAY + 'T18:00:00Z').getTime()

// Results a federation can publish in the demo. Publishing writes them, verified, onto passports.
export const RESULT_BATCHES = {
  ksa: {
    id: 'ksa-para-open-nov', orgId: 'ksa', event: 'KSA Para Swimming Open, Nov 2026, Bengaluru', date: '2026-11-21', level: 'State',
    rows: [
      { athleteId: 'meera', result: 'Gold, 50m Butterfly S9', medal: 'gold', mark: '29.84' },
      { athleteId: 'tejas', result: 'Gold, 100m Backstroke S7', medal: 'gold', mark: '1:29.60' },
      { athleteId: 'karthik', result: 'Gold, 100m Freestyle S10', medal: 'gold', mark: '57.12' },
      { athleteId: 'meera', result: 'Silver, 100m Freestyle S9', medal: 'silver', mark: '1:03.02' },
    ],
  },
  bai: {
    id: 'bai-mini-nationals', orgId: 'bai', event: 'Yonex-Sunrise 5th Mini National Championships 2026, Raipur', date: '2026-11-21', level: 'National',
    rows: [
      { athleteId: 'aarav', result: "Winner, Boys' Singles U-17", medal: 'gold', mark: '21-18, 21-15' },
      { athleteId: 'diya', result: "Runner-up, Girls' Singles U-15", medal: 'silver', mark: '' },
      { athleteId: 'meghna', result: "Winner, Girls' Doubles U-19", medal: 'gold', mark: '' },
    ],
  },
}

const initial = () => ({
  session: null,           // { kind: 'athlete' | 'org', id }
  added: {},               // athleteId -> [result]
  verdicts: {},            // resultId -> { status, by }
  published: [],           // batch ids
  certs: {},               // athleteId -> [cert]
  applications: {},        // callId -> { athleteId: app }
  circulars: [],           // published in the demo
  newCalls: [],            // calls created in the demo
  read: [],
  actions: {},             // `${circularId}:${athleteId}` -> label done
  watch: [],               // foundation watchlist
  invites: [],             // athleteIds invited to apply
  ageOk: {},               // athleteId -> 'bai'
  reminded: [],            // athleteIds reminded about UID
  cheers: [],
  follows: ['karthik', 'rahul', 'sana'],
  guide: [],               // completed guide steps
  toast: null,
})

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...initial(), ...JSON.parse(raw), toast: null } } catch { /* storage unavailable */ }
  return initial()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, setS] = useState(load)
  useEffect(() => { try { const { toast, ...rest } = s; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* ignore */ } }, [s])

  const athletes = useMemo(() => SEED_ATHLETES.map(a => {
    const added = (s.added[a.id] || []).map(r => {
      const v = s.verdicts[r.id]
      return v?.status === 'verified' ? { ...r, verifiedBy: v.by, source: 'published', pendingWith: null, justVerified: true } : v?.status === 'rejected' ? { ...r, rejected: true, pendingWith: null } : r
    })
    const fromBatches = s.published.flatMap(bid => {
      const b = Object.values(RESULT_BATCHES).find(x => x.id === bid)
      return b.rows.map((r, i) => ({ r, i })).filter(({ r }) => r.athleteId === a.id).map(({ r, i }) => ({ id: `${bid}-${i}`, event: b.event, level: b.level, date: b.date, result: r.result, medal: r.medal, mark: r.mark, verifiedBy: b.orgId, source: 'published', fresh: true }))
    })
    const results = [...added, ...fromBatches, ...(a.results || [])].sort((x, y) => y.date.localeCompare(x.date))
    const dobVerified = a.dobVerified || (s.ageOk[a.id] ? { by: s.ageOk[a.id], doc: 'Birth certificate (BAI format)' } : null)
    return { ...a, results, dobVerified, ageFlag: dobVerified ? null : a.ageFlag, certificates: [...(s.certs[a.id] || []), ...(a.certificates || [])] }
  }), [s.added, s.verdicts, s.published, s.ageOk, s.certs])

  const byId = useMemo(() => Object.fromEntries([...athletes, ...PROS, ...GYMS].map(x => [x.id, x])), [athletes])
  const entities = useMemo(() => buildEntities(athletes, PROS, GYMS), [athletes])
  const circulars = useMemo(() => [...s.circulars, ...SEED_CIRCULARS].sort((a, b) => b.date.localeCompare(a.date)), [s.circulars])
  const applications = useMemo(() => {
    const out = {}
    for (const call of [...s.newCalls, ...SEED_CALLS]) {
      const seeded = Object.fromEntries((SEED_APPLICATIONS[call.id] || []).map(x => [x.athleteId, x]))
      const extra = s.applications[call.id] || {}
      out[call.id] = { ...seeded }
      for (const [k, v] of Object.entries(extra)) out[call.id][k] = { ...(seeded[k] || {}), ...v }
    }
    return out
  }, [s.applications, s.newCalls])

  const session = s.session
  const me = session?.kind === 'athlete' ? byId[session.id] : null
  const org = session?.kind === 'org' ? ORGS[session.id] : null

  const flash = useCallback((msg) => {
    const t = Date.now()
    setS(x => ({ ...x, toast: { msg, t } }))
    setTimeout(() => setS(x => (x.toast?.t === t ? { ...x, toast: null } : x)), 3000)
  }, [])
  const done = (step) => setS(x => {
    const k = `${x.session?.kind === 'athlete' ? 'athlete' : x.session?.id}:${step}`
    return x.guide.includes(k) ? x : { ...x, guide: [...x.guide, k] }
  })

  const api = {
    ...s, athletes, byId, entities, pros: PROS, gyms: GYMS, circulars, applications, calls: [...s.newCalls, ...SEED_CALLS], me, org, flash, done,
    publishCall: (c) => { setS(x => ({ ...x, newCalls: [{ ...c, id: `call${Date.now()}` }, ...x.newCalls] })); flash('Call published. Eligible athletes see it on their Today page.') },
    signIn: (kind, id) => setS(x => ({ ...x, session: { kind, id } })),
    signOut: () => setS(x => ({ ...x, session: null })),
    reset: () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } setS(initial()) },

    addResult: (athleteId, r) => {
      const rid = `u${Date.now()}`
      setS(x => ({ ...x, added: { ...x.added, [athleteId]: [{ id: rid, source: 'self', verifiedBy: null, ...r }, ...(x.added[athleteId] || [])] } }))
      done('a-result')
      flash(r.pendingWith ? `Result added. Verification requested from ${ORGS[r.pendingWith]?.short || byId[r.pendingWith]?.name}.` : 'Result added as self-reported')
    },
    verify: (resultId, status, by) => {
      setS(x => ({ ...x, verdicts: { ...x.verdicts, [resultId]: { status, by } } }))
      done('f-verify')
      flash(status === 'verified' ? 'Verified. It now shows as verified on the athlete\'s passport.' : 'Marked as not matching your records')
    },
    publishBatch: (batch, issueCerts) => {
      setS(x => {
        const certs = { ...x.certs }
        if (issueCerts) for (const id of new Set(batch.rows.map(r => r.athleteId))) {
          const cid = `${batch.id}-${id}-cert`
          certs[id] = [{ id: cid, form: batch.level === 'National' ? 'Form 2' : 'State merit certificate', level: batch.level, issuer: batch.orgId, forEvent: batch.event, status: 'Issued' }, ...(certs[id] || []).filter(c => c.id !== cid)]
        }
        return { ...x, published: x.published.includes(batch.id) ? x.published : [...x.published, batch.id], certs }
      })
      done('f-publish')
      flash(`Results published to ${new Set(batch.rows.map(r => r.athleteId)).size} passports`)
    },
    publishCircular: (c) => {
      setS(x => ({ ...x, circulars: [{ ...c, id: `c${Date.now()}`, date: TODAY, fresh: true }, ...x.circulars] }))
      done('f-circular')
      flash('Circular published. Eligible athletes see it on their Today page.')
    },
    markRead: (cid) => setS(x => x.read.includes(cid) ? x : { ...x, read: [...x.read, cid] }),
    doAction: (cid, athleteId, label) => { setS(x => ({ ...x, actions: { ...x.actions, [`${cid}:${athleteId}`]: label } })); done('a-circular'); flash(label) },

    apply: (callId, athleteId, app) => {
      setS(x => ({ ...x, applications: { ...x.applications, [callId]: { ...(x.applications[callId] || {}), [athleteId]: { athleteId, stage: 'Applied', at: TODAY, ...app } } } }))
      done('a-apply')
      flash('Application sent. Your passport is the application.')
    },
    moveStage: (callId, athleteId, stage) => {
      setS(x => ({ ...x, applications: { ...x.applications, [callId]: { ...(x.applications[callId] || {}), [athleteId]: { ...(x.applications[callId]?.[athleteId] || {}), athleteId, stage } } } }))
      if (stage === 'Selected') done('fd-select')
      flash(`Moved to ${stage}`)
    },
    toggleWatch: (aid) => { setS(x => ({ ...x, watch: x.watch.includes(aid) ? x.watch.filter(i => i !== aid) : [...x.watch, aid] })); done('fd-scout') },
    invite: (aid) => { setS(x => ({ ...x, invites: x.invites.includes(aid) ? x.invites : [...x.invites, aid] })); flash('Invitation sent. It appears on the athlete\'s Today page.') },
    approveAge: (aid, by) => { setS(x => ({ ...x, ageOk: { ...x.ageOk, [aid]: by } })); done('f-age'); flash('Age proof accepted. Entries are unblocked.') },
    remind: (aids) => { setS(x => ({ ...x, reminded: [...new Set([...x.reminded, ...aids])] })); done('f-remind'); flash(`Reminder sent to ${aids.length} swimmer${aids.length === 1 ? '' : 's'} and their clubs`) },
    toggleCheer: (rid) => setS(x => ({ ...x, cheers: x.cheers.includes(rid) ? x.cheers.filter(i => i !== rid) : [...x.cheers, rid] })),
    toggleFollow: (aid) => setS(x => ({ ...x, follows: x.follows.includes(aid) ? x.follows.filter(i => i !== aid) : [...x.follows, aid] })),
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

export const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => new Date(String(iso).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', opts)
export const daysLeft = (iso) => Math.ceil((new Date(iso + 'T23:59:59Z').getTime() - NOW) / 86400e3)
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const lakh = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L` : inr(n)
