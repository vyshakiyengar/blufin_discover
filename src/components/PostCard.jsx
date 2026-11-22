import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Share2, Play, CalendarClock, HandCoins, Megaphone, Newspaper, Trophy, Users, Dumbbell, Sparkles } from 'lucide-react'
import { useStore, timeAgo, daysLeft, fmtDate, inr, compact } from '../store'
import { Avatar, NameLink, MedalDisc, MEDAL, Chip, Progress, FollowButton } from './ui'
import { SportPattern } from './SportPattern'
import { OPP_TYPES } from '../data/opportunities'
import { POST_TYPES } from '../data/posts'
import { ROLE_LABELS } from '../data/entities'

const TYPE_ICON = { achievement: Trophy, funding_call: HandCoins, competition: CalendarClock, media: Newspaper, fundraising: HandCoins, backing: Sparkles, selection: Users, training: Dumbbell, update: Megaphone }

function Clap({ on }) {
  // A pair of hands, the "cheer" reaction
  return (
    <svg viewBox="0 0 24 24" className={`size-5 ${on ? 'pop' : ''}`} fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7.5 12.5 4.8 9.8a1.4 1.4 0 0 1 2-2l3.6 3.6" /><path d="m8.6 9.2-1.9-1.9a1.4 1.4 0 0 1 2-2l4.5 4.5" /><path d="m10.6 7.2-.9-.9a1.4 1.4 0 0 1 2-2l5.2 5.2c1.9 1.9 2.1 5.3-.2 7.6-2.4 2.4-5.9 2.3-8 .2l-3.5-3.5a1.4 1.4 0 0 1 2-2l1.4 1.4" /><path d="M15 3.2 15.6 1.6M18.2 4.4l1.3-1.1M19.4 7.4l1.6-.3" />
    </svg>
  )
}

export function ResultCard({ card, sport }) {
  const m = MEDAL[card.medal]
  return (
    <div className="relative overflow-hidden rounded-xl bg-deep text-white">
      <SportPattern sport={sport} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="relative p-5 sm:p-6 flex items-end justify-between gap-4 min-h-[170px]">
        <div className="min-w-0">
          <div className="text-sm text-white/75">{card.label}</div>
          <div className="display tabular text-[clamp(2.2rem,7vw,3.6rem)] mt-1 break-words">{card.big}</div>
          <div className="mt-2 text-sm text-white/85">{card.event}</div>
          {card.note && <div className="mt-3"><span className="rounded-full bg-rope px-2.5 py-1 text-xs font-bold">{card.note}</span></div>}
        </div>
        {m && <div className="shrink-0 flex flex-col items-center gap-1"><MedalDisc medal={card.medal} size={64} /><span className="text-xs font-semibold" style={{ color: 'white' }}>{m.label}</span></div>}
      </div>
    </div>
  )
}

function CardBody({ post, author }) {
  const card = post.card
  if (!card) return null
  if (card.kind === 'result') return <ResultCard card={card} sport={author.sport} />
  if (card.kind === 'headline') return (
    <div className="rounded-xl border border-line overflow-hidden">
      <div className="relative h-36 bg-[#3A1F27]"><SportPattern sport="track" className="absolute inset-0 h-full w-full" /></div>
      <div className="p-4"><div className="display-tight text-lg">{card.title}</div><div className="text-sm text-ink-3 mt-1">{card.source}, {card.read}</div></div>
    </div>
  )
  if (card.kind === 'video') return (
    <div className="relative rounded-xl overflow-hidden bg-[#0d2234] aspect-video text-white">
      <SportPattern sport={card.sport} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center"><span className="size-16 rounded-full bg-white/95 text-deep flex items-center justify-center"><Play className="size-7 ml-1" fill="currentColor" /></span></div>
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-end"><span className="font-semibold">{card.title}</span><span className="text-sm tabular">{card.duration}</span></div>
    </div>
  )
  if (card.kind === 'set') return (
    <div className="rounded-xl bg-pool-soft p-4">
      <div className="text-sm font-semibold text-deep mb-2">{card.label}</div>
      <ul className="space-y-1.5">{card.lines.map(l => <li key={l} className="display-tight text-base sm:text-lg text-deep tabular">{l}</li>)}</ul>
    </div>
  )
  if (card.kind === 'squad') return (
    <div className="rounded-xl border-2 border-deep p-4">
      <div className="lane-rope lane-rope-thin -mx-4 -mt-4 mb-4 rounded-t-lg" />
      <div className="display-tight text-lg">{card.title}</div>
      <div className="mt-2 flex flex-wrap gap-2">{card.names.map(n => <Chip key={n} tone="pool">{n}</Chip>)}</div>
    </div>
  )
  if (card.kind === 'stats') return (
    <div className="grid grid-cols-3 gap-2">{card.items.map(([n, l]) => (
      <div key={l} className="rounded-xl bg-paper p-3"><div className="display text-2xl text-deep">{n}</div><div className="text-xs text-ink-2 mt-1">{l}</div></div>
    ))}</div>
  )
  return null
}

