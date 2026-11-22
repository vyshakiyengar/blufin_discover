import { useState, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { MapPin, MessageSquare, Plus, ShieldCheck, Clock, Award, Briefcase, Building2, Target, Users, Timer } from 'lucide-react'
import { useStore, fmtDate, inr, compact, daysLeft } from '../store'
import { Avatar, Verified, FollowButton, MedalDisc, MEDAL, Chip, Progress, Modal, isPerson } from '../components/ui'
import { Cover } from '../components/SportPattern'
import PostCard, { OpportunityEmbed } from '../components/PostCard'
import AchievementModal from '../components/AchievementModal'
import { ROLE_LABELS } from '../data/entities'

function Section({ title, action, children }) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between mb-3 gap-3"><h2 className="display-tight text-lg">{title}</h2>{action}</div>
      {children}
    </section>
  )
}

function EntityRow({ e, note }) {
  if (!e) return null
  return (
    <Link to={`/u/${e.id}`} className="flex items-center gap-3 rounded-xl p-2 -m-2 hover:bg-paper">
      <Avatar e={e} size={42} />
      <span className="min-w-0"><span className="font-semibold flex items-center gap-1">{e.name}<Verified e={e} /></span><span className="block text-xs text-ink-3 truncate">{note || (e.role === 'athlete' ? `${e.sport}${e.classification ? ' ' + e.classification : ''}, ${e.city}` : ROLE_LABELS[e.role])}</span></span>
    </Link>
  )
}

function EntityGrid({ ids }) {
  const { byId } = useStore()
  return <div className="grid sm:grid-cols-2 gap-4">{ids.map(id => <EntityRow key={id} e={byId[id]} />)}</div>
}

function MedalCabinet({ achievements }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {['gold', 'silver', 'bronze'].map(m => {
        const n = achievements.filter(a => a.medal === m).length
        return (
          <div key={m} className="rounded-xl p-3 sm:p-4 flex items-center gap-3" style={{ background: MEDAL[m].bg }}>
            <MedalDisc medal={m} size={40} />
            <div><div className="display text-3xl tabular leading-none">{n}</div><div className="text-xs font-semibold text-ink-2 mt-1">{MEDAL[m].label}</div></div>
          </div>
        )
      })}
    </div>
  )
}

function ResultsTimeline({ achievements, editable, onAdd, title = 'Results', compact: isCompact, onSeeAll }) {
  const { byId } = useStore()
  const [level, setLevel] = useState('All')
  const levels = ['All', ...new Set(achievements.map(a => a.level))]
  const list = achievements.filter(a => level === 'All' || a.level === level)
  return (
    <Section title={title} action={editable && <button onClick={onAdd} className="h-9 px-4 rounded-full bg-deep text-white text-sm font-semibold inline-flex items-center gap-1.5"><Plus className="size-4" />Add result</button>}>
      {!isCompact && <div className="flex gap-2 mb-4 flex-wrap">{levels.map(l => <button key={l} onClick={() => setLevel(l)} aria-pressed={level === l} className={`h-8 px-3 rounded-full text-sm font-semibold border ${level === l ? 'bg-ink text-white border-ink' : 'border-line text-ink-2'}`}>{l}</button>)}</div>}
      {list.length === 0 && <div className="rounded-xl bg-paper p-6 text-center text-ink-2">No results yet. {editable && 'Add your first result to start your medal cabinet.'}</div>}
      <ol className="relative border-l-2 border-line ml-4 space-y-5">
        {list.map(a => (
          <li key={a.id} className="ml-6 relative">
            <span className="absolute -left-[45px] top-0 bg-white p-0.5 rounded-full"><MedalDisc medal={a.medal} size={34} /></span>
            <div className="font-semibold leading-snug">{a.title}</div>
            <div className="text-sm text-ink-2">{a.event}{a.location ? `, ${a.location}` : ''}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-ink-3">{fmtDate(a.date)}</span>
              <Chip>{a.level}</Chip>
              {a.result && <span className="font-semibold tabular text-deep">{a.result}</span>}
              {a.verifiedBy && byId[a.verifiedBy] && <Chip tone="pool"><ShieldCheck className="size-3.5" />Verified by {byId[a.verifiedBy].name}</Chip>}
              {!a.verifiedBy && a.pendingVerifier && byId[a.pendingVerifier] && <Chip tone="gold"><Clock className="size-3.5" />Verification requested from {byId[a.pendingVerifier].name}</Chip>}
              {!a.verifiedBy && !a.pendingVerifier && <Chip>Self-reported</Chip>}
            </div>
          </li>
        ))}
      </ol>
      {onSeeAll && <button onClick={onSeeAll} className="mt-5 text-sm font-semibold text-pool hover:underline">See all results</button>}
    </Section>
  )
}

