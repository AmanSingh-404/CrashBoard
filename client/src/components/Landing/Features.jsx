import { useEffect, useRef } from 'react'

const FEATURES = [
  {
    num: '01', icon: '📦', title: 'NPM SDK',
    desc: 'Three lines of code. Publish your own package to npm. Auto-captures TypeError, ReferenceError, Promise rejections, and network failures the moment they occur.',
    tag: 'crashboard-sdk',
  },
  {
    num: '02', icon: '⚡', title: 'LIVE STREAM',
    desc: 'WebSocket connection means zero-delay. Watch errors appear on your dashboard the millisecond they fire in production — full stack trace, OS, browser, user included.',
    tag: 'Socket.io · <50ms',
  },
  {
    num: '03', icon: '🤖', title: 'AI EXPLAINER',
    desc: 'Click any error. Gemini reads the stack trace, explains what broke in plain English, pinpoints the exact line, and writes a fix — with a code snippet you can paste.',
    tag: 'Gemini API',
  },
  {
    num: '04', icon: '🗺️', title: 'SESSION REPLAY',
    desc: 'The SDK records the last 10 user actions before a crash — clicks, navigation, API calls — as a breadcrumb trail. See exactly how users hit the bug.',
    tag: 'Flight recorder',
  },
  {
    num: '05', icon: '📈', title: 'PERFORMANCE',
    desc: 'Track Core Web Vitals — LCP, FCP, CLS, TTFB — using PerformanceObserver. Get alerted when metrics drop after a deploy, before users notice slowness.',
    tag: 'LCP · FCP · CLS',
  },
  {
    num: '06', icon: '🔕', title: 'DEDUPLICATION',
    desc: "Same error from 1,000 users won't create 1,000 rows. Fingerprint by message and stack signature. See '847 occurrences, 203 users' — one clean entry.",
    tag: 'Smart grouping',
  },
  {
    num: '07', icon: '🗂️', title: 'SOURCE MAPS',
    desc: 'Upload your source maps. Every minified stack trace gets de-minified automatically. See original file names and line numbers, not bundle garbage.',
    tag: 'mozilla/source-map',
  },
  {
    num: '08', icon: '🔔', title: 'SMART ALERTS',
    desc: 'Set rules — "alert if same error fires 5× in 10 mins." Notify via email or Slack. Cool-down timers prevent alert fatigue when production is having a bad day.',
    tag: 'Slack · Email · Webhook',
  },
  {
    num: '09', icon: '👥', title: 'TEAM MODE',
    desc: 'Invite teammates, assign errors, comment on stack traces. Multi-project support with unique API keys per project. Everyone sees errors the moment they happen.',
    tag: 'Role-based auth',
  },
]

function FeatureCard({ feature, delay = 0 }) {
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
    <div
      ref={ref}
      className="sr"
      style={{
        padding: '40px 36px',
        borderRight: '2px solid var(--ink)',
        borderBottom: '2px solid var(--ink)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.2s',
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(232,0,13,0.03)'
        e.currentTarget.querySelector('.feat-icon').style.filter = 'none'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.querySelector('.feat-icon').style.filter = 'grayscale(1)'
      }}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '10px',
        color: 'var(--red)', letterSpacing: '0.1em',
        marginBottom: '20px',
      }}>
        {feature.num}
      </div>

      <span
        className="feat-icon"
        style={{ fontSize: '36px', marginBottom: '16px', display: 'block', filter: 'grayscale(1)', transition: 'filter 0.2s' }}
      >
        {feature.icon}
      </span>

      <div style={{
        fontFamily: 'var(--display)', fontSize: '32px',
        letterSpacing: '0.03em', lineHeight: 1,
        marginBottom: '12px', color: 'var(--ink)',
      }}>
        {feature.title}
      </div>

      <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.8, color: 'var(--dim)' }}>
        {feature.desc}
      </p>

      <div style={{
        display: 'inline-block', marginTop: '16px',
        fontFamily: 'var(--mono)', fontSize: '9px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--red)',
        border: '1px solid rgba(232,0,13,0.3)',
        padding: '4px 10px',
      }}>
        {feature.tag}
      </div>
    </div>
  )
}

export default function Features() {
  const introRef = useRef(null)

  useEffect(() => {
    const el = introRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr 1fr',
      gridTemplateRows: 'auto auto',
      borderBottom: '2px solid var(--ink)',
    }}>

      {/* ── Intro panel ── */}
      <div
        ref={introRef}
        className="sr"
        style={{
          gridRow: '1 / 3',
          padding: '64px 48px',
          borderRight: '2px solid var(--ink)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'var(--ink)', color: 'var(--paper)',
        }}
      >
        <div>
          <div style={{
            fontFamily: 'var(--display)', fontSize: '72px',
            lineHeight: 0.9, letterSpacing: '0.02em',
          }}>
            EVERY<br />TOOL<br />YOU<br />
            <span style={{ color: 'var(--red)' }}>NEED.</span>
          </div>
          <div style={{
            fontSize: '13px', fontWeight: 300, lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)', marginTop: '24px',
          }}>
            Nine features built by a developer who's felt the pain of debugging
            production at 2am — for developers in the same position.
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--display)', fontSize: '120px', lineHeight: 1,
          color: 'rgba(255,255,255,0.06)', letterSpacing: '0.02em',
          marginTop: 'auto',
        }}>
          09
        </div>
      </div>

      {/* ── Feature cards (9 cards, 2-col grid) ── */}
      {FEATURES.map((f, i) => (
        <FeatureCard key={f.num} feature={f} delay={i * 60} />
      ))}
    </section>
  )
}