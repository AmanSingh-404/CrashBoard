import { useState, useEffect } from 'react'
import api from '../../api/axiosInstance'
import useAuthStore from '../../store/authStore'

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60)    return `${s}s ago`
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function Comments({ projectId, errorId }) {
  const { user }                  = useAuthStore()
  const [comments,  setComments]  = useState([])
  const [text,      setText]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [fetching,  setFetching]  = useState(true)

  useEffect(() => {
    if (!projectId || !errorId) return
    setFetching(true)
    api.get(`/team/${projectId}/errors/${errorId}/comments`)
      .then(r => setComments(r.data.comments || []))
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [projectId, errorId])

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post(
        `/team/${projectId}/errors/${errorId}/comments`,
        { text }
      )
      setComments(prev => [...prev, data.comment])
      setText('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/team/${projectId}/errors/${errorId}/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (err) {
      console.error(err)
    }
  }

  const initials = (name = '') => name.slice(0, 2).toUpperCase()
  const avatarColors = ['#6366f1', '#f43f5e', '#22c55e', '#f59e0b', '#c084fc', '#4d9fff']

  return (
    <div style={{
      marginTop: '12px',
      borderTop: '0.5px solid var(--color-border-tertiary)',
      paddingTop: '12px',
    }}>
      {/* Header */}
      <div style={{
        fontSize: '11px', fontWeight: 500,
        color: 'var(--color-text-secondary)',
        letterSpacing: '.06em', textTransform: 'uppercase',
        marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <i className="ti ti-message-circle" style={{ fontSize: '13px' }} aria-hidden="true" />
        Comments {comments.length > 0 && `· ${comments.length}`}
      </div>

      {/* Comment list */}
      {fetching ? (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', padding: '4px 0' }}>
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', padding: '4px 0' }}>
          No comments yet — be the first to add context.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {comments.map((c, i) => (
            <div key={c._id} style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              {/* Avatar */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: avatarColors[i % avatarColors.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 500, color: '#fff', flexShrink: 0,
              }}>
                {initials(c.author?.name)}
              </div>

              {/* Bubble */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '4px',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {c.author?.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <div style={{
                  background: 'var(--color-background-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.6,
                }}>
                  {c.text}
                </div>
              </div>

              {/* Delete button — only show for own comments */}
              {c.author?._id === user?._id && (
                <button
                  onClick={() => handleDelete(c._id)}
                  title="Delete comment"
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer', padding: '4px',
                    flexShrink: 0, marginTop: '20px',
                  }}
                >
                  <i className="ti ti-trash" style={{ fontSize: '13px' }} aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#6366f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 500, color: '#fff', flexShrink: 0,
        }}>
          {initials(user?.name)}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Add a comment... (Enter to submit, Shift+Enter for new line)"
            rows={2}
            style={{
              width: '100%',
              resize: 'none',
              padding: '8px 12px',
              fontSize: '12px',
              lineHeight: 1.6,
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          style={{
            background: '#e8000d', color: '#fff',
            border: 'none', padding: '8px 14px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '12px', cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {loading
            ? <i className="ti ti-loader" style={{ fontSize: '14px' }} aria-hidden="true" />
            : <i className="ti ti-send" style={{ fontSize: '14px' }} aria-hidden="true" />
          }
        </button>
      </div>
    </div>
  )
}