function PledgeModal({ athlete, onClose }) {
  const { donate } = useStore()
  const [amt, setAmt] = useState(1000)
  return (
    <Modal title={`Back ${athlete.name.split(' ')[0]}`} onClose={onClose}>
      <p className="text-sm text-ink-2">{athlete.funding.purpose}</p>
      <div className="grid grid-cols-4 gap-2 mt-4">{[500, 1000, 5000, 25000].map(v => <button key={v} onClick={() => setAmt(v)} aria-pressed={amt === v} className={`h-12 rounded-xl border-2 font-bold tabular ${amt === v ? 'border-deep bg-pool-soft' : 'border-line'}`}>{inr(v)}</button>)}</div>
      <p className="text-xs text-ink-3 mt-4">In the live product, donations would be routed through a registered partner foundation so donors receive a tax receipt. This demo records a pledge only; no payment is taken.</p>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} className="h-11 px-5 rounded-full border border-line font-semibold">Cancel</button>
        <button onClick={() => { donate(athlete.id, amt); onClose() }} className="h-11 px-5 rounded-full bg-grass text-white font-semibold">Pledge {inr(amt)}</button>
      </div>
    </Modal>
  )
}

function FundingSection({ e, isMe }) {
  const { donations, byId, me } = useStore()
  const [pledge, setPledge] = useState(false)
  const f = e.funding
  return (
    <div className="space-y-4">
      {f ? (
        <Section title="Raising funds">
          <div className="text-ink-2">{f.purpose}</div>
          <div className="flex items-baseline gap-2 mt-4"><span className="display text-4xl tabular">{inr(f.raised + (donations[e.id] || 0))}</span><span className="text-ink-3 tabular">raised of {inr(f.goal)}</span></div>
          <div className="mt-3"><Progress value={f.raised + (donations[e.id] || 0)} goal={f.goal} /></div>
          <div className="text-sm text-ink-2 mt-2">{f.backers + (donations[e.id] ? 1 : 0)} backers</div>
          <h3 className="font-semibold mt-5 mb-2">Where the money goes</h3>
          <table className="w-full text-sm">
            <tbody>{f.breakdown.map(([k, v]) => <tr key={k} className="border-t border-line"><td className="py-2 text-ink-2">{k}</td><td className="py-2 text-right font-semibold tabular">{inr(v)}</td></tr>)}</tbody>
          </table>
          {!isMe && me && <button onClick={() => setPledge(true)} className="mt-5 h-11 px-6 rounded-full bg-grass text-white font-semibold">Back {e.name.split(' ')[0]}</button>}
          {isMe && <div className="mt-4 text-sm text-ink-3">Supporters see this page when they open your profile.</div>}
        </Section>
      ) : (
        <Section title="Raising funds"><div className="rounded-xl bg-paper p-5 text-ink-2">{isMe ? 'You are not raising funds right now. In the full product you can create an itemised fundraiser here.' : `${e.name.split(' ')[0]} is not raising funds right now.`}</div></Section>
      )}
      <Section title="Backed by">
        {e.backedBy?.length ? <EntityGrid ids={e.backedBy} /> : <div className="text-ink-2 text-sm">No foundation backing yet.</div>}
      </Section>
      {e.openTo?.length > 0 && <Section title="Open to"><div className="flex gap-2 flex-wrap">{e.openTo.map(o => <Chip key={o} tone="gold">{o}</Chip>)}</div></Section>}
      {pledge && <PledgeModal athlete={byId[e.id]} onClose={() => setPledge(false)} />}
    </div>
  )
}

