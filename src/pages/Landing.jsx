import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { Avatar, MedalDisc, Field, inputCls, Verified } from '../components/ui'
import { SportPattern } from '../components/SportPattern'
import { Logo } from '../components/Shell'
import { SPORTS, ROLE_LABELS } from '../data/entities'

const OTHER_ACCOUNTS = ['c_arjun', 'blufin', 'gosports', 'pci', 'n_kiran', 'stride']

export default function Landing() {
  const { byId, signIn } = useStore()
  const nav = useNavigate()
  const meera = byId.meera
  const [creating, setCreating] = useState(false)
  const go = (id) => { signIn(id); nav('/feed') }
  const counts = ['gold', 'silver', 'bronze'].map(m => [m, meera.achievements.filter(a => a.medal === m).length])

  return (
    <div className="min-h-screen bg-deep text-white relative overflow-hidden">
      <SportPattern sport="swimming" className="absolute inset-0 h-full w-full opacity-60" />
      <div className="relative max-w-[1180px] mx-auto px-5 py-6">
        <div className="flex items-center justify-between">
          <Logo light />
          <span className="text-xs text-white/70 max-w-[320px] text-right hidden sm:block">Demo build with sample data</span>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start mt-12 lg:mt-20">
          <div>
            <h1 className="display text-[clamp(2.4rem,6vw,4.6rem)]">Every medal, every coach, every backer. One profile.</h1>
            <p className="mt-6 text-lg text-white/85 max-w-[52ch] leading-relaxed">
              Blufin Discover is where athletes keep a verified record of their results, coaches and support staff show who they have built, and foundations, federations and brands find the next champion.
            </p>

            <div className="mt-10 max-w-md rounded-2xl bg-white text-ink overflow-hidden shadow-2xl">
              <div className="lane-rope" />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar e={meera} size={52} />
                  <div>
                    <div className="font-bold flex items-center gap-1">{meera.name}<Verified e={meera} /></div>
                    <div className="text-sm text-ink-3">{meera.sport} {meera.classification}, {meera.city}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  {counts.map(([m, n]) => <div key={m} className="flex items-center gap-2"><MedalDisc medal={m} size={26} /><span className="display text-xl tabular">{n}</span></div>)}
                </div>
                <div className="mt-4 text-sm text-ink-2">Backed by Blufin Foundation. Coached by Arjun Nair. Raising for Berlin 2027.</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-ink p-6 shadow-2xl">
            {!creating ? (
              <>
                <h2 className="display-tight text-2xl">Sign in to the demo</h2>
                <p className="text-sm text-ink-2 mt-1">No password needed. Everything you do is saved in this browser only.</p>
                <button onClick={() => go('meera')} className="mt-5 w-full rounded-xl border-2 border-deep bg-pool-soft p-4 flex items-center gap-3 text-left hover:bg-[#cfe9ef]">
                  <Avatar e={meera} size={48} />
                  <div className="flex-1"><div className="font-bold">Continue as Meera Iyer</div><div className="text-sm text-ink-2">Athlete, para swimmer</div></div>
                  <ArrowRight className="size-5 text-deep" />
                </button>
                <button onClick={() => setCreating(true)} className="mt-3 w-full h-12 rounded-xl border border-line font-semibold hover:border-ink-3">Create a new athlete profile</button>

                <div className="mt-6 text-sm font-semibold text-ink-2">Or see the platform as</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {OTHER_ACCOUNTS.map(id => byId[id] && (
                    <button key={id} onClick={() => go(id)} className="rounded-xl border border-line p-2.5 flex items-center gap-2 text-left hover:border-pool">
                      <Avatar e={byId[id]} size={34} />
                      <span className="min-w-0"><span className="block text-sm font-semibold truncate">{byId[id].name}</span><span className="block text-xs text-ink-3">{ROLE_LABELS[byId[id].role]}</span></span>
                    </button>
                  ))}
                </div>
                <button onClick={() => nav('/concept')} className="mt-5 text-sm font-semibold text-pool hover:underline">Read the concept and benchmarking</button>
              </>
            ) : <CreateAthlete onBack={() => setCreating(false)} onDone={() => nav('/feed')} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateAthlete({ onBack, onDone }) {
  const { createAthlete } = useStore()
  const [f, setF] = useState({ name: '', sport: 'Para Swimming', classification: '', city: '', state: '', age: '', para: true })
  const set = (k) => (e) => setF(x => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !f.city.trim()) return
    createAthlete({ ...f, name: f.name.trim(), age: Number(f.age) || null, para: f.sport.startsWith('Para') || f.sport === 'Blind Judo', classification: f.classification || null })
    onDone()
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="display-tight text-2xl">Create your athlete profile</h2>
      <p className="text-sm text-ink-2">Takes a minute. You can add results once you're in.</p>
      <Field label="Full name"><input className={inputCls} value={f.name} onChange={set('name')} required autoFocus /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sport">
          <select className={inputCls} value={f.sport} onChange={set('sport')}>{SPORTS.map(s => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Classification" hint="Para athletes only"><input className={inputCls} value={f.classification} onChange={set('classification')} placeholder="S9, T47, SL4" /></Field>
        <Field label="City"><input className={inputCls} value={f.city} onChange={set('city')} required /></Field>
        <Field label="State"><input className={inputCls} value={f.state} onChange={set('state')} /></Field>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onBack} className="h-11 px-5 rounded-full border border-line font-semibold">Back</button>
        <button className="flex-1 h-11 rounded-full bg-deep text-white font-semibold">Create profile</button>
      </div>
    </form>
  )
}
