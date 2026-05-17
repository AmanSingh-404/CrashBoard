export default function Topbar({ title, liveCount = 0, children }) {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', gap: '12px',
      flexShrink: 0,
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '16px', fontWeight: 500,
        color: 'var(--color-text-primary)',
        margin: 0, flex: 1,
      }}>
        {title}
      </h1>

      {/* Live indicator */}
      {liveCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px',
          background: 'var(--color-background-danger)',
          borderRadius: '20px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#e8000d',
            animation: 'pulse 1.2s infinite',
          }} />
          <span style={{ fontSize: '11px', color: 'var(--color-text-danger)', fontWeight: 500 }}>
            {liveCount} live
          </span>
        </div>
      )}

      {/* extra buttons passed as children */}
      {children}

      <style>{`@keyframes pulse { 50% { opacity: .3 } }`}</style>
    </div>
  )
}