function AthleteOverview({ e }) {
  return (
    <div className="space-y-4">
      {e.bio && <Section title="About"><p className="text-ink-2 leading-relaxed max-w-[68ch]">{e.bio}</p></Section>}
      {e.personalBests?.length > 0 && (
        <Section title="Personal bests">
          <div className="grid sm:grid-cols-3 gap-3">
            {e.personalBests.map(([ev, t, when]) => (
              <div key={ev} className="rounded-xl bg-deep text-white p-4"><div className="text-xs text-white/75">{ev}</div><div className="display text-2xl tabular mt-1">{t}</div><div className="text-xs text-white/70 mt-1">{when}</div></div>
            ))}
          </div>
        </Section>
      )}
      {e.rankings?.length > 0 && (
        <Section title="Rankings">
          <ul className="divide-y divide-line">{e.rankings.map(([k, v]) => <li key={k} className="flex justify-between py-2"><span className="text-ink-2">{k}</span><span className="display-tight tabular">{v}</span></li>)}</ul>
        </Section>
      )}
      <Section title="Team">
        <div className="space-y-5">
          {e.coachedBy?.length > 0 && <div><div className="text-sm font-semibold text-ink-3 mb-2">Coached by</div><EntityGrid ids={e.coachedBy} /></div>}
          {e.supportTeam?.length > 0 && <div><div className="text-sm font-semibold text-ink-3 mb-2">Support team</div><EntityGrid ids={e.supportTeam} /></div>}
          {e.backedBy?.length > 0 && <div><div className="text-sm font-semibold text-ink-3 mb-2">Backed by</div><EntityGrid ids={e.backedBy} /></div>}
          {!e.coachedBy?.length && !e.supportTeam?.length && !e.backedBy?.length && <div className="text-sm text-ink-2">No team listed yet.</div>}
        </div>
      </Section>
    </div>
  )
}

function ProOverview({ e }) {
  const { entities } = useStore()
  const trainedHere = entities.filter(a => a.supportTeam?.includes(e.id)).map(a => a.id)
  const ids = [...new Set([...(e.athletesCoached || []), ...trainedHere])]
  return (
    <div className="space-y-4">
      {e.bio && <Section title="About"><p className="text-ink-2 leading-relaxed max-w-[68ch]">{e.bio}</p></Section>}
      {e.certifications && (
        <Section title="Certifications">
          <ul className="space-y-2">{e.certifications.map(c => <li key={c} className="flex gap-2"><Award className="size-5 text-gold shrink-0" />{c}</li>)}</ul>
        </Section>
      )}
      {e.services && <Section title="Services"><div className="flex gap-2 flex-wrap">{e.services.map(s => <Chip key={s} tone="pool">{s}</Chip>)}</div></Section>}
      {e.facilities && <Section title="Facilities"><ul className="grid sm:grid-cols-2 gap-2">{e.facilities.map(s => <li key={s} className="flex gap-2"><Building2 className="size-5 text-bronze shrink-0" />{s}</li>)}</ul></Section>}
      {e.programmes && e.role === 'gym' && <Section title="Programmes"><div className="flex gap-2 flex-wrap">{e.programmes.map(s => <Chip key={s}>{s}</Chip>)}</div></Section>}
      {e.experience && (
        <Section title="Experience">
          <ol className="space-y-4">{e.experience.map(([role, org, from, to]) => (
            <li key={role + org} className="flex gap-3"><span className="size-10 rounded-lg bg-paper flex items-center justify-center shrink-0"><Briefcase className="size-5 text-ink-3" /></span><span><span className="block font-semibold">{role}</span><span className="block text-sm text-ink-2">{org}</span><span className="block text-xs text-ink-3">{from} to {to}</span></span></li>
          ))}</ol>
        </Section>
      )}
      {ids.length > 0 && <Section title={e.role === 'coach' ? 'Athletes coached' : e.role === 'gym' ? 'Athletes training here' : 'Athletes worked with'}><EntityGrid ids={ids} /></Section>}
    </div>
  )
}

