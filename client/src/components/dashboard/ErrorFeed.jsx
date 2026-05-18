import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AiExplainer from './AiExplainer'
import api from '../../api/axiosInstance'
import useErrorStore from '../../store/errorStore'

const SEV_COLOR = {
  TypeError:          '#e8000d',
  NetworkError:       '#ffaa00',
  ReferenceError:     'var(--color-text-info)',
  UnhandledPromise:   'var(--color-text-secondary)',
  SyntaxError:        '#ff6600',
}

const STATUS_STYLE = {
  open:     { bg: 'var(--color-background-danger)',  color: 'var(--color-text-danger)'  },
  resolved: { bg: 'var(--color-background-success)', color: 'var(--color-text-success)' },
  ignored:  { bg: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' },
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)   return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400)return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function ErrorFeed({ errors, projectId, loading }) {
  const [expanded,    setExpanded]    = useState(null)
  const [filter,      setFilter]      = useState('all')
  const updateStatus                  = useErrorStore(s => s.updateErrorStatus)
  const navigate                      = useNavigate()

  const FILTERS = ['all', 'open', 'resolved', 'ignored']

  const filtered = filter === 'all'
    ? errors
    : errors.filter(e => e.status === filter)

  const handleStatus = async (e, errorId, status) => {
    e.stopPropagation()
    try {
      await api.patch(`/errors/${projectId}/${errorId}/status`, { status })
      updateStatus(errorId, status)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        display: 'flex', alignItems: 'center', gap: '8px',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>
          Live error feed
        </div>
        <div style={{
          fontSize: '10px', padding: '2px 8px',
          borderRadius: '20px',
          background: 'var(--color-background-danger)',
          color: 'var(--color-text-danger)',
        }}>
          Real-time
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: '6px', padding: '10px 16px',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        flexShrink: 0,
      }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
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
      </div>

      {/* Error list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Loading errors...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <i className="ti ti-circle-check" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }} />
            No {filter === 'all' ? '' : filter} errors
          </div>
        )}

        {filtered.map(err => {
          const isOpen    = expanded === err._id
          const sevColor  = SEV_COLOR[err.type] || 'var(--color-text-secondary)'
          const statusSty = STATUS_STYLE[err.status] || STATUS_STYLE.open

          return (
            <div key={err._id}>
              {/* Error row */}
              <div
                onClick={() => setExpanded(isOpen ? null : err._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 16px',
                  borderBottom: '0.5px solid var(--color-border-tertiary)',
                  cursor: 'pointer',
                  background: isOpen ? 'var(--color-background-secondary)' : 'transparent',
                  transition: 'background .15s',
                }}
              >
                {/* Severity bar */}
                <div style={{
                  width: '3px', height: '38px',
                  borderRadius: '2px',
                  background: sevColor,
                  flexShrink: 0,
                }} />

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}>
                    {err.type}
                  </div>
                  <div style={{
                    fontSize: '11px', color: 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginTop: '2px',
                  }}>
                    {err.message}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {err.url && (
                      <span style={{
                        fontSize: '10px', padding: '1px 6px',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: '4px', color: 'var(--color-text-secondary)',
                      }}>
                        {err.browser || 'Unknown'}
                      </span>
                    )}
                    <span style={{
                      fontSize: '10px', padding: '1px 6px',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: '4px', color: 'var(--color-text-secondary)',
                    }}>
                      {err.environment}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {err.occurrences}×
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {timeAgo(err.lastSeenAt)}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      fontSize: '10px', padding: '2px 8px',
                      borderRadius: '20px',
                      background: statusSty.bg,
                      color: statusSty.color,
                    }}>
                      {err.status}
                    </span>
                  </div>
                </div>

                <i
                  className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'}`}
                  style={{ fontSize: '14px', color: 'var(--color-text-secondary)', flexShrink: 0 }}
                  aria-hidden="true"
                />
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '0.5px solid var(--color-border-tertiary)',
                  background: 'var(--color-background-secondary)',
                }}>

                  {/* Stack trace */}
                  {err.stack && (
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      background: 'var(--color-background-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '10px 12px',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      marginBottom: '10px',
                      lineHeight: 1.6,
                    }}>
                      {err.stack}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {err.status !== 'resolved' && (
                      <button
                        onClick={e => handleStatus(e, err._id, 'resolved')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px',
                          background: 'var(--color-background-success)',
                          border: '0.5px solid var(--color-border-tertiary)',
                          borderRadius: 'var(--border-radius-md)',
                          fontSize: '11px', color: 'var(--color-text-success)',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="ti ti-circle-check" style={{ fontSize: '13px' }} aria-hidden="true" />
                        Resolve
                      </button>
                    )}
                    {err.status !== 'ignored' && (
                      <button
                        onClick={e => handleStatus(e, err._id, 'ignored')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px',
                          background: 'var(--color-background-secondary)',
                          border: '0.5px solid var(--color-border-tertiary)',
                          borderRadius: 'var(--border-radius-md)',
                          fontSize: '11px', color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="ti ti-eye-off" style={{ fontSize: '13px' }} aria-hidden="true" />
                        Ignore
                      </button>
                    )}
                    {err.status !== 'open' && (
                      <button
                        onClick={e => handleStatus(e, err._id, 'open')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px',
                          background: 'var(--color-background-danger)',
                          border: '0.5px solid var(--color-border-tertiary)',
                          borderRadius: 'var(--border-radius-md)',
                          fontSize: '11px', color: 'var(--color-text-danger)',
                          cursor: 'pointer',
                        }}
                      >
                        <i className="ti ti-rotate" style={{ fontSize: '13px' }} aria-hidden="true" />
                        Reopen
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/errors/${err._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '0.5px solid var(--color-border-secondary)',
                        borderRadius: 'var(--border-radius-md)',
                        fontSize: '11px', color: 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <i className="ti ti-external-link" style={{ fontSize: '13px' }} aria-hidden="true" />
                      Full detail
                    </button>
                  </div>

                  {/* AI Explainer */}
                  <AiExplainer projectId={projectId} error={err} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}