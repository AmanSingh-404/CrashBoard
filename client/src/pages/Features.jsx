import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar  from '../components/Landing/Navbar'
import Footer  from '../components/Landing/Footer'

const FEATURES = [
  {
    num: '01', icon: '📦', title: 'NPM SDK',
    tag: 'crashboard-sdk',
    color: '#e8000d',
    desc: 'Publish a real npm package that developers integrate in 3 lines of code. Automatically captures unhandled errors, promise rejections, API failures, console errors, and custom events the moment they occur in production.',
    bullets: [
      'window.onerror + unhandledrejection hooks',
      'Fetch interceptor for network failures',
      'Breadcrumb trail — last 10 user actions',
      'Core Web Vitals via PerformanceObserver',
      'Custom event tracking via CrashBoard.track()',
    ],
    code: `import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey: 'cb_live_xxxxxxxxxxxx',
  project: 'my-app',
  env: 'production'
})`,
  },
  {
    num: '02', icon: '⚡', title: 'Real-Time Error Feed',
    tag: 'Socket.io · <50ms',
    color: '#ffaa00',
    desc: 'Every crash hits your backend via webhook and is broadcast to the dashboard live using Socket.io rooms. See error type, stack trace, browser, OS, user agent, timestamp, and affected user count — all in real time.',
    bullets: [
      'Socket.io project rooms — errors go to the right dashboard',
      'Under 50ms from crash to dashboard alert',
      'Browser and OS detection from user agent',
      'Live occurrence counter — updates on duplicates',
      'Auto-reconnect if connection drops',
    ],
  },
  {
    num: '03', icon: '🤖', title: 'AI Error Explainer',
    tag: 'Gemini API',
    color: '#c084fc',
    desc: 'Click any error. Gemini reads the full stack trace, explains in plain English what caused it, pinpoints the exact line, and writes a fix with a code snippet you can paste directly. Cached so the API is only called once per error.',
    bullets: [
      'Gemini 1.5 Flash for fast analysis',
      'Identifies root cause in one sentence',
      'Suggests exact code fix with snippet',
      'Confidence score on every suggestion',
      'Cached in DB — no duplicate API calls',
    ],
  },
  {
    num: '04', icon: '🔑', title: 'API Key System',
    tag: 'Multi-project',
    color: '#4d9fff',
    desc: 'Users create multiple projects — "My Portfolio", "Vertex Bank". Each gets a UUID-based API key. The SDK sends this key with every error payload for routing. Full CRUD for project management with role-based access.',
    bullets: [
      'UUID v4 API keys — cb_live_xxxx format',
      'JWT authentication with 7-day tokens',
      'Regenerate key without losing error history',
      'Role-based access — owner vs member',
      'Unlimited projects on paid plans',
    ],
  },
  {
    num: '05', icon: '👥', title: 'Team Collaboration',
    tag: 'Email invite · Comments',
    color: '#00e05a',
    desc: 'Invite teammates to a project via email. Team members can view errors, add comments on specific errors, assign errors to teammates, and mark them resolved. Built for org-level usage.',
    bullets: [
      'Email invite with 24-hour token expiry',
      'Comments thread on every error',
      'Assign errors to team members',
      'Resolve / ignore / reopen workflow',
      'Real-time comment updates via Socket.io',
    ],
  },
  {
    num: '06', icon: '📊', title: 'Error Analytics',
    tag: 'Recharts',
    color: '#e8000d',
    desc: 'Visual insights into your error landscape. Error frequency over time, top 5 most recurring errors, browser breakdown pie chart, error resolution rate, and status breakdown. Filter by date range and error type.',
    bullets: [
      'Errors over time — 7-day bar chart',
      'Status breakdown donut chart',
      'Top error types horizontal bar',
      'Browser breakdown with progress bars',
      'Resolution rate tracking',
    ],
  },
  {
    num: '07', icon: '🔔', title: 'Smart Alerts',
    tag: 'Nodemailer · Slack',
    color: '#ffaa00',
    desc: 'Configure thresholds — "Alert me if the same error fires 5+ times in 10 minutes." Sends email via Nodemailer and Slack webhook notifications. Cool-down timers prevent alert fatigue.',
    bullets: [
      'Configurable threshold + time window',
      'Email alerts via Nodemailer',
      'Slack webhook integration',
      '30-minute cooldown to prevent spam',
      'Pause / resume any alert rule',
    ],
  },
  {
    num: '08', icon: '🗺️', title: 'Session Replay',
    tag: 'Breadcrumbs',
    color: '#4d9fff',
    desc: 'When an error fires, the SDK captures the last 10 user actions as a breadcrumb trail. Dashboard shows a visual timeline of clicks, navigation, and API calls before the crash — like a flight recorder.',
    bullets: [
      'Click events with element label',
      'Navigation events via history.pushState hook',
      'API call tracking via fetch interceptor',
      'Timestamped timeline in error detail',
      'CRASH marker on the final event',
    ],
  },
  {
    num: '09', icon: '📈', title: 'Performance Monitoring',
    tag: 'Core Web Vitals',
    color: '#00e05a',
    desc: 'SDK tracks Core Web Vitals using PerformanceObserver API. Dashboard shows LCP, FCP, CLS, TTFB scores per error with Good / Needs work / Poor ratings based on Google thresholds.',
    bullets: [
      'LCP — Largest Contentful Paint',
      'FCP — First Contentful Paint',
      'CLS — Cumulative Layout Shift',
      'TTFB — Time to First Byte',
      'Slowest pages breakdown',
    ],
  },
  {
    num: '10', icon: '🗂️', title: 'Source Map Support',
    tag: 'mozilla/source-map',
    color: '#c084fc',
    desc: 'Upload your source maps. When CrashBoard receives a minified stack trace, it de-minifies automatically. Dashboard shows original file names and line numbers instead of bundle garbage like "a.min.js:1".',
    bullets: [
      'Upload .map files via dashboard',
      'Local storage or AWS S3',
      'Auto de-minifies on ingest',
      'De-minified badge on stack traces',
      'Test de-minification UI built in',
    ],
  },
  {
    num: '11', icon: '🔕', title: 'Error Deduplication',
    tag: 'Fingerprinting',
    color: '#ffaa00',
    desc: 'Same error from 1,000 users won\'t create 1,000 records. Backend fingerprints errors by message + stack trace signature using MD5. Dashboard shows "847 occurrences, 203 users" — one clean entry.',
    bullets: [
      'MD5 fingerprint from type + message + stack',
      'Occurrence counter increments on duplicates',
      'Affected users counter',
      'First seen / last seen timestamps',
      'Group view in all errors table',
    ],
  },
]