function OrgOverview({ e }) {
  const { entities, opportunities, byId } = useStore()
  const supported = [...new Set([...(e.supports || []), ...entities.filter(a => a.backedBy?.includes(e.id)).map(a => a.id)])]
  const medals = supported.flatMap(id => byId[id]?.achievements || []).filter(a => a.medal)
  const verified = entities.flatMap(a => a.achievements || []).filter(a => a.verifiedBy === e.id)
  const calls = opportunities.filter(o => o.orgId === e.id && daysLeft(o.deadline) > 0)
  return (
    <div className="space-y-4">
      <Section title="About">
        <p className="text-ink-2 leading-relaxed max-w-[68ch]">{e.bio}</p>
        {e.team && <div className="mt-4 flex gap-6 flex-wrap">{e.team.map(([n, r]) => <div key={n}><div className="font-semibold">{n}</div><div className="text-sm text-ink-3">{r}</div></div>)}</div>}
      </Section>
      {e.role === 'foundation' && (
        <div className="grid grid-cols-3 gap-3">
          {[[supported.length, 'Athletes backed on Blufin Discover'], [medals.length, 'Medals won by backed athletes'], [calls.length, 'Open calls']].map(([n, l]) => (
            <div key={l} className="card p-4"><div className="display text-3xl text-deep tabular">{n}</div><div className="text-xs text-ink-2 mt-1">{l}</div></div>
          ))}
        </div>
      )}
      {['federation', 'committee', 'government'].includes(e.role) && verified.length > 0 && (
        <div className="card p-4 flex items-center gap-4"><ShieldCheck className="size-8 text-pool" /><div><div className="display text-2xl tabular">{verified.length}</div><div className="text-sm text-ink-2">results verified on Blufin Discover</div></div></div>
      )}
      {calls.length > 0 && <Section title="Open calls and alerts"><div className="space-y-3">{calls.map(o => <OpportunityEmbed key={o.id} opp={o} />)}</div></Section>}
      {e.programmes && <Section title="Programmes"><div className="flex gap-2 flex-wrap">{e.programmes.map(p => <Chip key={p} tone="pool">{p}</Chip>)}</div></Section>}
      {supported.length > 0 && <Section title="Athletes currently supported"><EntityGrid ids={supported} /></Section>}
    </div>
  )
}

