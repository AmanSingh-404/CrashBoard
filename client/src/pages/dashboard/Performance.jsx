import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import Topbar from '../../components/dashboard/Topbar'
import api    from '../../api/axiosInstance'

/* ── score helpers ── */
const SCORE_COLOR = {
  good:              'var(--color-text-success)',
  'needs-improvement':'var(--color-text-warning)',
  poor:              'var(--color-text-danger)',
}
const SCORE_BG = {
  good:              'var(--color-background-success)',
  'needs-improvement':'var(--color-background-warning)',
  poor:              'var(--color-background-danger)',
}
const SCORE_LABEL = {
  good:              'Good',
  'needs-improvement':'Needs work',
  poor:              'Poor',
}

/* ── Google thresholds ── */
const THRESHOLDS = {
  lcp:  { good: 2500, poor: 4000,  unit: 'ms',  label: 'LCP',  name: 'Largest Contentful Paint'  },
  fcp:  { good: 1800, poor: 3000,  unit: 'ms',  label: 'FCP',  name: 'First Contentful Paint'    },
  cls:  { good: 0.1,  poor: 0.25,  unit: '',    label: 'CLS',  name: 'Cumulative Layout Shift'   },
  ttfb: { good: 800,  poor: 1800,  unit: 'ms',  label: 'TTFB', name: 'Time to First Byte'        },
}

function VitalCard({ metric, value, score, description }) {
  const t = THRESHOLDS[metric]
  if (!t) return null

  /* calculate fill % for the gauge bar */
  const pct = metric === 'cls'
    ? Math.min((value / 0.5) * 100, 100)
    : Math.min((value / (t.poor * 1.5)) * 100, 100)

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '18px 20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {t.label}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
            {t.name}
          </div>
        </div>
        <span style={{
          fontSize: '10px', padding: '3px 10px',
          borderRadius: '20px', fontWeight: 500,
          background: SCORE_BG[score],
          color:      SCORE_COLOR[score],
        }}>
          {SCORE_LABEL[score]}
        </span>
      </div>

      {/* Big value */}
      <div style={{
        fontSize: '32px', fontWeight: 500, lineHeight: 1,
        color: SCORE_COLOR[score],
        marginBottom: '12px',
      }}>
        {value > 0 ? `${value}${t.unit}` : '—'}
      </div>

      {/* Gauge bar */}
      <div style={{
        height: '6px', background: 'var(--color-background-secondary)',
        borderRadius: '3px', overflow: 'hidden', marginBottom: '8px',
      }}>
        <div style={{
          height: '100%', borderRadius: '3px',
          width: `${pct}%`,
          background: SCORE_COLOR[score],
          transition: 'width .8s cubic-bezier(.16,1,.3,1)',
        }} />
      </div>

      {/* Thresholds legend */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '10px', color: 'var(--color-text-secondary)',
      }}>
        <span style={{ color: 'var(--color-text-success)' }}>
          Good &lt;{t.good}{t.unit}
        </span>
        <span style={{ color: 'var(--color-text-warning)' }}>
          &lt;{t.poor}{t.unit}
        </span>
        <span style={{ color: 'var(--color-text-danger)' }}>
          Poor &gt;{t.poor}{t.unit}
        </span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '48px 24px',
      textAlign: 'center',
      gridColumn: '1 / -1',
    }}>
      <i className="ti ti-trending-up" style={{ fontSize: '48px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '12px' }} aria-hidden="true" />
      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
        No performance data yet
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
        Install the CrashBoard SDK in your app. It automatically captures
        LCP, FCP, CLS and TTFB using the PerformanceObserver API
        and sends them with every error report.
      </div>
      <div style={{
        marginTop: '20px',
        fontFamily: 'var(--font-mono)', fontSize: '12px',
        color: 'var(--color-text-secondary)',
        background: 'var(--color-background-secondary)',
        display: 'inline-block', padding: '12px 20px',
        borderRadius: 'var(--border-radius-md)',
        lineHeight: 1.8,
        textAlign: 'left',
      }}>
        <span style={{ color: 'var(--color-text-success)' }}>import</span> CrashBoard{' '}
        <span style={{ color: 'var(--color-text-success)' }}>from</span>{' '}
        <span style={{ color: 'var(--color-text-info)' }}>'crashboard-sdk'</span>
        <br />
        CrashBoard.<span style={{ color: 'var(--color-text-warning)' }}>init</span>{'({ '}
        apiKey: <span style={{ color: 'var(--color-text-info)' }}>'cb_live_xxx'</span>{' })'}
      </div>
    </div>
  )
}

