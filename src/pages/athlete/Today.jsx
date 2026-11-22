import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, ShieldCheck, AlertTriangle, HandCoins, ScrollText } from 'lucide-react'
import { useStore, fmtDate, daysLeft, inr } from '../../store'
import { circularFit, callFit, completeness } from '../../lib/eligibility'
import { Ring } from '../../components/ui'
import { CircularRow, CircularModal } from '../../components/Circular'
import { NextUp } from '../../components/Passport'
import { ORGS } from '../../data/orgs'

export default function Today() {
  const { me, circulars, calls, applications, invites, markRead } = useStore()
  const [open, setOpen] = useState(null)
  const comp = completeness(me)

  const mine = useMemo(() => circulars.filter(c => circularFit(c, me)?.forYou), [circulars, me])
  const hidden = circulars.length - mine.length

  const actions = []
  if (invites.includes(me.id)) actions.push({ icon: Mail, tone: 'teal', title: 'Blufin Foundation invited you to apply to the Para Swim Accelerator', sub: 'Their team found your passport while scouting.', to: '/opportunities/blufin-psa-2027', cta: 'See the call' })
  for (const c of mine) {
    const fit = circularFit(c, me)
    if (fit.blocking.length) actions.push({ icon: AlertTriangle, tone: 'rope', title: `${ORGS[c.orgId].short}: ${c.title}`, sub: fit.blocking.map(b => b.detail).join('. '), onClick: () => setOpen(c), cta: 'Fix' })
  }
  const verified = me.results.filter(r => r.justVerified)
  for (const r of verified) actions.push({ icon: ShieldCheck, tone: 'grass', title: `${ORGS[r.verifiedBy]?.short} verified your result: ${r.result}`, sub: r.event, to: '/passport?tab=results', cta: 'View' })
  const pending = me.results.filter(r => r.pendingWith)
  for (const r of pending) actions.push({ icon: ShieldCheck, tone: 'amber', title: `Waiting for ${ORGS[r.pendingWith]?.short} to verify: ${r.result}`, sub: 'Switch to the KSA seat to see their side.', to: '/passport?tab=results', cta: 'View' })
  for (const call of calls) {
    const fit = callFit(call, me)
    if (fit?.eligible && call.mode === 'open' && !applications[call.id]?.[me.id]) actions.push({ icon: HandCoins, tone: 'grass', title: `You meet ${fit.met} of ${fit.total} criteria: ${call.title}`, sub: `${ORGS[call.orgId].name}. Closes in ${daysLeft(call.closes)} days.`, to: `/opportunities/${call.id}`, cta: 'Apply' })
  }
  if (me.classification && me.classification.status !== 'Confirmed') actions.push({ icon: AlertTriangle, tone: 'amber', title: `International class status: ${me.classification.status}${me.classification.reviewYear ? ' ' + me.classification.reviewYear : ''}`, sub: 'You need classification at a sanctioned meet before some World Para Swimming events. Berlin in April has an evaluation session.', to: '/passport', cta: 'Details' })

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6 grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-8 min-w-0">
        <header>
          <div className="text-sm text-ink-3">{fmtDate('2026-11-22', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)] mt-1">Your season, {me.name.split(' ')[0]}</h1>
        </header>

        <section>
          <h2 className="display-tight text-lg mb-3">Needs you</h2>
          <ul className="space-y-2">
            {actions.map((x, i) => {
              const tones = { rope: 'text-rope bg-rope-soft', grass: 'text-grass bg-grass-soft', amber: 'text-amber bg-amber-soft', teal: 'text-deep bg-pool-soft' }
              const inner = (
                <>
                  <span className={`size-10 rounded-full flex items-center justify-center shrink-0 ${tones[x.tone]}`}><x.icon className="size-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold leading-snug">{x.title}</span><span className="block text-sm text-ink-2">{x.sub}</span></span>
                  <span className="text-sm font-semibold text-deep shrink-0 hidden sm:flex items-center gap-1">{x.cta}<ArrowRight className="size-4" /></span>
                </>
              )
              return (
                <li key={i}>
                  {x.to ? <Link to={x.to} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3.5 hover:border-deep">{inner}</Link>
                    : <button onClick={x.onClick} className="w-full text-left flex items-center gap-3 rounded-xl border border-line bg-white p-3.5 hover:border-deep">{inner}</button>}
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2 className="display-tight text-lg mb-3">Coming up</h2>
          <NextUp a={me} />
        </section>

        <section>
          <div className="flex items-end justify-between mb-3"><h2 className="display-tight text-lg">Circulars for you</h2><span className="text-sm text-ink-3">{hidden} others did not apply to you</span></div>
          <div className="space-y-2">{mine.map(c => <CircularRow key={c.id} c={c} athlete={me} onOpen={() => { setOpen(c); markRead(c.id) }} />)}</div>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="cover-tex rounded-2xl text-white p-5">
          <div className="flex items-center justify-between"><span className="text-[11px] tracking-[0.25em] font-semibold text-[#E9C77B]">SPORTS PASSPORT</span><Ring pct={comp.pct} size={52} label="complete" /></div>
          <div className="display-tight text-xl mt-3">{me.name}</div>
          <div className="text-sm text-white/75">{me.sport}{me.classification ? `, ${me.classification.cls}` : ''}</div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {comp.items.map(i => <li key={i.label} className={`flex gap-2 ${i.ok ? 'text-white/85' : 'text-[#F4B9AE]'}`}><span aria-hidden>{i.ok ? '✓' : '•'}</span>{i.label}{i.detail ? ` (${i.detail})` : ''}</li>)}
          </ul>
          <Link to="/passport" className="mt-5 inline-flex h-10 px-4 rounded-full bg-white text-deep text-sm font-semibold items-center">Open passport</Link>
        </div>
        {me.season && (
          <div className="card p-4">
            <div className="text-xs text-ink-3">{me.season.label} funding</div>
            <div className="display text-2xl tabular mt-1">{inr(me.season.total - me.season.secured)}</div>
            <div className="text-sm text-ink-2">still needed for: {me.season.goal.toLowerCase()}</div>
            <Link to="/opportunities" className="mt-3 inline-flex text-sm font-semibold text-deep hover:underline">Find funding that fits</Link>
          </div>
        )}
        <div className="card p-4 text-sm text-ink-2 flex gap-3"><ScrollText className="size-5 text-deep shrink-0" />You only see circulars meant for you: your sport, state, age group and class. Requirements are checked against your passport.</div>
      </aside>
      {open && <CircularModal c={open} athlete={me} onClose={() => setOpen(null)} />}
    </div>
  )
}