export default function Features() {
  useEffect(() => {
    window.scrollTo(0, 0)
    // scroll reveal
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none'; obs.unobserve(e.target) } }),
      { threshold: 0.06 }
    )
    document.querySelectorAll('.feat-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--body)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        paddingTop: '52px',
        borderBottom: '2px solid var(--ink)',
        background: 'var(--ink)',
        padding: '120px 80px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
          11 features · production-grade · built for developers
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(64px,10vw,120px)', lineHeight: .88, letterSpacing: '.02em', color: 'var(--paper)', margin: '0 0 24px' }}>
          EVERY TOOL<br />
          <span style={{ WebkitTextStroke: '2px var(--red)', color: 'transparent' }}>YOU NEED.</span>
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', maxWidth: '520px', lineHeight: 1.8, margin: 0 }}>
          CrashBoard ships with everything a production app needs — from real-time error capture to AI-powered debugging. No plugins. No add-ons.
        </p>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px' }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.num}
            className="feat-reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
              gap: '60px',
              marginBottom: '80px',
              paddingBottom: '80px',
              borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
              opacity: 0,
              transform: 'translateY(24px)',
              transition: 'opacity .6s ease, transform .6s ease',
              direction: i % 2 === 0 ? 'ltr' : 'rtl',
            }}
          >
            {/* Text */}
            <div style={{ direction: 'ltr' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: f.color, letterSpacing: '.1em' }}>{f.num}</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', padding: '2px 10px', border: `1px solid ${f.color}33`, color: f.color, borderRadius: '4px' }}>{f.tag}</span>
              </div>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{f.icon}</div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '56px', letterSpacing: '.02em', lineHeight: .9, color: 'var(--ink)', margin: '0 0 16px' }}>
                {f.title}
              </h2>
              <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'var(--dim)', margin: '0 0 24px', maxWidth: '420px' }}>
                {f.desc}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {f.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--dim)', marginBottom: '8px', lineHeight: 1.5 }}>
                    <span style={{ color: f.color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual */}
            <div style={{ direction: 'ltr', display: 'flex', alignItems: 'center' }}>
              {f.code ? (
                <div style={{ width: '100%', background: 'var(--ink)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '7px' }}>
                    {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
                  </div>
                  <pre style={{ margin: 0, padding: '20px', fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.9, color: 'rgba(255,255,255,0.65)', whiteSpace: 'pre-wrap' }}>
                    {f.code}
                  </pre>
                </div>
              ) : (
                <div style={{ width: '100%', background: 'var(--ink)', borderRadius: '4px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {f.title} · live preview
                  </div>
                  {f.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', borderLeft: `2px solid ${f.color}` }}>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: f.color, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ borderTop: '2px solid var(--ink)', background: 'var(--ink)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px,8vw,96px)', color: 'var(--paper)', lineHeight: .9, margin: '0 0 24px' }}>
          READY TO<br /><span style={{ color: 'var(--red)' }}>START?</span>
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '36px' }}>
          All 11 features. Free plan forever.
        </p>
        <a href="/signup" style={{ display: 'inline-block', background: 'var(--red)', color: '#fff', fontFamily: 'var(--display)', fontSize: '22px', letterSpacing: '.06em', padding: '16px 48px', textDecoration: 'none', border: '2px solid var(--red)' }}>
          START FREE →
        </a>
      </div>

      <Footer />

      <style>{`
        :root { --ink:#0b0c0e; --paper:#f2efe8; --red:#e8000d; --dim:#3a3a3a; --mono:'DM Mono',monospace; --display:'Bebas Neue',sans-serif; --body:'Archivo',sans-serif; }
      `}</style>
    </div>
  )
}