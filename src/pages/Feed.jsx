import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Users } from 'lucide-react'
import { useStore, daysLeft, fmtDate, compact } from '../store'
import { Avatar, Verified, FollowButton, MedalDisc } from '../components/ui'
import { Cover } from '../components/SportPattern'
import PostCard from '../components/PostCard'
import Composer from '../components/Composer'
import { FEED_FILTERS } from '../data/posts'
import { ROLE_LABELS } from '../data/entities'

export const matchesMe = (opp, me) => me?.role === 'athlete' && (opp.sports.includes(me.sport) || opp.sports.includes('All sports'))

export function MiniProfile() {
  const { me } = useStore()
  if (!me) return null
  const medals = me.achievements ? ['gold', 'silver', 'bronze'].map(m => [m, me.achievements.filter(a => a.medal === m).length]) : null
  return (
    <div className="card overflow-hidden">
      <Cover sport={me.sport} role={me.role} className="h-16" />
      <div className="relative px-4 pb-4 -mt-7">
        <Link to={`/u/${me.id}`}><Avatar e={me} size={58} ring /></Link>
        <Link to={`/u/${me.id}`} className="block mt-2 font-bold hover:underline">{me.name} <Verified e={me} /></Link>
        <div className="text-sm text-ink-2 leading-snug">{me.headline}</div>
        {medals && (
          <div className="mt-3 flex gap-3">{medals.map(([m, n]) => <span key={m} className="flex items-center gap-1.5"><MedalDisc medal={m} size={20} /><span className="font-bold tabular">{n}</span></span>)}</div>
        )}
      </div>
      <div className="border-t border-line px-4 py-3 text-sm space-y-2">
        {me.profileViews != null && <div className="flex justify-between"><span className="text-ink-2 flex items-center gap-1.5"><Eye className="size-4" />Profile views</span><span className="font-bold tabular text-deep">{compact(me.profileViews)}</span></div>}
        <div className="flex justify-between"><span className="text-ink-2 flex items-center gap-1.5"><Users className="size-4" />Followers</span><span className="font-bold tabular text-deep">{compact(me.followers)}</span></div>
      </div>
      <div className="border-t border-line px-4 py-3"><Link to={`/u/${me.id}`} className="text-sm font-semibold text-pool hover:underline">View my profile</Link></div>
    </div>
  )
}

function RightRail() {
  const { me, opportunities, byId, entities, isFollowing } = useStore()
  const open = opportunities.filter(o => daysLeft(o.deadline) > 0)
  const mine = me?.role === 'athlete' ? open.filter(o => matchesMe(o, me)) : []
  const closing = [...open].filter(o => ['funding', 'scholarship', 'grant', 'sponsorship', 'inkind'].includes(o.type)).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4)
  const events = open.filter(o => o.eventDate).sort((a, b) => a.eventDate.localeCompare(b.eventDate)).slice(0, 4)
  const suggest = entities.filter(e => e.id !== me?.id && !isFollowing(e.id) && (e.featured || e.followers > 3000)).sort((a, b) => (me?.sport && b.sport === me.sport) - (me?.sport && a.sport === me.sport) || b.followers - a.followers).slice(0, 5)

  return (
    <div className="space-y-4">
      {mine.length > 0 && (
        <Link to="/opportunities?for=me" className="block rounded-[14px] bg-deep text-white p-4 overflow-hidden relative hover:bg-deep-2">
          <div className="display text-3xl tabular">{mine.length}</div>
          <div className="text-sm text-white/85 mt-1">open calls match your sport and results</div>
          <div className="mt-3 text-sm font-semibold underline underline-offset-4">See matches</div>
        </Link>
      )}
      <section className="card p-4">
        <h3 className="display-tight text-base mb-3">Funding calls closing soon</h3>
        <ul className="space-y-3">
          {closing.map(o => (
            <li key={o.id}>
              <Link to={`/opportunities/${o.id}`} className="flex gap-3 group">
                <Avatar e={byId[o.orgId]} size={36} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug group-hover:underline">{o.title}</span>
                  <span className="block text-xs text-ink-3">{byId[o.orgId]?.name}</span>
                  <span className={`block text-xs font-semibold mt-0.5 ${daysLeft(o.deadline) <= 14 ? 'text-rope' : 'text-ink-2'}`}>{daysLeft(o.deadline)} days left</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/opportunities" className="block mt-3 text-sm font-semibold text-pool hover:underline">All opportunities</Link>
      </section>
      <section className="card p-4">
        <h3 className="display-tight text-base mb-3">Upcoming competitions</h3>
        <ul className="space-y-3">
          {events.map(o => (
            <li key={o.id}>
              <Link to={`/opportunities/${o.id}`} className="flex gap-3 group">
                <span className="w-11 shrink-0 rounded-lg border border-line text-center py-1">
                  <span className="block text-[10px] font-semibold text-rope">{fmtDate(o.eventDate, { month: 'short' })}</span>
                  <span className="block display text-lg leading-none tabular">{fmtDate(o.eventDate, { day: 'numeric' })}</span>
                </span>
                <span className="min-w-0"><span className="block text-sm font-semibold leading-snug group-hover:underline">{o.title}</span><span className="block text-xs text-ink-3">{o.location}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="card p-4">
        <h3 className="display-tight text-base mb-3">People and organisations to follow</h3>
        <ul className="space-y-3">
          {suggest.map(e => (
            <li key={e.id} className="flex items-center gap-3">
              <Link to={`/u/${e.id}`}><Avatar e={e} size={38} /></Link>
              <span className="min-w-0 flex-1"><Link to={`/u/${e.id}`} className="block text-sm font-semibold truncate hover:underline">{e.name}</Link><span className="block text-xs text-ink-3 truncate">{e.role === 'athlete' ? e.sport : ROLE_LABELS[e.role]}</span></span>
              <FollowButton id={e.id} size="sm" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function Feed() {
  const { posts, myFollows, me } = useStore()
  const [filter, setFilter] = useState('all')
  const list = useMemo(() => {
    const f = FEED_FILTERS.find(x => x.key === filter)
    return posts.filter(p => {
      if (filter === 'following') return myFollows.includes(p.authorId) || p.authorId === me?.id
      if (f?.types) return f.types.includes(p.type)
      return true
    })
  }, [posts, filter, myFollows, me])

  return (
    <div className="max-w-[1180px] mx-auto px-3 sm:px-4 py-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_300px] md:grid-cols-[minmax(0,1fr)_280px]">
      <aside className="hidden lg:block"><div className="sticky top-[84px]"><MiniProfile /></div></aside>
      <div className="space-y-4 min-w-0">
        <Composer />
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter feed">
          {FEED_FILTERS.map(f => (
            <button key={f.key} role="tab" aria-selected={filter === f.key} onClick={() => setFilter(f.key)}
              className={`h-9 px-4 rounded-full text-sm font-semibold whitespace-nowrap border ${filter === f.key ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line hover:border-ink-3'}`}>{f.label}</button>
          ))}
        </div>
        {list.map(p => <PostCard key={p.id} post={p} />)}
        {list.length === 0 && <div className="card p-8 text-center text-ink-2">Nothing here yet. Follow more athletes and organisations from Discover.</div>}
        <div className="text-center text-sm text-ink-3 py-6">You're all caught up.</div>
      </div>
      <aside className="hidden md:block"><div className="sticky top-[84px]"><RightRail /></div></aside>
    </div>
  )
}

