import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import Topbar                  from '../../components/dashboard/Topbar'
import api                     from '../../api/axiosInstance'
import useErrorStore           from '../../store/errorStore'

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const STATUS_STYLE = {
  open:     { bg: 'var(--color-background-danger)',   color: 'var(--color-text-danger)'   },
  resolved: { bg: 'var(--color-background-success)',  color: 'var(--color-text-success)'  },
  ignored:  { bg: 'var(--color-background-secondary)',color: 'var(--color-text-secondary)'},
}

const SEV_COLOR = {
  TypeError:        '#e8000d',
  NetworkError:     '#ffaa00',
  ReferenceError:   'var(--color-text-info)',
  UnhandledPromise: 'var(--color-text-secondary)',
  SyntaxError:      '#ff6600',
}

export default function AllErrors() {
  const navigate   = useNavigate()
  const { errors, setErrors } = useErrorStore()

  const [projects,   setProjects]   = useState([])
  const [activeProj, setActiveProj] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('all')
  const [search,     setSearch]     = useState('')

  useEffect(() => {
    api.get('/projects').then(r => {
      const projs = r.data.projects || []
      setProjects(projs)
      if (projs.length > 0) setActiveProj(projs[0])
    })
  }, [])

  useEffect(() => {
    if (!activeProj) return
    setLoading(true)
    api.get(`/errors/${activeProj._id}?limit=50`)
      .then(r => setErrors(r.data.errors || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeProj])

  const filtered = errors.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter
    const matchSearch = !search ||
      e.type.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="All Errors">
        {projects.length > 1 && (
          <select
            value={activeProj?._id || ''}
            onChange={e => setActiveProj(projects.find(p => p._id === e.target.value))}
            style={{ padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}
      </Topbar>

      {/* Filter + search bar */}
      <div style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0,
      }}>
        {/* Status filters */}
        {['all','open','resolved','ignored'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px', borderRadius: '20px',
              border: '0.5px solid var(--color-border-secondary)',
              fontSize: '11px', cursor: 'pointer',
              background: filter === f ? 'var(--color-background-primary)' : 'transparent',
              color: filter === f ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: filter === f ? 500 : 400,
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <i className="ti ti-search" style={{
            position: 'absolute', left: '10px', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '13px', color: 'var(--color-text-secondary)',
          }} aria-hidden="true" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search errors..."
            style={{ paddingLeft: '32px', width: '220px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Error table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr 1fr 1fr 80px',
          gap: '12px',
          padding: '8px 24px',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
          background: 'var(--color-background-secondary)',
        }}>
          {['Error', 'Status', 'Occurrences', 'Last seen', ''].map((h, i) => (
            <div key={i} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              {h}
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Loading errors...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <i className="ti ti-circle-check" style={{ fontSize: '40px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '10px' }} aria-hidden="true" />
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              No errors found
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {filter !== 'all' ? `No ${filter} errors` : 'Your app is running clean!'}
            </div>
          </div>
        )}

        {filtered.map((err, i) => {
          const sevColor  = SEV_COLOR[err.type] || 'var(--color-text-secondary)'
          const statusSty = STATUS_STYLE[err.status] || STATUS_STYLE.open

          return (
            <div
              key={err._id}
              onClick={() => navigate(`/dashboard/errors/${err._id}`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 1fr 1fr 80px',
                gap: '12px',
                padding: '14px 24px',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
                cursor: 'pointer',
                transition: 'background .15s',
                alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Error info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ width: '3px', height: '36px', borderRadius: '2px', background: sevColor, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: sevColor, marginBottom: '2px' }}>
                    {err.type}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {err.message}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                    {err.browser && (
                      <span style={{ fontSize: '10px', padding: '1px 5px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '3px', color: 'var(--color-text-secondary)' }}>
                        {err.browser}
                      </span>
                    )}
                    <span style={{ fontSize: '10px', padding: '1px 5px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '3px', color: 'var(--color-text-secondary)' }}>
                      {err.environment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <span style={{
                  fontSize: '11px', padding: '3px 10px',
                  borderRadius: '20px',
                  background: statusSty.bg, color: statusSty.color,
                }}>
                  {err.status}
                </span>
              </div>

              {/* Occurrences */}
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {err.occurrences?.toLocaleString()}×
              </div>

              {/* Last seen */}
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                {timeAgo(err.lastSeenAt)}
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <i className="ti ti-chevron-right" style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }} aria-hidden="true" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <div style={{
          padding: '10px 24px',
          borderTop: '0.5px solid var(--color-border-tertiary)',
          fontSize: '11px', color: 'var(--color-text-secondary)',
          background: 'var(--color-background-primary)',
          flexShrink: 0,
        }}>
          Showing {filtered.length} error{filtered.length !== 1 ? 's' : ''}
          {filter !== 'all' ? ` · ${filter}` : ''}
          {search ? ` matching "${search}"` : ''}
        </div>
      )}
    </div>
  )
}