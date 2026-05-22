import { useState, useEffect } from 'react'
import Topbar    from '../../components/dashboard/Topbar'
import Comments  from '../../components/dashboard/Comments'
import api       from '../../api/axiosInstance'

export default function Team() {
  const [projects,     setProjects]    = useState([])
  const [activeProj,   setActiveProj]  = useState(null)
  const [members,      setMembers]     = useState([])
  const [owner,        setOwner]       = useState(null)
  const [errors,       setErrors]      = useState([])
  const [activeError,  setActiveError] = useState(null)
  const [inviteEmail,  setInviteEmail] = useState('')
  const [loading,      setLoading]     = useState(false)
  const [msg,          setMsg]         = useState({ text: '', type: '' })

  useEffect(() => {
    api.get('/projects').then(r => {
      const projs = r.data.projects || []
      setProjects(projs)
      if (projs.length > 0) setActiveProj(projs[0])
    })
  }, [])

  useEffect(() => {
    if (!activeProj) return
    api.get(`/team/${activeProj._id}/members`).then(r => {
      setOwner(r.data.owner)
      setMembers(r.data.members || [])
    })
    api.get(`/errors/${activeProj._id}?status=open&limit=10`).then(r => {
      const errs = r.data.errors || []
      setErrors(errs)
      if (errs.length > 0) setActiveError(errs[0])
    })
  }, [activeProj])

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !activeProj) return
    setLoading(true)
    try {
      await api.post(`/team/${activeProj._id}/invite`, { email: inviteEmail })
      showMsg(`Invitation sent to ${inviteEmail}!`)
      setInviteEmail('')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to send invite', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return
    try {
      await api.delete(`/team/${activeProj._id}/members/${userId}`)
      setMembers(prev => prev.filter(m => m.user._id !== userId))
      showMsg('Member removed')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to remove member', 'error')
    }
  }

  const initials = (name = '') => name.slice(0, 2).toUpperCase()
  const avatarColors = ['#6366f1', '#f43f5e', '#22c55e', '#f59e0b', '#c084fc', '#4d9fff']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Team" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '1100px' }}>

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Project selector */}
            {projects.length > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <select
                  value={activeProj?._id || ''}
                  onChange={e => setActiveProj(projects.find(p => p._id === e.target.value))}
                  style={{ width: '100%' }}
                >
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Invite section */}
            <div style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '18px 20px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Invite a teammate
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                They'll get an email invite to join this project.
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleInvite()}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleInvite}
                  disabled={loading || !inviteEmail.trim()}
                  style={{
                    background: '#e8000d', color: '#fff',
                    border: 'none', padding: '8px 16px',
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {loading ? 'Sending...' : 'Invite'}
                </button>
              </div>

              {msg.text && (
                <div style={{
                  marginTop: '10px', padding: '8px 12px',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '12px',
                  background: msg.type === 'error' ? 'var(--color-background-danger)' : 'var(--color-background-success)',
                  color: msg.type === 'error' ? 'var(--color-text-danger)' : 'var(--color-text-success)',
                }}>
                  {msg.text}
                </div>
              )}
            </div>

            {/* Members list */}
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              Members · {members.length + (owner ? 1 : 0)}
            </div>

            <div style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden',
            }}>
              {owner && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px',
                  borderBottom: members.length > 0 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: avatarColors[0], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: '#fff', flexShrink: 0 }}>
                    {initials(owner.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{owner.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{owner.email}</div>
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'var(--color-background-info)', color: 'var(--color-text-info)' }}>Owner</span>
                </div>
              )}

              {members.map((m, i) => (
                <div key={m.user._id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px',
                  borderBottom: i < members.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: avatarColors[(i + 1) % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: '#fff', flexShrink: 0 }}>
                    {initials(m.user.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{m.user.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{m.user.email}</div>
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>{m.role}</span>
                  <button onClick={() => handleRemove(m.user._id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px' }}>
                    <i className="ti ti-user-minus" style={{ fontSize: '14px' }} aria-hidden="true" />
                  </button>
                </div>
              ))}

              {members.length === 0 && !owner && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  No members yet
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Error comments ── */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              Discuss errors
            </div>

            {/* Error selector */}
            {errors.length > 0 ? (
              <>
                <select
                  value={activeError?._id || ''}
                  onChange={e => setActiveError(errors.find(err => err._id === e.target.value))}
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  {errors.map(err => (
                    <option key={err._id} value={err._id}>
                      {err.type} — {err.message.slice(0, 50)}
                    </option>
                  ))}
                </select>

                {/* Selected error summary */}
                {activeError && (
                  <div style={{
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderLeft: '3px solid #e8000d',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '12px 14px',
                    marginBottom: '12px',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      {activeError.type}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {activeError.message}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '10px', padding: '1px 6px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
                        {activeError.occurrences}× occurrences
                      </span>
                      <span style={{ fontSize: '10px', padding: '1px 6px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
                        {activeError.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {activeError && activeProj && (
                  <div style={{
                    background: 'var(--color-background-primary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-lg)',
                    padding: '14px 16px',
                  }}>
                    <Comments
                      projectId={activeProj._id}
                      errorId={activeError._id}
                    />
                  </div>
                )}
              </>
            ) : (
              <div style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '32px', textAlign: 'center',
              }}>
                <i className="ti ti-message-off" style={{ fontSize: '32px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }} aria-hidden="true" />
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  No open errors to discuss
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}