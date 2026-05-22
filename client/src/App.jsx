import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing      from './pages/Landing'
import Auth         from './pages/Auth'
import NotFound     from './pages/NotFound'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Dashboard    from './components/dashboard/Dashboard'
import AllErrors    from './components/dashboard/AllErrors'
import ErrorDetail  from './components/dashboard/ErrorDetail'
import Analytics    from './components/dashboard/Analytics'
import Settings     from './components/dashboard/Settings'
import useAuthStore from './store/authStore'
import Team from './pages/dashboard/Team'

// protects routes — redirects to login if not authenticated
function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* protected dashboard routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index                element={<Dashboard />} />
          <Route path="errors"        element={<AllErrors />} />
          <Route path="errors/:id"    element={<ErrorDetail />} />
          <Route path="analytics"     element={<Analytics />} />
          <Route path="settings"      element={<Settings />} />
          <Route path="team"      element={<Team />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App