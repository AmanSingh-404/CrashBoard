import { useEffect, useRef } from 'react'

export default function Cta() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{
      padding: '120px 80px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center',
      borderBottom: '2px solid var(--ink)',
      position: 'relative', overflow: 'hidden',
      background: 'var(--ink)',
    }}>
      {/* Ghost text background */}
      <div style={{
        position: 'absolute',
        fontFamily: 'var(--display)', fontSize: '300px', lineHeight: 0.8,
        color: 'rgba(255,255,255,0.02)', letterSpacing: '0.04em',
        pointerEvents: 'none', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        CRASHBOARD
      </div>

      <h2
        ref={ref}
        className="sr"
        style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(64px, 12vw, 140px)',
          lineHeight: 0.9, letterSpacing: '0.02em',
          color: 'var(--paper)',
          position: 'relative', zIndex: 1,
          marginBottom: '24px',
        }}
      >
        STOP<br />
        <span style={{ color: 'var(--red)' }}>FINDING</span><br />
        <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>BUGS</span><br />
        LATE.
      </h2>

      <p style={{
        fontSize: '15px', fontWeight: 300,
        color: 'rgba(255,255,255,0.4)',
        maxWidth: '440px', lineHeight: 1.8,
        marginBottom: '48px',
        position: 'relative', zIndex: 1,
      }}>
        Join 2,400+ developers who know about errors before their users do.
      </p>

      <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
        <a href="#" style={{
          fontFamily: 'var(--display)', fontSize: '24px',
          letterSpacing: '0.06em',
          padding: '18px 48px',
          background: 'var(--red)', color: '#fff',
          border: '2px solid var(--red)',
          cursor: 'none', textDecoration: 'none',
          transition: 'background 0.15s',
          display: 'inline-block',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#c00009'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
        >
          START FREE →
        </a>
        <a href="#" style={{
          fontFamily: 'var(--display)', fontSize: '24px',
          letterSpacing: '0.06em',
          padding: '18px 36px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.5)',
          border: '2px solid rgba(255,255,255,0.15)',
          cursor: 'none', textDecoration: 'none',
          transition: 'border-color 0.15s, color 0.15s',
          display: 'inline-block',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          READ DOCS
        </a>
      </div>

      <div style={{
        marginTop: '28px',
        fontFamily: 'var(--mono)', fontSize: '10px',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        position: 'relative', zIndex: 1,
      }}>
        No credit card · Free plan forever · 5-minute setup
      </div>
    </section>
  )
}