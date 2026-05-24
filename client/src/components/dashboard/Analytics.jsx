import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import Topbar from '../../components/dashboard/Topbar'
import api    from '../../api/axiosInstance'

const PIE_COLORS = ['#e8000d', '#4d9fff', '#00e05a', '#ffaa00', '#c084fc', '#ff6600']

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-md)',
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        <i className={`ti ${icon}`} style={{ fontSize: '13px' }} aria-hidden="true" />
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 500, color: color || 'var(--color-text-primary)', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {sub && (
        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 500,
      letterSpacing: '.08em', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)',
      marginBottom: '12px',
    }}>
      {children}
    </div>
  )
}

function Panel({ children, style }) {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '16px 20px',
      ...style,
    }}>
      {children}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-secondary)',
      borderRadius: '6px', fontSize: '11px',
      padding: '8px 12px',
    }}>
      <div style={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [projects,   setProjects]  = useState([])
  const [activeProj, setActiveProj]= useState(null)
  const [analytics,  setAnalytics] = useState(null)
  const [loading,    setLoading]   = useState(true)
  const [dateRange,  setDateRange] = useState('7d')

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
    api.get(`/errors/${activeProj._id}/analytics`)
      .then(r => setAnalytics(r.data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeProj])

  /* ── chart data ── */
  const errorsByDay = analytics?.errorsByDay || []

  const browserData = (analytics?.browserBreakdown || []).map(b => ({
    name:  b._id || 'Unknown',
    value: b.count,
  }))

  const typeData = (analytics?.topErrors || []).map(e => ({
    name:  e.type,
    count: e.occurrences,
  }))

  const resolutionData = analytics ? [
    { name: 'Open',     value: analytics.open     || 0, color: '#e8000d' },
    { name: 'Resolved', value: analytics.resolved || 0, color: '#00e05a' },
    { name: 'Ignored',  value: analytics.ignored  || 0, color: '#888' },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Analytics">
        {/* Project selector */}
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

        {/* Date range */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {['7d', '30d', 'all'].map(d => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              style={{
                padding: '4px 10px', fontSize: '11px',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                cursor: 'pointer',
                background: dateRange === d ? 'var(--color-background-primary)' : 'transparent',
                color: dateRange === d ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: dateRange === d ? 500 : 400,
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </Topbar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* ── Summary stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <StatCard icon="ti-alert-triangle" label="Total errors"    value={analytics?.total?.toLocaleString()}     color="#e8000d" />
              <StatCard icon="ti-circle-check"   label="Resolved"        value={analytics?.resolved?.toLocaleString()}  color="var(--color-text-success)" sub={`${analytics?.resolutionRate || 0}% rate`} />
              <StatCard icon="ti-alert-circle"   label="Open"            value={analytics?.open?.toLocaleString()}      color="var(--color-text-danger)"  />
              <StatCard icon="ti-eye-off"        label="Ignored"         value={analytics?.ignored?.toLocaleString()}   color="var(--color-text-secondary)" />
              <StatCard icon="ti-trending-up"    label="Resolution rate" value={`${analytics?.resolutionRate || 0}%`}   color={analytics?.resolutionRate >= 70 ? 'var(--color-text-success)' : analytics?.resolutionRate >= 40 ? 'var(--color-text-warning)' : 'var(--color-text-danger)'} />
            </div>

            {/* ── Errors over time + Resolution donut ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', marginBottom: '20px' }}>

              {/* Errors by day bar chart */}
              <div>
                <SectionTitle>Errors over time</SectionTitle>
                <Panel>
                  {errorsByDay.length === 0 ? (
                    <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      No data yet — send some errors via the SDK
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={errorsByDay} barCategoryGap="35%">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                          tickFormatter={d => d?.slice(5)}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                          width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Errors" fill="#e8000d" radius={[3, 3, 0, 0]} opacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Panel>
              </div>

              {/* Resolution donut */}
              <div>
                <SectionTitle>Status breakdown</SectionTitle>
                <Panel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {analytics?.total === 0 ? (
                    <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      No errors yet
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie
                            data={resolutionData.filter(d => d.value > 0)}
                            cx="50%" cy="50%"
                            innerRadius={40} outerRadius={60}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {resolutionData.filter(d => d.value > 0).map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'var(--color-background-primary)',
                              border: '0.5px solid var(--color-border-secondary)',
                              borderRadius: '6px', fontSize: '11px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {resolutionData.map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                            {d.name} ({d.value})
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Panel>
              </div>
            </div>

            {/* ── Top error types + Browser breakdown ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

              {/* Top error types bar chart */}
              <div>
                <SectionTitle>Top error types</SectionTitle>
                <Panel>
                  {typeData.length === 0 ? (
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      No data yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={typeData} layout="vertical" barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                        />
                        <YAxis
                          type="category" dataKey="name"
                          tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
                          axisLine={false} tickLine={false}
                          width={110}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Occurrences" radius={[0, 3, 3, 0]}>
                          {typeData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Panel>
              </div>

              {/* Browser breakdown pie */}
              <div>
                <SectionTitle>Browser breakdown</SectionTitle>
                <Panel>
                  {browserData.length === 0 ? (
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      No data yet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie
                            data={browserData}
                            cx="50%" cy="50%"
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {browserData.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'var(--color-background-primary)',
                              border: '0.5px solid var(--color-border-secondary)',
                              borderRadius: '6px', fontSize: '11px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {browserData.map((b, i) => {
                          const total = browserData.reduce((s, d) => s + d.value, 0)
                          const pct   = total ? Math.round((b.value / total) * 100) : 0
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{b.name}</span>
                                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{pct}%</span>
                              </div>
                              <div style={{ height: '5px', background: 'var(--color-background-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: '3px', width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length], transition: 'width .6s ease' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </Panel>
              </div>
            </div>

            {/* ── Top 5 errors table ── */}
            <div>
              <SectionTitle>Most frequent errors</SectionTitle>
              <Panel style={{ padding: 0 }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  padding: '10px 16px',
                  borderBottom: '0.5px solid var(--color-border-tertiary)',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
                }}>
                  {['Error', 'Occurrences', 'Users affected', 'Status'].map((h, i) => (
                    <div key={i} style={{ fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                      {h}
                    </div>
                  ))}
                </div>

                {analytics?.topErrors?.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    No errors yet
                  </div>
                )}

                {analytics?.topErrors?.map((err, i, arr) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: '12px 16px',
                    borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: PIE_COLORS[i % PIE_COLORS.length], marginBottom: '2px' }}>
                        {err.type}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                        {err.message}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {err.occurrences?.toLocaleString()}×
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {err.affectedUsers || 1} users
                    </div>
                    <div>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                        background: err.status === 'resolved' ? 'var(--color-background-success)' : err.status === 'ignored' ? 'var(--color-background-secondary)' : 'var(--color-background-danger)',
                        color: err.status === 'resolved' ? 'var(--color-text-success)' : err.status === 'ignored' ? 'var(--color-text-secondary)' : 'var(--color-text-danger)',
                      }}>
                        {err.status || 'open'}
                      </span>
                    </div>
                  </div>
                ))}
              </Panel>
            </div>
          </>
        )}
      </div>
    </div>
  )
}