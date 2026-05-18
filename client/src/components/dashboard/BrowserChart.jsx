export default function BrowserChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1

  const colors = {
    Chrome:  'var(--color-text-info)',
    Firefox: '#ff6600',
    Safari:  'var(--color-text-success)',
    Edge:    'var(--color-text-secondary)',
    Unknown: 'var(--color-border-secondary)',
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
        Browser breakdown
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '16px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          No data yet
        </div>
      ) : (
        data.slice(0, 5).map((item, i) => {
          const pct = Math.round((item.count / total) * 100)
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 16px',
              borderBottom: i < data.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
            }}>
              <div style={{
                fontSize: '12px', color: 'var(--color-text-primary)',
                width: '65px', flexShrink: 0,
              }}>
                {item._id || 'Unknown'}
              </div>
              <div style={{
                flex: 1, height: '6px',
                background: 'var(--color-background-secondary)',
                borderRadius: '3px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${pct}%`,
                  background: colors[item._id] || colors.Unknown,
                  transition: 'width .6s ease',
                }} />
              </div>
              <div style={{
                fontSize: '11px', color: 'var(--color-text-secondary)',
                width: '32px', textAlign: 'right', flexShrink: 0,
              }}>
                {pct}%
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}