import { useState, useEffect } from 'react'
import Topbar from '../../components/dashboard/Topbar'
import api    from '../../api/axiosInstance'

export default function Settings() {
  const [projects,  setProjects]  = useState([])
  const [name,      setName]      = useState('')
  const [desc,      setDesc]      = useState('')
  const [platform,  setPlatform]  = useState('react')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState('')

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.projects || []))
  }, [])

  const createProject = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/projects', { name, description: desc, platform })
      setProjects(prev => [data.project, ...prev])
      setName(''); setDesc('')
      setSuccess('Project created!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false) }
  }

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Settings" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '680px' }}>

        {/* Create project */}
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '20px 24px',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
            Create new project
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Project name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="My App"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Description (optional)
              </label>
              <input
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="What is this project?"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Platform
              </label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: '100%' }}>
                <option value="react">React</option>
                <option value="nextjs">Next.js</option>
                <option value="javascript">Vanilla JS</option>
                <option value="node">Node.js</option>
                <option value="other">Other</option>
              </select>
            </div>

            {success && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-success)', padding: '8px 12px', background: 'var(--color-background-success)', borderRadius: 'var(--border-radius-md)' }}>
                {success}
              </div>
            )}

            <button onClick={createProject} disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </div>

        {/* Existing projects */}
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Your projects & API keys
        </div>

        {projects.map(p => (
          <div key={p._id} style={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '16px 20px',
            marginBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{p.platform} · {p.description}</div>
              </div>
              <span style={{
                fontSize: '10px', padding: '3px 10px',
                borderRadius: '20px',
                background: 'var(--color-background-success)',
                color: 'var(--color-text-success)',
              }}>
                active
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-background-secondary)',
              padding: '8px 12px',
              borderRadius: 'var(--border-radius-md)',
            }}>
              <code style={{
                flex: 1, fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-secondary)',
                wordBreak: 'break-all',
              }}>
                {p.apiKey}
              </code>
              <button
                onClick={() => copyKey(p.apiKey)}
                title="Copy API key"
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                <i className="ti ti-copy" style={{ fontSize: '13px' }} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}