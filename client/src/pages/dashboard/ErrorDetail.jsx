import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AiExplainer from '../../components/dashboard/AiExplainer'
import Comments    from '../../components/dashboard/Comments'
import api         from '../../api/axiosInstance'
import useErrorStore from '../../store/errorStore'

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const STATUS_STYLE = {
  open:     { bg: 'var(--color-background-danger)',  color: 'var(--color-text-danger)'   },
  resolved: { bg: 'var(--color-background-success)', color: 'var(--color-text-success)'  },
  ignored:  { bg: 'var(--color-background-secondary)',color: 'var(--color-text-secondary)'},
}

const SEV_COLOR = {
  TypeError:        '#e8000d',
  NetworkError:     '#ffaa00',
  ReferenceError:   'var(--color-text-info)',
  UnhandledPromise: 'var(--color-text-secondary)',
  SyntaxError:      '#ff6600',
}

export default function ErrorDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const updateStatus = useErrorStore(s => s.updateErrorStatus)

  const [error,      setError]      = useState(null)
  const [projectId,  setProjectId]  = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [notFound,   setNotFound]   = useState(false)
  const [activeTab,  setActiveTab]  = useState('overview')

  useEffect(() => {
    // we need to find which project this error belongs to
    // first get all projects, then search for the error
    const load = async () => {
      try {
        const projRes = await api.get('/projects')
        const projects = projRes.data.projects || []

        for (const proj of projects) {
          try {
            const errRes = await api.get(`/errors/${proj._id}/${id}`)
            setError(errRes.data.error)
            setProjectId(proj._id)
            return
          } catch {}
        }
        setNotFound(true)
      } catch (err) {
        console.error(err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleStatus = async (status) => {
    try {
      await api.patch(`/errors/${projectId}/${id}/status`, { status })
      setError(prev => ({ ...prev, status }))
      updateStatus(id, status)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
      Loading error details...
    </div>
  )

  if (notFound) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <i className="ti ti-alert-circle" style={{ fontSize: '48px', color: 'var(--color-text-secondary)' }} aria-hidden="true" />
      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Error not found</div>
      <button onClick={() => navigate('/dashboard')} style={{ fontSize: '13px' }}>← Back to dashboard</button>
    </div>
  )

  const sevColor  = SEV_COLOR[error?.type] || 'var(--color-text-secondary)'
  const statusSty = STATUS_STYLE[error?.status] || STATUS_STYLE.open

  const TABS = ['overview', 'stack trace', 'breadcrumbs', 'web vitals', 'ai analysis', 'comments']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer', padding: '4px',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '13px',
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: '15px' }} aria-hidden="true" />
          Back
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--color-border-tertiary)' }} />

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          <span>Dashboard</span>
          <i className="ti ti-chevron-right" style={{ fontSize: '12px' }} aria-hidden="true" />
          <span>Errors</span>
          <i className="ti ti-chevron-right" style={{ fontSize: '12px' }} aria-hidden="true" />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{error?.type}</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {error?.status !== 'resolved' && (
            <button
              onClick={() => handleStatus('resolved')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                background: 'var(--color-background-success)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-text-success)',
              }}
            >
              <i className="ti ti-circle-check" style={{ fontSize: '14px' }} aria-hidden="true" />
              Resolve
            </button>
          )}
          {error?.status !== 'ignored' && (
            <button
              onClick={() => handleStatus('ignored')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                background: 'var(--color-background-secondary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <i className="ti ti-eye-off" style={{ fontSize: '14px' }} aria-hidden="true" />
              Ignore
            </button>
          )}
          {error?.status !== 'open' && (
            <button
              onClick={() => handleStatus('open')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                background: 'var(--color-background-danger)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                color: 'var(--color-text-danger)',
              }}
            >
              <i className="ti ti-rotate" style={{ fontSize: '14px' }} aria-hidden="true" />
              Reopen
            </button>
          )}
        </div>
      </div>

      {/* ── Error header ── */}
      <div style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '20px 24px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          {/* Severity bar */}
          <div style={{
            width: '4px', height: '52px',
            borderRadius: '2px',
            background: sevColor, flexShrink: 0, marginTop: '2px',
          }} />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 500, color: sevColor, margin: 0 }}>
                {error?.type}
              </h1>
              <span style={{
                fontSize: '11px', padding: '3px 10px',
                borderRadius: '20px', fontWeight: 500,
                background: statusSty.bg, color: statusSty.color,
              }}>
                {error?.status}
              </span>
              <span style={{
                fontSize: '11px', padding: '3px 10px',
                borderRadius: '20px',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-secondary)',
              }}>
                {error?.environment}
              </span>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: '10px', lineHeight: 1.5 }}>
              {error?.message}
            </div>

            {/* Meta chips */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { icon: 'ti-refresh',     label: `${error?.occurrences || 0} occurrences` },
                { icon: 'ti-users',       label: `${error?.affectedUsers || 0} users affected` },
                { icon: 'ti-browser',     label: error?.browser || 'Unknown browser' },
                { icon: 'ti-device-desktop', label: error?.os || 'Unknown OS' },
                { icon: 'ti-clock',       label: `First seen ${timeAgo(error?.firstSeenAt)}` },
                { icon: 'ti-clock',       label: `Last seen ${timeAgo(error?.lastSeenAt)}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: '13px' }} aria-hidden="true" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        background: 'var(--color-background-primary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        padding: '0 24px',
        display: 'flex', gap: '0',
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '2px solid #e8000d' : '2px solid transparent',
              fontSize: '12px', fontWeight: activeTab === tab ? 500 : 400,
              color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer', textTransform: 'capitalize',
              transition: 'color .15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '900px' }}>
            {[
              { label: 'Error type',   value: error?.type },
              { label: 'Status',       value: error?.status },
              { label: 'Environment',  value: error?.environment },
              { label: 'Browser',      value: error?.browser || '—' },
              { label: 'OS',           value: error?.os || '—' },
              { label: 'URL',          value: error?.url || '—' },
              { label: 'Occurrences',  value: error?.occurrences },
              { label: 'Users affected',value: error?.affectedUsers },
              { label: 'First seen',   value: new Date(error?.firstSeenAt).toLocaleString() },
              { label: 'Last seen',    value: new Date(error?.lastSeenAt).toLocaleString() },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>
                  {item.value || '—'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STACK TRACE */}
        {activeTab === 'stack trace' && (
          <div style={{ maxWidth: '900px' }}>
            {error?.stack ? (
              <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--color-border-tertiary)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '12px', color: 'var(--color-text-secondary)',
                }}>
                  <i className="ti ti-code" style={{ fontSize: '14px' }} aria-hidden="true" />
                  Stack trace
                  {error.stack.includes('(original)') && (
                    <span style={{
                      fontSize: '10px', padding: '2px 8px',
                      borderRadius: '20px', marginLeft: '4px',
                      background: 'var(--color-background-success)',
                      color: 'var(--color-text-success)',
                    }}>
                      ✓ De-minified
                    </span>
                  )}
                </div>
                <pre style={{
                  padding: '16px 20px', margin: 0,
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  lineHeight: 1.8, overflowX: 'auto',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>
                  {error.stack.split('\n').map((line, i) => {
                    const isError  = i === 0
                    const isOrig   = line.includes('(original)')
                    const isMinify = line.includes('.min.js')
                    return (
                      <div key={i} style={{
                        color: isError ? '#e8000d' : isOrig ? 'var(--color-text-success)' : isMinify ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                        opacity: isMinify ? 0.5 : 1,
                      }}>
                        {line}
                      </div>
                    )
                  })}
                </pre>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', padding: '24px' }}>
                No stack trace available
              </div>
            )}
          </div>
        )}

        {/* BREADCRUMBS */}
        {activeTab === 'breadcrumbs' && (
          <div style={{ maxWidth: '700px' }}>
            {error?.breadcrumbs?.length > 0 ? (
              <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--color-border-tertiary)',
                  fontSize: '13px', fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <i className="ti ti-timeline" style={{ fontSize: '15px' }} aria-hidden="true" />
                  Session replay — last {error.breadcrumbs.length} actions before crash
                </div>

                {/* Timeline */}
                <div style={{ padding: '16px 20px' }}>
                  {error.breadcrumbs.map((b, i) => {
                    const typeColor = {
                      click:      'var(--color-text-info)',
                      navigation: 'var(--color-text-success)',
                      api_call:   '#ffaa00',
                    }[b.type] || 'var(--color-text-secondary)'

                    const typeIcon = {
                      click:      'ti-cursor-text',
                      navigation: 'ti-route',
                      api_call:   'ti-api',
                    }[b.type] || 'ti-point'

                    const isLast = i === error.breadcrumbs.length - 1

                    return (
                      <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative', paddingBottom: isLast ? 0 : '16px' }}>
                        {/* Timeline line */}
                        {!isLast && (
                          <div style={{
                            position: 'absolute', left: '15px', top: '28px',
                            width: '1px', bottom: 0,
                            background: 'var(--color-border-tertiary)',
                          }} />
                        )}

                        {/* Icon */}
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: 'var(--color-background-secondary)',
                          border: `1px solid ${isLast ? '#e8000d' : 'var(--color-border-tertiary)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, zIndex: 1,
                        }}>
                          <i className={`ti ${typeIcon}`} style={{ fontSize: '14px', color: isLast ? '#e8000d' : typeColor }} aria-hidden="true" />
                        </div>

                        <div style={{ flex: 1, paddingTop: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{
                              fontSize: '10px', padding: '1px 7px',
                              borderRadius: '4px', fontWeight: 500,
                              background: 'var(--color-background-secondary)',
                              color: typeColor,
                              textTransform: 'uppercase', letterSpacing: '.06em',
                            }}>
                              {b.type}
                            </span>
                            {isLast && (
                              <span style={{ fontSize: '10px', color: '#e8000d', fontWeight: 500 }}>
                                ← CRASH
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                            {b.message}
                          </div>
                          {b.timestamp && (
                            <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                              {new Date(b.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '32px', textAlign: 'center',
              }}>
                <i className="ti ti-timeline-event-x" style={{ fontSize: '32px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }} aria-hidden="true" />
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  No breadcrumbs recorded for this error
                </div>
              </div>
            )}
          </div>
        )}

        {/* WEB VITALS */}
        {activeTab === 'web vitals' && (
          <div style={{ maxWidth: '700px' }}>
            {error?.webVitals && Object.values(error.webVitals).some(v => v > 0) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
                {[
                  { key: 'lcp',  label: 'LCP',  name: 'Largest Contentful Paint', good: 2500, poor: 4000, unit: 'ms' },
                  { key: 'fcp',  label: 'FCP',  name: 'First Contentful Paint',   good: 1800, poor: 3000, unit: 'ms' },
                  { key: 'cls',  label: 'CLS',  name: 'Cumulative Layout Shift',  good: 0.1,  poor: 0.25, unit: ''  },
                  { key: 'ttfb', label: 'TTFB', name: 'Time to First Byte',       good: 800,  poor: 1800, unit: 'ms' },
                ].map(v => {
                  const val   = error.webVitals[v.key] || 0
                  const score = val <= v.good ? 'good' : val <= v.poor ? 'needs-improvement' : 'poor'
                  const color = score === 'good' ? 'var(--color-text-success)' : score === 'needs-improvement' ? 'var(--color-text-warning)' : 'var(--color-text-danger)'
                  const bg    = score === 'good' ? 'var(--color-background-success)' : score === 'needs-improvement' ? 'var(--color-background-warning)' : 'var(--color-background-danger)'
                  const label = score === 'good' ? 'Good' : score === 'needs-improvement' ? 'Needs work' : 'Poor'
                  return (
                    <div key={v.key} style={{
                      background: 'var(--color-background-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-lg)',
                      padding: '16px 18px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{v.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{v.name}</div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: bg, color }}>
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 500, color, lineHeight: 1 }}>
                        {val > 0 ? `${val}${v.unit}` : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '32px', textAlign: 'center',
              }}>
                <i className="ti ti-trending-up" style={{ fontSize: '32px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }} aria-hidden="true" />
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  No Web Vitals data for this error
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI ANALYSIS */}
        {activeTab === 'ai analysis' && projectId && (
          <div style={{ maxWidth: '700px' }}>
            <AiExplainer projectId={projectId} error={error} />
          </div>
        )}

        {/* COMMENTS */}
        {activeTab === 'comments' && projectId && (
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '16px 20px',
            }}>
              <Comments projectId={projectId} errorId={id} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}