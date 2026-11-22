import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, FileSearch, ShieldCheck, AlertTriangle } from 'lucide-react'
import { useStore } from '../../store'
import { Avatar, Chip, Btn, Modal } from '../../components/ui'

const SCOPE = {
  ksa: (a) => a.represents === 'Karnataka' && ['Swimming', 'Para Swimming'].includes(a.sport),
  bai: (a) => ['Badminton', 'Para Badminton'].includes(a.sport),
}

function AgeReview({ a, onClose }) {
  const { approveAge, flash, session } = useStore()
  return (
    <Modal title={`Age proof: ${a.name}`} onClose={onClose}>
      <p className="text-sm text-ink-2">{a.ageFlag}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {[['Birth certificate (BAI format, Annexure A)', 'Uploaded 18 Nov 2026 by parent', 'Registered with the municipal registrar 3 weeks after birth'], ['School admission record', 'Uploaded 18 Nov 2026', 'Date of birth matches the certificate'], ['Medical age certificate', 'On file since registration', 'Previously accepted as a temporary proof']].map(([d, w, n]) => (
          <li key={d} className="rounded-lg border border-line p-3"><div className="font-semibold">{d}</div><div className="text-xs text-ink-3">{w}</div><div className="text-xs text-ink-2 mt-1">{n}</div></li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-end gap-2 mt-5">
        <Btn kind="danger" onClick={() => { flash('Referred to the age verification committee'); onClose() }}>Refer to committee</Btn>
        <Btn kind="go" onClick={() => { approveAge(a.id, session.id); onClose() }}><ShieldCheck className="size-4" />Accept age proof</Btn>
      </div>
    </Modal>
  )
}

export default function Registry() {
  const { athletes, session, org, remind, reminded } = useStore()
  const [filter, setFilter] = useState('all')
  const [review, setReview] = useState(null)
  const scope = useMemo(() => athletes.filter(SCOPE[session.id] || (() => false)), [athletes, session.id])
  const expired = scope.filter(a => a.ids?.some(i => !i.valid))
  const ageFlags = scope.filter(a => !a.dobVerified)
  const list = filter === 'expired' ? expired : filter === 'age' ? ageFlags : scope

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="display text-[clamp(1.8rem,3.4vw,2.5rem)]">Registry</h1>
      <p className="text-ink-2 mt-1 max-w-[64ch]">{org.short === 'KSA' ? 'Registered Karnataka swimmers and para swimmers: their SFI UIDs, verified dates of birth and age groups.' : 'Players with BAI Player IDs: age-proof status, rankings and BWF IDs. Junior entries are blocked until age proof is verified.'}</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[['all', scope.length, 'registered on Blufin Discover'], ['expired', expired.length, 'IDs expired this season'], ['age', ageFlags.length, 'without verified age proof']].map(([k, n, l]) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={`card p-4 text-left ${filter === k ? 'border-deep ring-2 ring-pool/25' : ''}`}><div className={`display text-3xl tabular ${k !== 'all' && n ? 'text-rope' : 'text-deep'}`}>{n}</div><div className="text-sm text-ink-2">{l}</div></button>
        ))}
      </div>
      {filter === 'expired' && expired.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-amber-soft p-4">
          <AlertTriangle className="size-5 text-amber" /><span className="text-sm flex-1">These swimmers can't be entered for the State Senior Championship until they renew.</span>
          <Btn disabled={expired.every(a => reminded.includes(a.id))} onClick={() => remind(expired.map(a => a.id))}><Bell className="size-4" />{expired.every(a => reminded.includes(a.id)) ? 'Reminder sent' : 'Remind them and their clubs'}</Btn>
        </div>
      )}
      <div className="mt-4 card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-paper text-left"><tr>{['Athlete', 'ID', 'Date of birth', 'Category', 'Status'].map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {list.map(a => {
              const id = a.ids?.[0]
              return (
                <tr key={a.id} className="border-t border-line">
                  <td className="p-3"><Link to={`/p/${a.id}`} className="flex items-center gap-2 font-semibold hover:underline"><Avatar person={a} size={30} />{a.name}</Link><div className="text-xs text-ink-3 ml-10">{a.club}</div></td>
                  <td className="p-3"><span className="mrz text-xs tracking-normal">{id?.value || '—'}</span>{id?.season && <div className={`text-xs ${id.valid ? 'text-ink-3' : 'text-rope font-semibold'}`}>{id.season}{id.valid ? '' : ', expired'}</div>}</td>
                  <td className="p-3">{a.dobVerified ? <Chip tone="grass"><ShieldCheck className="size-3.5" />Verified</Chip> : <Chip tone="amber">Not verified</Chip>}</td>
                  <td className="p-3 text-ink-2">{a.ageGroup || (a.para ? `${a.classification?.cls}, para` : a.events?.[0])}</td>
                  <td className="p-3">
                    {!a.dobVerified && a.ageFlag ? <Btn kind="soft" className="h-8" onClick={() => setReview(a)}><FileSearch className="size-4" />Review age proof</Btn>
                      : id && !id.valid ? (reminded.includes(a.id) ? <Chip>Reminded</Chip> : <Chip tone="rope">Renewal due</Chip>)
                      : !a.dobVerified ? <Chip tone="amber">Ask for birth certificate</Chip>
                      : <Chip tone="grass">Eligible to enter</Chip>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {review && <AgeReview a={review} onClose={() => setReview(null)} />}
    </div>
  )
}
