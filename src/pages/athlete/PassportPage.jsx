import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Plus, Link2, Eye } from 'lucide-react'
import { useStore } from '../../store'
import { completeness } from '../../lib/eligibility'
import { IdentityPage, StampsPage, ResultsLedger, BestsPage, CertificatesPage, SeasonPage, MedalTally, NextUp } from '../../components/Passport'
import { ConnectionsPanel } from '../../components/Entity'
import { PassportCover } from '../Landing'
import AddResultModal from '../../components/AddResultModal'
import { Btn, Ring, Chip } from '../../components/ui'

const TABS = [['identity', 'Identity'], ['stamps', 'Stamps'], ['results', 'Results'], ['standards', 'Standards'], ['certificates', 'Certificates'], ['team', 'Connections'], ['season', 'Season plan']]

export default function PassportPage({ publicView }) {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { me, byId, flash, done, session } = useStore() // eslint-disable-line no-unused-vars
  const a = publicView ? byId[id] : me
  const own = !publicView || me?.id === id
  const [adding, setAdding] = useState(params.get('add') === '1')
  const tab = TABS.some(t => t[0] === params.get('tab')) ? params.get('tab') : 'identity'

  useEffect(() => { if (own && !publicView) done('a-passport') }, [own, publicView]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!a || a.role) return <div className="p-10 text-center">Passport not found. <Link className="text-pool font-semibold" to="/">Go home</Link></div>
  const comp = completeness(a)
  const tabs = TABS.filter(([k]) => !(publicView && !own && k === 'certificates'))

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6">
      {publicView && !own && (
        <div className="mb-4 rounded-xl bg-pool-soft text-deep px-4 py-3 text-sm flex items-center gap-2"><Eye className="size-4" />Public passport. This is what a selector, foundation or sponsor sees from a shared link.{!session && <Link to="/" className="ml-auto font-semibold underline">Try the demo</Link>}</div>
      )}
      <div className="grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <PassportCover name={a.name} className="hidden lg:flex w-full" />
          <div className="card p-4">
            <div className="flex items-center gap-3"><Ring pct={comp.pct} size={48} label="complete" /><div className="text-sm"><div className="font-semibold">Passport {comp.pct}% complete</div><div className="text-ink-3">{a.results.filter(r => r.verifiedBy).length + a.stamps.filter(s => s.verifiedBy).length} verified results</div></div></div>
            <div className="mt-3"><MedalTally a={a} /></div>
          </div>
          {own && (
            <div className="flex lg:flex-col lg:items-stretch gap-2">
              <Btn onClick={() => setAdding(true)} className="flex-1 lg:flex-none"><Plus className="size-4" />Add a result</Btn>
              <Btn kind="ghost" className="flex-1 lg:flex-none" onClick={() => { try { navigator.clipboard?.writeText(`${location.origin}/p/${a.id}`) } catch { /* ignore */ } flash('Public passport link copied') }}><Link2 className="size-4" />Share passport</Btn>
              <Link to={`/p/${a.id}`} className="hidden lg:block text-center text-sm font-semibold text-pool hover:underline py-1">Preview public view</Link>
            </div>
          )}
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">{a.name}</h1>
              <p className="text-ink-2 mt-1 max-w-[62ch]">{a.story}</p>
            </div>
            {a.openTo && <div className="flex gap-1.5 flex-wrap">{a.openTo.map(o => <Chip key={o} tone="gold">Open to {o.toLowerCase()}</Chip>)}</div>}
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto scrollbar-none border-b border-line" role="tablist" aria-label="Passport pages">
            {tabs.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setParams(k === 'identity' ? {} : { tab: k })}
                className={`h-11 px-3.5 text-sm font-semibold whitespace-nowrap border-b-[3px] -mb-px ${tab === k ? 'border-rope text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}>{l}</button>
            ))}
          </nav>

          <div className="mt-5 space-y-6">
            {tab === 'identity' && <>
              <IdentityPage a={a} publicView={publicView && !own} />
              {a.next && <section><h2 className="display-tight text-lg mb-3">Next up</h2><NextUp a={a} /></section>}
              <section><div className="flex justify-between items-end mb-3"><h2 className="display-tight text-lg">Latest results</h2><button className="text-sm font-semibold text-pool hover:underline" onClick={() => setParams({ tab: 'results' })}>All results</button></div><ResultsLedger a={a} limit={3} /></section>
            </>}
            {tab === 'stamps' && <StampsPage a={a} />}
            {tab === 'results' && <ResultsLedger a={a} />}
            {tab === 'standards' && <BestsPage a={a} />}
            {tab === 'certificates' && <CertificatesPage a={a} owner={own} />}
            {tab === 'team' && <><ConnectionsPanel e={{ ...a, kind: 'athlete' }} />{(a.schemes || []).length > 0 && <div className="flex flex-wrap gap-2">{a.schemes.map(s => <Chip key={s} tone="teal">{s}</Chip>)}</div>}</>}
            {tab === 'season' && <SeasonPage a={a} />}
          </div>
        </div>
      </div>
      {adding && own && <AddResultModal athlete={a} onClose={() => { setAdding(false); if (params.get('add')) setParams({ tab: 'results' }) }} />}
    </div>
  )
}
