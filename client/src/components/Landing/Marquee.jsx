const ITEMS = [
  'REAL-TIME ERRORS',
  'AI STACK TRACE ANALYSIS',
  'SESSION REPLAY',
  'SOURCE MAP SUPPORT',
  'PERFORMANCE MONITORING',
  'TEAM COLLABORATION',
  'npm PACKAGE SDK',
  'SMART ALERTS',
]

export default function Marquee() {
  return (
    <div style={{
      borderTop: '2px solid var(--ink)',
      borderBottom: '2px solid var(--ink)',
      background: 'var(--red)',
      padding: '14px 0',
      overflow: 'hidden',
      display: 'flex',
    }}>
      <style>{`
        @keyframes marq {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>

      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'marq 14s linear infinite',
      }}>
        {/* duplicate for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} style={{
            fontFamily: 'var(--display)',
            fontSize: '22px',
            letterSpacing: '0.08em',
            color: '#fff',
            padding: '0 28px',
            borderRight: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              flexShrink: 0,
            }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}