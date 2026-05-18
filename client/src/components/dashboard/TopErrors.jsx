export default function TopErrors({ data = [] }) {
  const max = Math.max(...data.map(e => e.occurrences), 1)

  const typeColor = (type) => {
    if (type.includes('TypeError'))    return '#e8000d'
    if (type.includes('Network'))      return '#ffaa00'
    if (type.includes('Reference'))    return 'var(--color-text-info)'
    if (type.includes('Unhandled'))    return 'var(--color-text-secondary)'
    return 'var(--color-text-primary)'
  }

  return (
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
      }}>
        Top error types
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '16px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          No errors yet
        </div>
      ) : (
        data.map((err, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: i < data.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12px', fontWeight: 500,
                color: typeColor(err.type),
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
            </div>
            <div style={{
              fontSize: '13px', fontWeight: 500,
              color: typeColor(err.type),
              marginLeft: '12px', flexShrink: 0,
            }}>
              {err.occurrences}×
            </div>
          </div>
        ))
      )}
    </div>
  )
}