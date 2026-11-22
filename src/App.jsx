import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import Shell from './components/Shell'
import Landing from './pages/Landing'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import Concept from './pages/Concept'
import { OpportunitiesList, OpportunityDetail } from './pages/Opportunities'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Protected({ children }) {
  const { me } = useStore()
  return me ? children : <Navigate to="/" replace />
}

export default function App() {
  const { me } = useStore()
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={me ? <Navigate to="/feed" replace /> : <Landing />} />
        <Route path="/signin" element={<Landing />} />
        <Route path="/feed" element={<Protected><Shell><Feed /></Shell></Protected>} />
        <Route path="/discover" element={<Shell><Discover /></Shell>} />
        <Route path="/u/:id" element={<Shell><Profile /></Shell>} />
        <Route path="/opportunities" element={<Shell><OpportunitiesList /></Shell>} />
        <Route path="/opportunities/:id" element={<Shell><OpportunityDetail /></Shell>} />
        <Route path="/concept" element={<Shell><Concept /></Shell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