export default function Performance() {
  const [projects,   setProjects]  = useState([])
  const [activeProj, setActiveProj]= useState(null)
  const [perf,       setPerf]      = useState(null)
  const [loading,    setLoading]   = useState(true)
  const [activeLine, setActiveLine]= useState('avgLcp')

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
    api.get(`/errors/${activeProj._id}/performance`)
      .then(r => setPerf(r.data.performance))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeProj])

  const hasData = perf && (perf.avgLcp > 0 || perf.avgFcp > 0)

  const LINE_OPTIONS = [
    { key: 'avgLcp',  label: 'LCP',  color: '#e8000d' },
    { key: 'avgFcp',  label: 'FCP',  color: '#4d9fff' },
    { key: 'avgTtfb', label: 'TTFB', color: '#ffaa00' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Performance">
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Loading performance data...
          </div>
        )}

        {!loading && (
          <>
            {/* ── 4 Vital cards ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}>
              {!hasData ? (
                <EmptyState />
              ) : (
                <>
                  <VitalCard metric="lcp"  value={perf.avgLcp}  score={perf.scores?.lcp}  />
                  <VitalCard metric="fcp"  value={perf.avgFcp}  score={perf.scores?.fcp}  />
                  <VitalCard metric="cls"  value={perf.avgCls}  score={perf.scores?.cls}  />
                  <VitalCard metric="ttfb" value={perf.avgTtfb} score={perf.scores?.ttfb} />
                </>
              )}
            </div>

            {hasData && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

                {/* ── Vitals over time chart ── */}
                <div style={{
                  background: 'var(--color-background-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      Vitals over time
                    </div>
                    {/* Line selector */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {LINE_OPTIONS.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setActiveLine(opt.key)}
                          style={{
                            padding: '3px 10px', fontSize: '11px',
                            borderRadius: '20px', cursor: 'pointer',
                            border: '0.5px solid var(--color-border-secondary)',
                            background: activeLine === opt.key ? opt.color : 'transparent',
                            color:      activeLine === opt.key ? '#fff' : 'var(--color-text-secondary)',
                            fontWeight: activeLine === opt.key ? 500 : 400,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {perf.history.length === 0 ? (
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Not enough data for chart yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={perf.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                          tickFormatter={d => d.slice(5)}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--color-background-primary)',
                            border: '0.5px solid var(--color-border-secondary)',
                            borderRadius: '6px', fontSize: '11px',
                          }}
                          formatter={(value) => [`${value}ms`, activeLine.replace('avg', '')]}
                        />
                        {LINE_OPTIONS.map(opt => (
                          <Line
                            key={opt.key}
                            type="monotone"
                            dataKey={opt.key}
                            stroke={opt.color}
                            strokeWidth={activeLine === opt.key ? 2 : 1}
                            dot={false}
                            opacity={activeLine === opt.key ? 1 : 0.2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* ── Right col ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* What these mean */}
                  <div style={{
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      What these mean
                    </div>
                    {[
                      { label: 'LCP', desc: 'How fast the main content loads', icon: 'ti-eye' },
                      { label: 'FCP', desc: 'When something first appears on screen', icon: 'ti-bolt' },
                      { label: 'CLS', desc: 'How much layout shifts unexpectedly', icon: 'ti-layout' },
                      { label: 'TTFB', desc: 'Server response time', icon: 'ti-server' },
                    ].map((item, i, arr) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px',
                        borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                      }}>
                        <i className={`ti ${item.icon}`} style={{ fontSize: '15px', color: 'var(--color-text-secondary)', flexShrink: 0 }} aria-hidden="true" />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slowest pages */}
                  {perf.byPage?.length > 0 && (
                    <div style={{
                      background: 'var(--color-background-primary)',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-lg)',
                      overflow: 'hidden',
                    }}>
                      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        Slowest pages
                      </div>
                      {perf.byPage.map((page, i) => {
                        const score = page.avgLcp <= 2500 ? 'good' : page.avgLcp <= 4000 ? 'needs-improvement' : 'poor'
                        return (
                          <div key={i} style={{
                            padding: '10px 16px',
                            borderBottom: i < perf.byPage.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <div style={{
                                fontSize: '11px', color: 'var(--color-text-secondary)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                maxWidth: '180px',
                              }}>
                                {page.url.replace(/https?:\/\/[^/]+/, '') || '/'}
                              </div>
                              <span style={{
                                fontSize: '10px', padding: '1px 6px',
                                borderRadius: '4px', flexShrink: 0,
                                background: SCORE_BG[score],
                                color:      SCORE_COLOR[score],
                              }}>
                                {page.avgLcp}ms
                              </span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--color-background-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: '2px',
                                width: `${Math.min((page.avgLcp / 6000) * 100, 100)}%`,
                                background: SCORE_COLOR[score],
                              }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}