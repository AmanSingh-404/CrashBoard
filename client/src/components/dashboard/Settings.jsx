import { useState, useEffect } from 'react'
import Topbar        from '../../components/dashboard/Topbar'
import useAuthStore  from '../../store/authStore'
import api           from '../../api/axiosInstance'

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 500,
      letterSpacing: '.08em', textTransform: 'uppercase',
      color: 'var(--color-text-secondary)',
      marginBottom: '12px', marginTop: '28px',
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
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function PanelRow({ label, sub, children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '14px 20px',
      borderBottom: last ? 'none' : '0.5px solid var(--color-border-tertiary)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: sub ? '2px' : 0 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  )
}

function Toast({ msg }) {
  if (!msg.text) return null
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      padding: '10px 18px',
      background: msg.type === 'error' ? 'var(--color-background-danger)' : 'var(--color-background-success)',
      color: msg.type === 'error' ? 'var(--color-text-danger)' : 'var(--color-text-success)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: '13px', fontWeight: 500,
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <i className={`ti ${msg.type === 'error' ? 'ti-alert-circle' : 'ti-circle-check'}`} style={{ fontSize: '15px' }} aria-hidden="true" />
      {msg.text}
    </div>
  )
}

export default function Settings() {
  const { user, setAuth, logout } = useAuthStore()
  const navigate = (path) => window.location.href = path

  /* ── profile state ── */
  const [name,         setName]         = useState(user?.name  || '')
  const [email,        setEmail]        = useState(user?.email || '')
  const [profileSaving,setProfileSaving]= useState(false)

  /* ── password state ── */
  const [currentPwd,   setCurrentPwd]   = useState('')
  const [newPwd,       setNewPwd]       = useState('')
  const [confirmPwd,   setConfirmPwd]   = useState('')
  const [pwdSaving,    setPwdSaving]    = useState(false)

  /* ── projects state ── */
  const [projects,     setProjects]     = useState([])
  const [projName,     setProjName]     = useState('')
  const [projDesc,     setProjDesc]     = useState('')
  const [projPlatform, setProjPlatform] = useState('react')
  const [projSaving,   setProjSaving]   = useState(false)
  const [copiedKey,    setCopiedKey]    = useState(null)
  const [deletingProj, setDeletingProj] = useState(null)

  /* ── alerts state ── */
  const [alerts,       setAlerts]       = useState([])
  const [alertProj,    setAlertProj]    = useState('')
  const [threshold,    setThreshold]    = useState(5)
  const [timeWindow,   setTimeWindow]   = useState(10)
  const [emailTo,      setEmailTo]      = useState(user?.email || '')
  const [alertSaving,  setAlertSaving]  = useState(false)

  /* ── toast ── */
  const [msg, setMsg] = useState({ text: '', type: '' })

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  useEffect(() => {
    api.get('/projects').then(r => {
      const projs = r.data.projects || []
      setProjects(projs)
      if (projs.length > 0) setAlertProj(projs[0]._id)
    })
  }, [])

  useEffect(() => {
    if (!alertProj) return
    api.get(`/alerts/${alertProj}`)
      .then(r => setAlerts(r.data.alerts || []))
      .catch(() => setAlerts([]))
  }, [alertProj])

  /* ── handlers ── */
  const saveProfile = async () => {
    if (!name.trim()) return showMsg('Name is required', 'error')
    setProfileSaving(true)
    try {
      // update name in auth store (backend profile update endpoint optional)
      const updated = { ...user, name }
      localStorage.setItem('cb_user', JSON.stringify(updated))
      setAuth(updated, localStorage.getItem('cb_token'))
      showMsg('Profile updated!')
    } catch {
      showMsg('Failed to update profile', 'error')
    } finally {
      setProfileSaving(false) }
  }

  const createProject = async () => {
    if (!projName.trim()) return showMsg('Project name is required', 'error')
    setProjSaving(true)
    try {
      const { data } = await api.post('/projects', {
        name: projName, description: projDesc, platform: projPlatform,
      })
      setProjects(prev => [data.project, ...prev])
      setProjName(''); setProjDesc('')
      showMsg(`Project "${data.project.name}" created!`)
      if (!alertProj) setAlertProj(data.project._id)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to create project', 'error')
    } finally {
      setProjSaving(false)
    }
  }

  const deleteProject = async (projId, projName) => {
    if (!window.confirm(`Delete "${projName}"? This will also delete all its errors.`)) return
    setDeletingProj(projId)
    try {
      await api.delete(`/projects/${projId}`)
      setProjects(prev => prev.filter(p => p._id !== projId))
      showMsg(`Project deleted`)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to delete', 'error')
    } finally {
      setDeletingProj(null)
    }
  }

  const regenerateKey = async (projId) => {
    if (!window.confirm('Regenerate API key? The old key will stop working immediately.')) return
    try {
      const { data } = await api.post(`/projects/${projId}/regenerate-key`)
      setProjects(prev => prev.map(p => p._id === projId ? { ...p, apiKey: data.apiKey } : p))
      showMsg('API key regenerated!')
    } catch {
      showMsg('Failed to regenerate key', 'error')
    }
  }

  const copyKey = (key, projId) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(projId)
    setTimeout(() => setCopiedKey(null), 2000)
    showMsg('API key copied!')
  }

  const createAlert = async () => {
    if (!alertProj) return showMsg('Select a project first', 'error')
    setAlertSaving(true)
    try {
      const { data } = await api.post(`/alerts/${alertProj}`, {
        threshold:       parseInt(threshold),
        timeWindow:      parseInt(timeWindow),
        emailEnabled:    true,
        emailTo,
        cooldownMinutes: 30,
      })
      setAlerts(prev => [data.alert, ...prev])
      showMsg('Alert created!')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to create alert', 'error')
    } finally {
      setAlertSaving(false)
    }
  }

  const toggleAlert = async (projId, alertId) => {
    try {
      const { data } = await api.patch(`/alerts/${projId}/${alertId}/toggle`)
      setAlerts(prev => prev.map(a => a._id === alertId ? data.alert : a))
      showMsg(data.message)
    } catch {
      showMsg('Failed to toggle alert', 'error')
    }
  }

  const deleteAlert = async (projId, alertId) => {
    try {
      await api.delete(`/alerts/${projId}/${alertId}`)
      setAlerts(prev => prev.filter(a => a._id !== alertId))
      showMsg('Alert deleted')
    } catch {
      showMsg('Failed to delete alert', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const avatarColors = ['#6366f1', '#f43f5e', '#22c55e', '#f59e0b']
  const initials = (n = '') => n.slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Settings" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', width: '100%', minWidth: 0 }}>

        {/* ── PROFILE ── */}
        <SectionTitle>Profile</SectionTitle>
        <Panel>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: avatarColors[0],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 500, color: '#fff', flexShrink: 0,
            }}>
              {initials(user?.name)}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input value={email} disabled style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }} />
              <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Email cannot be changed</div>
            </div>
            <div>
              <button
                onClick={saveProfile}
                disabled={profileSaving}
                style={{
                  background: '#e8000d', color: '#fff', border: 'none',
                  padding: '8px 20px', borderRadius: 'var(--border-radius-md)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}
              >
                {profileSaving ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </div>
        </Panel>

        {/* ── PROJECTS ── */}
        <SectionTitle>Projects & API Keys</SectionTitle>

        {/* Create project form */}
        <Panel style={{ marginBottom: '12px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Create new project
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Project name *</label>
                <input value={projName} onChange={e => setProjName(e.target.value)} placeholder="My App" style={{ width: '100%' }} onKeyDown={e => e.key === 'Enter' && createProject()} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Platform</label>
                <select value={projPlatform} onChange={e => setProjPlatform(e.target.value)} style={{ width: '100%' }}>
                  <option value="react">React</option>
                  <option value="nextjs">Next.js</option>
                  <option value="javascript">Vanilla JS</option>
                  <option value="node">Node.js</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Description (optional)</label>
              <input value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="What is this project?" style={{ width: '100%' }} />
            </div>
            <button
              onClick={createProject}
              disabled={projSaving || !projName.trim()}
              style={{
                background: '#e8000d', color: '#fff', border: 'none',
                padding: '8px 20px', borderRadius: 'var(--border-radius-md)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              {projSaving ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </Panel>

        {/* Projects list */}
        {projects.length > 0 && (
          <Panel>
            {projects.map((p, i) => (
              <div key={p._id} style={{
                padding: '16px 20px',
                borderBottom: i < projects.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
              }}>
                {/* Project header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: avatarColors[i % avatarColors.length] }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{p.platform} {p.description && `· ${p.description}`}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => regenerateKey(p._id)}
                      title="Regenerate API key"
                      style={{ background: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', padding: '5px 10px', fontSize: '11px', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <i className="ti ti-refresh" style={{ fontSize: '13px' }} aria-hidden="true" />
                      Regen key
                    </button>
                    <button
                      onClick={() => deleteProject(p._id, p.name)}
                      disabled={deletingProj === p._id}
                      title="Delete project"
                      style={{ background: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', padding: '5px 10px', fontSize: '11px', color: 'var(--color-text-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <i className="ti ti-trash" style={{ fontSize: '13px' }} aria-hidden="true" />
                      {deletingProj === p._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                {/* API key row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-background-secondary)', padding: '8px 12px', borderRadius: 'var(--border-radius-md)' }}>
                  <i className="ti ti-key" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', flexShrink: 0 }} aria-hidden="true" />
                  <code style={{ flex: 1, fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    {p.apiKey}
                  </code>
                  <button
                    onClick={() => copyKey(p.apiKey, p._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: copiedKey === p._id ? 'var(--color-text-success)' : 'var(--color-text-secondary)', flexShrink: 0 }}
                  >
                    <i className={`ti ${copiedKey === p._id ? 'ti-circle-check' : 'ti-copy'}`} style={{ fontSize: '14px' }} aria-hidden="true" />
                  </button>
                </div>

                {/* SDK snippet */}
                <div style={{ marginTop: '10px', padding: '10px 12px', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  <div style={{ color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{'// Add to your app entry point'}</div>
                  <div><span style={{ color: 'var(--color-text-info)' }}>import</span> CrashBoard <span style={{ color: 'var(--color-text-info)' }}>from</span> <span style={{ color: 'var(--color-text-success)' }}>'crashboard-sdk'</span></div>
                  <div>CrashBoard.<span style={{ color: '#ffaa00' }}>init</span>{'({'} apiKey: <span style={{ color: 'var(--color-text-success)' }}>'{p.apiKey.slice(0, 20)}...'</span> {'})'}</div>
                </div>
              </div>
            ))}
          </Panel>
        )}

        {/* ── SMART ALERTS ── */}
        <SectionTitle>Smart Alerts</SectionTitle>

        <Panel style={{ marginBottom: '12px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--color-border-tertiary)', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Create alert rule
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Project selector */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Project</label>
              <select value={alertProj} onChange={e => setAlertProj(e.target.value)} style={{ width: '100%' }}>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Alert when same error fires
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number" min={1} max={100}
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    style={{ width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>times in</span>
                  <input
                    type="number" min={1} max={60}
                    value={timeWindow}
                    onChange={e => setTimeWindow(e.target.value)}
                    style={{ width: '80px' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>mins</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Send email to
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  placeholder="you@gmail.com"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button
              onClick={createAlert}
              disabled={alertSaving || !alertProj}
              style={{
                background: '#e8000d', color: '#fff', border: 'none',
                padding: '8px 20px', borderRadius: 'var(--border-radius-md)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              {alertSaving ? 'Creating...' : 'Create alert'}
            </button>
          </div>
        </Panel>

        {/* Alerts list */}
        {alerts.length > 0 && (
          <Panel>
            {alerts.map((alert, i) => (
              <div key={alert._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px',
                borderBottom: i < alerts.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
              }}>
                <i className="ti ti-bell" style={{ fontSize: '16px', color: alert.isActive ? '#e8000d' : 'var(--color-text-secondary)', flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    Fire if {alert.threshold}+ errors in {alert.timeWindow} mins
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
                    → {alert.emailTo} · cooldown {alert.cooldownMinutes}min
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                  background: alert.isActive ? 'var(--color-background-success)' : 'var(--color-background-secondary)',
                  color: alert.isActive ? 'var(--color-text-success)' : 'var(--color-text-secondary)',
                }}>
                  {alert.isActive ? 'Active' : 'Paused'}
                </span>
                <button
                  onClick={() => toggleAlert(alertProj, alert._id)}
                  title={alert.isActive ? 'Pause alert' : 'Enable alert'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-text-secondary)' }}
                >
                  <i className={`ti ${alert.isActive ? 'ti-player-pause' : 'ti-player-play'}`} style={{ fontSize: '15px' }} aria-hidden="true" />
                </button>
                <button
                  onClick={() => deleteAlert(alertProj, alert._id)}
                  title="Delete alert"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-text-danger)' }}
                >
                  <i className="ti ti-trash" style={{ fontSize: '15px' }} aria-hidden="true" />
                </button>
              </div>
            ))}
          </Panel>
        )}

        {/* ── DANGER ZONE ── */}
        <SectionTitle>Account</SectionTitle>
        <Panel>
          <PanelRow
            label="Sign out"
            sub="Sign out of CrashBoard on this device"
            last
          >
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '7px 16px', fontSize: '12px',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <i className="ti ti-logout" style={{ fontSize: '14px' }} aria-hidden="true" />
              Sign out
            </button>
          </PanelRow>
        </Panel>

        <div style={{ height: '40px' }} />
      </div>

      <Toast msg={msg} />
    </div>
  )
}