export default function Profile() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { byId, posts, me, flash } = useStore()
  const [adding, setAdding] = useState(false)
  const e = byId[id]
  const isMe = me?.id === id
  const isAthlete = e?.role === 'athlete'
  const tabs = useMemo(() => isAthlete ? [['overview', 'Overview'], ['results', 'Results'], ['support', 'Funding & backers'], ['posts', 'Posts']] : [['overview', 'Overview'], ['posts', 'Posts']], [isAthlete])
  const tab = params.get('tab') && tabs.some(t => t[0] === params.get('tab')) ? params.get('tab') : 'overview'
  if (!e) return <div className="max-w-xl mx-auto p-10 text-center"><h1 className="display-tight text-2xl">Profile not found</h1><Link to="/discover" className="text-pool font-semibold">Go to Discover</Link></div>
  const myPosts = posts.filter(p => p.authorId === id)
  const sub = isAthlete ? [e.sport, e.classification].filter(Boolean).join(' ') : ROLE_LABELS[e.role]

  return (
    <div className="max-w-[1000px] mx-auto px-3 sm:px-4 py-5">
      <div className="card overflow-hidden">
        <Cover sport={e.sport} role={e.role} className="h-36 sm:h-48" />
        <div className="lane-rope" />
        <div className="relative px-5 pb-5">
          <div className="flex items-end justify-between gap-3 -mt-12 sm:-mt-14">
            <Avatar e={e} size={isPerson(e) ? 112 : 104} ring />
            <div className="flex gap-2 pb-1">
              {isMe && isAthlete && <button onClick={() => setAdding(true)} className="h-10 px-4 rounded-full bg-gold-soft text-[#7A5A10] font-semibold inline-flex items-center gap-1.5"><Plus className="size-4" />Add result</button>}
              <FollowButton id={e.id} />
              {!isMe && me && <button onClick={() => flash('Messaging arrives in the MVP')} className="h-10 px-4 rounded-full border border-line font-semibold inline-flex items-center gap-1.5 hover:border-ink-3"><MessageSquare className="size-4" /><span className="hidden sm:inline">Message</span></button>}
            </div>
          </div>
          <h1 className="display text-[clamp(1.7rem,4vw,2.4rem)] mt-3 flex items-center gap-2">{e.name}{e.verified && <Verified e={e} className="size-6" />}</h1>
          <div className="mt-1 text-ink-2 text-[17px] max-w-[60ch]">{e.headline}</div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-3">
            <span className="flex items-center gap-1"><Target className="size-4" />{sub}</span>
            <span className="flex items-center gap-1"><MapPin className="size-4" />{e.city}{e.state ? `, ${e.state}` : ''}</span>
            {e.age && <span className="flex items-center gap-1"><Timer className="size-4" />Age {e.age}</span>}
            <span className="flex items-center gap-1"><Users className="size-4" /><b className="text-ink tabular">{compact(e.followers)}</b> followers</span>
            <span>@{e.handle}</span>
          </div>
          {e.guardianManaged && <div className="mt-3"><Chip tone="gold">Profile managed with a parent or guardian</Chip></div>}
          {isAthlete && (e.achievements?.length > 0) && <div className="mt-5"><MedalCabinet achievements={e.achievements} /></div>}
        </div>
        <nav className="border-t border-line flex overflow-x-auto scrollbar-none" role="tablist">
          {tabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setParams(k === 'overview' ? {} : { tab: k })}
              className={`h-12 px-5 text-sm font-semibold whitespace-nowrap border-b-[3px] ${tab === k ? 'border-rope text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}>{l}</button>
          ))}
        </nav>
      </div>

      <div className="mt-4 space-y-4">
        {tab === 'overview' && (isAthlete ? <AthleteOverview e={e} /> : ['foundation', 'federation', 'committee', 'government', 'brand', 'media'].includes(e.role) ? <OrgOverview e={e} /> : <ProOverview e={e} />)}
        {tab === 'overview' && isAthlete && e.achievements?.length > 0 && <ResultsTimeline title="Recent results" compact achievements={e.achievements.slice(0, 3)} editable={isMe} onAdd={() => setAdding(true)} onSeeAll={() => setParams({ tab: 'results' })} />}
        {tab === 'results' && <ResultsTimeline achievements={e.achievements || []} editable={isMe} onAdd={() => setAdding(true)} />}
        {tab === 'support' && <FundingSection e={e} isMe={isMe} />}
        {tab === 'posts' && (myPosts.length ? myPosts.map(p => <PostCard key={p.id} post={p} />) : <div className="card p-8 text-center text-ink-2">No posts yet.</div>)}
      </div>
      {adding && <AchievementModal onClose={() => setAdding(false)} />}
    </div>
  )
}
