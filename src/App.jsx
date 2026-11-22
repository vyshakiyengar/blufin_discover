import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import Shell, { roleOf } from './components/Shell'
import Landing from './pages/Landing'
import Concept from './pages/Concept'
import { TeamMember, OrgPage } from './pages/Misc'
import Discover from './pages/Discover'
import Today from './pages/athlete/Today'
import PassportPage from './pages/athlete/PassportPage'
import { OpportunitiesList, CallDetail } from './pages/athlete/Opportunities'
import Wins from './pages/athlete/Wins'
import FoundationCalls from './pages/foundation/Calls'
import Review from './pages/foundation/Review'
import Portfolio from './pages/foundation/Portfolio'
import FedCirculars from './pages/federation/Circulars'
import Verify from './pages/federation/Verify'
import Registry from './pages/federation/Registry'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const HOME = { athlete: '/today', foundation: '/f/review', federation: '/g/verify' }

function As({ role, children }) {
  const { session } = useStore()
  const r = roleOf(session)
  if (r !== role) return <Navigate to={session ? HOME[r] : '/'} replace />
  return <Shell>{children}</Shell>
}

export default function App() {
  const { session } = useStore()
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={session ? <Navigate to={HOME[roleOf(session)]} replace /> : <Landing />} />
        <Route path="/start" element={<Landing />} />
        <Route path="/today" element={<As role="athlete"><Today /></As>} />
        <Route path="/passport" element={<As role="athlete"><PassportPage /></As>} />
        <Route path="/opportunities" element={<Shell><OpportunitiesList /></Shell>} />
        <Route path="/opportunities/:id" element={<Shell><CallDetail /></Shell>} />
        <Route path="/wins" element={<Shell><Wins /></Shell>} />
        <Route path="/p/:id" element={<Shell><PassportPage publicView /></Shell>} />
        <Route path="/team/:id" element={<Shell><TeamMember /></Shell>} />
        <Route path="/discover" element={<Shell><Discover /></Shell>} />
        <Route path="/explore" element={<Navigate to="/discover" replace />} />
        <Route path="/org/:id" element={<Shell><OrgPage /></Shell>} />
        <Route path="/f/calls" element={<As role="foundation"><FoundationCalls /></As>} />
        <Route path="/f/review" element={<As role="foundation"><Review /></As>} />
        <Route path="/f/scout" element={<Navigate to="/discover?group=athletes&sport=Para%20Swimming&unbacked=1" replace />} />
        <Route path="/f/portfolio" element={<As role="foundation"><Portfolio /></As>} />
        <Route path="/g/circulars" element={<As role="federation"><FedCirculars /></As>} />
        <Route path="/g/verify" element={<As role="federation"><Verify /></As>} />
        <Route path="/g/registry" element={<As role="federation"><Registry /></As>} />
        <Route path="/concept" element={<Shell><Concept /></Shell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
