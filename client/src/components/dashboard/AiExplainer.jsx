import { useState } from 'react'
import api from '../../api/axiosInstance'

export default function AiExplainer({ projectId, error }) {
  const [explanation, setExplanation] = useState(error?.aiExplanation?.cause ? error.aiExplanation : null)
  const [loading,     setLoading]     = useState(false)

  const explain = async () => {
    setLoading(true)
    try {
      const { data } = await api.post(`/errors/${projectId}/${error._id}/explain`)
      setExplanation(data.explanation)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!explanation) {
    return (
      <button
        onClick={explain}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 14px',
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '12px', color: 'var(--color-text-secondary)',
          cursor: 'pointer', marginTop: '8px',
        }}
      >
        <i className="ti ti-robot" style={{ fontSize: '14px' }} aria-hidden="true" />
        {loading ? 'Analyzing with Gemini...' : 'Explain with AI'}
      </button>
    )
  }

  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderLeft: '2px solid #c084fc',
      borderRadius: 'var(--border-radius-md)',
      padding: '12px 14px',
      marginTop: '10px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', color: '#c084fc',
        marginBottom: '8px', fontWeight: 500,
      }}>
        <i className="ti ti-robot" style={{ fontSize: '13px' }} aria-hidden="true" />
        Gemini AI · {explanation.confidence}% confidence
      </div>

      <div style={{
        fontSize: '12px', color: 'var(--color-text-primary)',
        fontWeight: 500, marginBottom: '4px',
      }}>
        {explanation.cause}
      </div>

      {explanation.explanation && (
        <div style={{
          fontSize: '12px', color: 'var(--color-text-secondary)',
          lineHeight: 1.6, marginBottom: '10px',
        }}>
          {explanation.explanation}
        </div>
      )}

      {explanation.fix && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'var(--color-text-success)',
          background: 'var(--color-background-success)',
          padding: '8px 12px',
          borderRadius: 'var(--border-radius-md)',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {explanation.fix}
        </div>
      )}
    </div>
  )
}