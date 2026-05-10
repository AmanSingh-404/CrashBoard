import { useEffect, useRef } from 'react'

const STATS = [
  { n: '2.4', suf: 'K', label: 'developers actively\nmonitoring with CrashBoard', bg: '2K' },
  { n: '<50', suf: 'ms', label: 'error to dashboard\naverage alert time', bg: '50' },
  { n: '12',  suf: 'M', label: 'errors captured\nand analyzed this month', bg: '12M' },
  { n: '94',  suf: '%', label: 'AI fix suggestion\naccuracy rate', bg: '94' },
]

export default function Numbers() {
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
    <section
      ref={ref}
      className="sr"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '2px solid var(--ink)',
      }}
    >
      {STATS.map((stat, i) => (
        <div key={i} style={{
          padding: '60px 40px',
          borderRight: i < STATS.length - 1 ? '2px solid var(--ink)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Big number */}
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(60px, 8vw, 100px)',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            color: 'var(--ink)',
          }}>
            {stat.n}
            <span style={{ fontSize: '0.5em', color: 'var(--red)' }}>{stat.suf}</span>
          </div>

          {/* Label */}
          <div style={{
            fontSize: '13px', fontWeight: 300,
            color: 'var(--dim)', marginTop: '16px',
            lineHeight: 1.6, whiteSpace: 'pre-line',
          }}>
            {stat.label}
          </div>

          {/* Background ghost number */}
          <div style={{
            position: 'absolute', bottom: '-20px', right: '-10px',
            fontFamily: 'var(--display)', fontSize: '140px',
            color: 'rgba(0,0,0,0.04)', lineHeight: 1,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            {stat.bg}
          </div>
        </div>
      ))}
    </section>
  )
}