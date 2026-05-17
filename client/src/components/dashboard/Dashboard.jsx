import { useEffect, useState } from 'react'
import Topbar      from '../../components/dashboard/Topbar'
import MetricCards from '../../components/dashboard/MetricCards'
import ErrorFeed   from '../../components/dashboard/ErrorFeed'
import WeekChart   from '../../components/dashboard/WeekChart'
import BrowserChart from '../../components/dashboard/BrowserChart'
import TopErrors   from '../../components/dashboard/TopErrors'
import useErrorStore from '../../store/errorStore'
import useSocket   from '../../hooks/useSocket'
import api         from '../../api/axiosInstance'

export default function Dashboard() {
  const [projects,    setProjects]   = useState([])
  const [activeProj,  setActiveProj] = useState(null)
  const [loading,     setLoading]    = useState(true)

  const { errors, analytics, setErrors, setAnalytics } = useErrorStore()

  // load projects on mount
  useEffect(() => {
    api.get('/projects').then(r => {
      const projs = r.data.projects || []
      setProjects(projs)
      if (projs.length > 0) setActiveProj(projs[0])
    }).catch(console.error)
  }, [])

  // load errors + analytics when active project changes
  useEffect(() => {
    if (!activeProj) return
    setLoading(true)

    Promise.all([
      api.get(`/errors/${activeProj._id}`),
      api.get(`/errors/${activeProj._id}/analytics`),
    ]).then(([errRes, analyticsRes]) => {
      setErrors(errRes.data.errors || [])
      setAnalytics(analyticsRes.data.analytics)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [activeProj])

  // connect Socket.io for live errors
  useSocket(activeProj?._id)

  const liveCount = errors.filter(e =>
    Date.now() - new Date(e.lastSeenAt) < 60000
  ).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      <Topbar title="Dashboard" liveCount={liveCount}>
        {/* Project selector */}
        {projects.length > 1 && (
          <select
            value={activeProj?._id || ''}
            onChange={e => setActiveProj(projects.find(p => p._id === e.target.value))}
            style={{
              padding: '5px 10px', fontSize: '12px',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-secondary)',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}
      </Topbar>

      {/* No projects state */}
      {!loading && projects.length === 0 && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '12px', color: 'var(--color-text-secondary)',
        }}>
          <i className="ti ti-folder-off" style={{ fontSize: '48px' }} aria-hidden="true" />
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            No projects yet
          </div>
          <div style={{ fontSize: '13px' }}>
            Create a project in Settings to get your API key
          </div>
        </div>
      )}

      {activeProj && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Metric cards */}
          <MetricCards analytics={analytics} loading={loading} />

          {/* Two column layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '16px',
            flex: 1,
            minHeight: 0,
          }}>

            {/* Error feed */}
            <ErrorFeed
              errors={errors}
              projectId={activeProj._id}
              loading={loading}
            />

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <WeekChart   data={analytics?.errorsByDay    || []} />
              <BrowserChart data={analytics?.browserBreakdown || []} />
              <TopErrors   data={analytics?.topErrors       || []} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}