export function OpportunityEmbed({ opp }) {
  const { byId, applications } = useStore()
  const org = byId[opp.orgId]
  const d = daysLeft(opp.deadline)
  const applied = applications[opp.id]
  return (
    <Link to={`/opportunities/${opp.id}`} className="block rounded-xl border border-line hover:border-pool transition-colors overflow-hidden">
      <div className="lane-rope lane-rope-thin" />
      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Chip tone={['funding', 'scholarship', 'grant'].includes(opp.type) ? 'grass' : opp.type === 'sponsorship' || opp.type === 'inkind' ? 'gold' : 'pool'}>{OPP_TYPES[opp.type]}</Chip>
          <Chip tone={d <= 14 ? 'rope' : 'default'}>{d > 0 ? `Closes in ${d} days` : 'Closed'}</Chip>
          {applied && <Chip tone="dark">Applied</Chip>}
        </div>
        <div className="display-tight text-lg mt-2">{opp.title}</div>
        <div className="text-sm text-ink-2 mt-1">{org?.name}{opp.amount ? `, ${opp.amount}` : ''}{opp.eventDate ? `, event on ${fmtDate(opp.eventDate, { day: 'numeric', month: 'short' })}` : ''}</div>
        <div className="mt-3 text-sm font-semibold text-deep">{applied ? 'View application' : opp.type === 'competition' || opp.type === 'trial' ? 'See details and enter' : 'See details and apply'}</div>
      </div>
    </Link>
  )
}

export function FundraiserEmbed({ athlete }) {
  const { donations } = useStore()
  const f = athlete.funding
  if (!f) return null
  const raised = f.raised + (donations[athlete.id] || 0)
  return (
    <Link to={`/u/${athlete.id}?tab=support`} className="block rounded-xl border border-line hover:border-grass p-4 transition-colors">
      <div className="text-sm text-ink-2">{f.purpose}</div>
      <div className="flex items-baseline justify-between mt-2 gap-2"><span className="display text-2xl tabular">{inr(raised)}</span><span className="text-sm text-ink-3 tabular">of {inr(f.goal)}</span></div>
      <div className="mt-2"><Progress value={raised} goal={f.goal} /></div>
      <div className="mt-2 text-sm text-ink-2">{f.backers + (donations[athlete.id] ? 1 : 0)} backers, itemised budget on profile</div>
    </Link>
  )
}

export default function PostCard({ post }) {
  const { byId, opportunities, toggleCheer, addComment, me, flash } = useStore()
  const author = byId[post.authorId]
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  if (!author) return null
  const opp = post.opportunityId && opportunities.find(o => o.id === post.opportunityId)
  const Icon = TYPE_ICON[post.type] || Megaphone
  const sub = author.role === 'athlete' ? [author.sport, author.classification].filter(Boolean).join(' ') : ROLE_LABELS[author.role]

  return (
    <article className="card overflow-hidden">
      <header className="flex items-start gap-3 p-4 pb-2">
        <Link to={`/u/${author.id}`} aria-label={author.name}><Avatar e={author} size={46} /></Link>
        <div className="min-w-0 flex-1">
          <NameLink e={author} />
          <div className="text-xs text-ink-3 truncate">{sub}, {author.city}</div>
          <div className="text-xs text-ink-3 mt-0.5 flex items-center gap-1"><Icon className="size-3.5" />{POST_TYPES[post.type]}, <time>{timeAgo(post.at)}</time></div>
        </div>
        <FollowButton id={author.id} size="sm" />
      </header>
      <div className="px-4 pb-3 text-[15px] leading-relaxed text-ink whitespace-pre-line">{post.text}</div>
      {post.mentions?.length > 0 && (
        <div className="px-4 pb-3 flex gap-2 flex-wrap">
          {post.mentions.map(id => byId[id] && <Link key={id} to={`/u/${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line pl-1 pr-3 py-1 text-sm hover:border-pool"><Avatar e={byId[id]} size={22} />{byId[id].name}</Link>)}
        </div>
      )}
      {(post.card || opp || post.fundraiserOf) && (
        <div className="px-4 pb-3 space-y-3">
          <CardBody post={post} author={author} />
          {opp && <OpportunityEmbed opp={opp} />}
          {post.fundraiserOf && byId[post.fundraiserOf] && <FundraiserEmbed athlete={byId[post.fundraiserOf]} />}
        </div>
      )}
      <div className="px-4 py-2 text-xs text-ink-3 flex justify-between">
        <span>{compact(post.cheerCount)} cheers</span>
        <button className="hover:underline" onClick={() => setOpen(o => !o)}>{post.comments.length} comments</button>
      </div>
      <footer className="border-t border-line grid grid-cols-3 text-sm font-semibold text-ink-2">
        <button onClick={() => me ? toggleCheer(post.id) : flash('Sign in to cheer')} aria-pressed={post.cheered}
          className={`h-11 flex items-center justify-center gap-2 hover:bg-paper ${post.cheered ? 'text-rope' : ''}`}><Clap on={post.cheered} />Cheer</button>
        <button onClick={() => setOpen(o => !o)} className="h-11 flex items-center justify-center gap-2 hover:bg-paper"><MessageCircle className="size-5" />Comment</button>
        <button onClick={() => { try { navigator.clipboard?.writeText(`${location.origin}/u/${author.id}`) } catch { /* ignore */ } flash('Profile link copied') }} className="h-11 flex items-center justify-center gap-2 hover:bg-paper"><Share2 className="size-5" />Share</button>
      </footer>
      {open && (
        <div className="border-t border-line bg-paper/60 p-4 space-y-3">
          {post.comments.map((cm, i) => byId[cm.authorId] && (
            <div key={i} className="flex gap-2">
              <Avatar e={byId[cm.authorId]} size={32} />
              <div className="bg-white rounded-xl px-3 py-2 text-sm border border-line"><NameLink e={byId[cm.authorId]} className="text-sm" /><div className="text-ink-2">{cm.text}</div></div>
            </div>
          ))}
          {me && (
            <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (text.trim()) { addComment(post.id, text.trim()); setText('') } }}>
              <Avatar e={me} size={32} />
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment" className="flex-1 h-9 rounded-full border border-line px-4 text-sm focus:outline-none focus:border-pool" />
              <button className="h-9 px-4 rounded-full bg-deep text-white text-sm font-semibold disabled:opacity-40" disabled={!text.trim()}>Post</button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
