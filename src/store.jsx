import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { SEED_ENTITIES } from './data/entities'
import { SEED_POSTS } from './data/posts'
import { SEED_OPPORTUNITIES } from './data/opportunities'

const KEY = 'blufin-discover-demo-v1'
export const NOW = new Date('2026-11-22T20:00:00+00:00').getTime()

const DEFAULT_FOLLOWS = ['blufin', 'gosports', 'ogq', 'pci', 'sfi', 'c_arjun', 'karthik', 'aditya', 'rahul', 'tanvi', 'podium', 'thangam', 'n_kiran', 'p_sid', 'g_lanesix']

const initial = () => ({
  userId: null,
  follows: {},           // userId -> [ids]
  cheers: [],            // postIds cheered by current user
  extraAchievements: {}, // entityId -> [achievement]
  userPosts: [],
  extraComments: {},     // postId -> [comment]
  applications: {},      // oppId -> { at, status }
  donations: {},         // athleteId -> amount added
  customEntities: [],
  toast: null,
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw), toast: null }
  } catch { /* storage unavailable */ }
  return initial()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [s, setS] = useState(load)

  useEffect(() => {
    try { const { toast, ...rest } = s; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* ignore */ }
  }, [s])

  const entities = useMemo(() => {
    const all = [...SEED_ENTITIES, ...s.customEntities]
    return all.map(e => e.role === 'athlete'
      ? { ...e, achievements: [...(s.extraAchievements[e.id] || []), ...(e.achievements || [])].sort((a, b) => b.date.localeCompare(a.date)) }
      : e)
  }, [s.customEntities, s.extraAchievements])

  const byId = useMemo(() => Object.fromEntries(entities.map(e => [e.id, e])), [entities])

  const posts = useMemo(() => {
    const seeded = SEED_POSTS.map(p => ({ ...p, at: NOW - p.hoursAgo * 3600e3 }))
    return [...s.userPosts, ...seeded].map(p => ({
      ...p,
      comments: [...(p.comments || []), ...(s.extraComments[p.id] || [])],
      cheered: s.cheers.includes(p.id),
      cheerCount: (p.cheers || 0) + (s.cheers.includes(p.id) ? 1 : 0),
    })).sort((a, b) => b.at - a.at)
  }, [s.userPosts, s.cheers, s.extraComments])

  const me = s.userId ? byId[s.userId] : null
  const myFollows = s.userId ? (s.follows[s.userId] ?? (s.userId === 'meera' ? DEFAULT_FOLLOWS : ['blufin'])) : []

  const flash = useCallback((msg) => {
    setS(x => ({ ...x, toast: { msg, id: Date.now() } }))
    setTimeout(() => setS(x => (x.toast && Date.now() - x.toast.id > 2400 ? { ...x, toast: null } : x)), 2600)
  }, [])

  const api = {
    ...s, entities, byId, posts, me, myFollows,
    opportunities: SEED_OPPORTUNITIES,
    signIn: (id) => setS(x => ({ ...x, userId: id })),
    signOut: () => setS(x => ({ ...x, userId: null })),
    isFollowing: (id) => myFollows.includes(id),
    toggleFollow: (id) => {
      if (!s.userId) return
      const cur = myFollows
      const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
      setS(x => ({ ...x, follows: { ...x.follows, [s.userId]: next } }))
      flash(cur.includes(id) ? `Unfollowed ${byId[id]?.name}` : `Following ${byId[id]?.name}`)
    },
    toggleCheer: (postId) => setS(x => ({ ...x, cheers: x.cheers.includes(postId) ? x.cheers.filter(p => p !== postId) : [...x.cheers, postId] })),
    addComment: (postId, text) => setS(x => ({ ...x, extraComments: { ...x.extraComments, [postId]: [...(x.extraComments[postId] || []), { authorId: x.userId, text }] } })),
    addPost: (post) => setS(x => ({ ...x, userPosts: [{ id: `u${Date.now()}`, authorId: x.userId, at: NOW + 60e3 + x.userPosts.length * 1000, cheers: 0, comments: [], ...post }, ...x.userPosts] })),
    addAchievement: (entityId, a, share) => {
      const achievement = { id: `ua${Date.now()}`, ...a }
      setS(x => {
        const next = { ...x, extraAchievements: { ...x.extraAchievements, [entityId]: [achievement, ...(x.extraAchievements[entityId] || [])] } }
        if (share) {
          next.userPosts = [{
            id: `u${Date.now()}`, authorId: entityId, at: NOW + 60e3 + x.userPosts.length * 1000, type: 'achievement', cheers: 0, comments: [],
            text: share,
            card: { kind: 'result', big: a.result || (a.medal ? a.medal[0].toUpperCase() + a.medal.slice(1) : 'Result'), label: a.title, medal: a.medal, event: `${a.event}${a.location ? ', ' + a.location : ''}` },
          }, ...x.userPosts]
        }
        return next
      })
      flash(share ? 'Result added and shared to your feed' : 'Result added to your medal cabinet')
    },
    apply: (oppId) => { setS(x => ({ ...x, applications: { ...x.applications, [oppId]: { at: NOW, status: 'Submitted' } } })); flash('Application submitted with your profile') },
    donate: (athleteId, amount) => { setS(x => ({ ...x, donations: { ...x.donations, [athleteId]: (x.donations[athleteId] || 0) + amount } })); flash(`Pledged ₹${amount.toLocaleString('en-IN')}`) },
    createAthlete: (data) => {
      const id = `me_${Date.now()}`
      const e = {
        id, role: 'athlete', handle: data.name.toLowerCase().replace(/[^a-z]+/g, '.'), verified: false,
        followers: 0, following: 1, profileViews: 0, backedBy: [], coachedBy: [], supportTeam: [], achievements: [],
        personalBests: [], rankings: [], openTo: [], bio: '', ...data,
        headline: data.headline || `${data.sport} athlete from ${data.city}`,
      }
      setS(x => ({ ...x, customEntities: [...x.customEntities, e], userId: id, follows: { ...x.follows, [id]: ['blufin', 'gosports', 'ogq', 'pci', 'podium'] } }))
      return id
    },
    resetDemo: () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } setS(initial()) },
    flash,
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

export const timeAgo = (at) => {
  const h = Math.max(0, (NOW - at) / 3600e3)
  if (h < 0.05) return 'Just now'
  if (h < 1) return `${Math.round(h * 60)}m`
  if (h < 24) return `${Math.round(h)}h`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.round(d / 7)}w`
}

export const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', opts)

export const daysLeft = (iso) => Math.ceil((new Date(iso + 'T23:59:59').getTime() - NOW) / 86400e3)

export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const compact = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n)
