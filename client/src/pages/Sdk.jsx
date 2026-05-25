import { useEffect, useState } from 'react'
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Landing/Footer'

const TABS = ['npm', 'yarn', 'pnpm']
const INSTALL_CMDS = {
  npm:  'npm install crashboard-sdk',
  yarn: 'yarn add crashboard-sdk',
  pnpm: 'pnpm add crashboard-sdk',
}

const CODE_SECTIONS = [
  {
    title: 'Basic setup',
    lang: 'JavaScript',
    code: `import CrashBoard from 'crashboard-sdk'

// Call once at your app's entry point
CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',  // from Settings
  project:   'my-app',
  env:       'production',           // 'development' | 'staging' | 'production'
  ingestUrl: 'https://your-backend.render.com/api/ingest'
})

// That's it! CrashBoard now auto-captures:
// ✓ TypeError, ReferenceError, SyntaxError
// ✓ Unhandled Promise rejections
// ✓ Network failures via fetch
// ✓ Core Web Vitals (LCP, FCP, CLS, TTFB)
// ✓ Breadcrumb trail (last 10 user actions)`,
  },
  {
    title: 'React / Next.js',
    lang: 'React',
    code: `// src/main.jsx  (React)
import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey:  import.meta.env.VITE_CRASHBOARD_KEY,
  project: 'my-react-app',
  env:     import.meta.env.MODE,
})

// pages/_app.jsx  (Next.js)
import CrashBoard from 'crashboard-sdk'

if (typeof window !== 'undefined') {
  CrashBoard.init({
    apiKey:  process.env.NEXT_PUBLIC_CRASHBOARD_KEY,
    project: 'my-nextjs-app',
    env:     process.env.NODE_ENV,
  })
}`,
  },
  {
    title: 'Custom error capture',
    lang: 'JavaScript',
    code: `// Inside a try/catch block
try {
  await processPayment(user)
} catch (error) {
  CrashBoard.captureException(error)
  showUserFriendlyMessage()
}

// Custom event tracking
CrashBoard.track('PaymentFailed', {
  userId:  user.id,
  amount:  txn.amount,
  method:  'UPI',
  reason:  error.message,
})

// Both are sent to your dashboard instantly`,
  },
  {
    title: 'Environment variables',
    lang: 'env',
    code: `# .env
VITE_CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx

# .env.production
VITE_CRASHBOARD_KEY=cb_live_production_key
NODE_ENV=production

# Never commit your API key to git
# Add .env to .gitignore`,
  },
]

const API_METHODS = [
  {
    method: 'CrashBoard.init(config)',
    desc: 'Initialize the SDK. Call once at app startup.',
    params: [
      { name: 'apiKey',     type: 'string',  req: true,  desc: 'Your project API key from Settings' },
      { name: 'project',    type: 'string',  req: false, desc: 'Project name label' },
      { name: 'env',        type: 'string',  req: false, desc: "'production' | 'staging' | 'development'" },
      { name: 'ingestUrl',  type: 'string',  req: false, desc: 'Your backend URL (default: localhost:5000)' },
    ],
  },
  {
    method: 'CrashBoard.captureException(error)',
    desc: 'Manually capture an error from a try/catch block.',
    params: [
      { name: 'error', type: 'Error', req: true, desc: 'Any Error object or string' },
    ],
  },
  {
    method: 'CrashBoard.track(event, data)',
    desc: 'Send a custom event to your dashboard.',
    params: [
      { name: 'event', type: 'string', req: true,  desc: 'Event name e.g. "PaymentFailed"' },
      { name: 'data',  type: 'object', req: false, desc: 'Any additional context data' },
    ],
  },
]

export default function Sdk() {
  const [installTab, setInstallTab] = useState('npm')
  const [copied,     setCopied]     = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--body)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        paddingTop: '52px',
        background: 'var(--ink)',
        padding: '100px 80px 80px',
        textAlign: 'center',
        borderBottom: '2px solid var(--ink)',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
          crashboard-sdk · open source · MIT license
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(64px,10vw,120px)', lineHeight: .88, letterSpacing: '.02em', color: 'var(--paper)', margin: '0 0 24px' }}>
          THREE LINES.<br />
          <span style={{ WebkitTextStroke: '2px var(--red)', color: 'transparent' }}>FULL VISIBILITY.</span>
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', maxWidth: '480px', lineHeight: 1.8, margin: '0 auto 40px' }}>
          Install the SDK, drop in your API key, ship to production. CrashBoard starts watching immediately.
        </p>

        {/* Install command */}
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setInstallTab(t)} style={{
                padding: '10px 20px', background: 'none', border: 'none',
                fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.08em',
                textTransform: 'uppercase', cursor: 'pointer',
                color: installTab === t ? '#fff' : 'rgba(255,255,255,0.3)',
                background: installTab === t ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderBottom: installTab === t ? '2px solid var(--red)' : '2px solid transparent',
              }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(255,255,255,0.04)',
            padding: '16px 20px',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>$</span>
            <code style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#fff', flex: 1, textAlign: 'left' }}>
              {INSTALL_CMDS[installTab]}
            </code>
            <button
              onClick={() => copy(INSTALL_CMDS[installTab], 'install')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === 'install' ? 'var(--green)' : 'rgba(255,255,255,0.3)', fontSize: '14px', flexShrink: 0 }}
            >
              {copied === 'install' ? '✓' : '⎘'}
            </button>
          </div>
        </div>
      </div>

      {/* Code sections */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '48px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '40px' }}>
          QUICK START
        </h2>

        {CODE_SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <span style={{ fontFamily: 'var(--display)', fontSize: '22px', letterSpacing: '.04em', color: 'var(--ink)' }}>
                  {i + 1}. {section.title}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--dim)', marginLeft: '12px', padding: '2px 8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '3px' }}>
                  {section.lang}
                </span>
              </div>
              <button
                onClick={() => copy(section.code, `code-${i}`)}
                style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '4px 12px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '3px', background: 'transparent', cursor: 'pointer', color: copied === `code-${i}` ? 'green' : 'var(--dim)' }}
              >
                {copied === `code-${i}` ? 'copied ✓' : 'copy'}
              </button>
            </div>
            <div style={{ background: 'var(--ink)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '7px' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <pre style={{ margin: 0, padding: '20px 24px', fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.9, color: 'rgba(255,255,255,0.65)', overflowX: 'auto', whiteSpace: 'pre' }}>
                {section.code}
              </pre>
            </div>
          </div>
        ))}

        {/* API Reference */}
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '48px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '24px', marginTop: '60px' }}>
          API REFERENCE
        </h2>

        {API_METHODS.map((api, i) => (
          <div key={i} style={{ marginBottom: '24px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <code style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#60a5fa' }}>{api.method}</code>
            </div>
            <div style={{ padding: '14px 20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--dim)', margin: '0 0 14px', lineHeight: 1.6 }}>{api.desc}</p>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    {['Param','Type','Required','Description'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--dim)', fontWeight: 500, fontFamily: 'var(--mono)', letterSpacing: '.06em', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {api.params.map((p, j) => (
                    <tr key={j} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '8px 10px' }}><code style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink)' }}>{p.name}</code></td>
                      <td style={{ padding: '8px 10px' }}><code style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#7c3aed' }}>{p.type}</code></td>
                      <td style={{ padding: '8px 10px', color: p.req ? 'var(--red)' : 'var(--dim)' }}>{p.req ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--dim)' }}>{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* What gets captured */}
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '48px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '24px', marginTop: '60px' }}>
          WHAT GETS CAPTURED
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { icon: '❌', title: 'JS Errors',       desc: 'TypeError, ReferenceError, SyntaxError via window.onerror' },
            { icon: '⚠️', title: 'Promise Rejections', desc: 'Unhandled promise rejections via unhandledrejection event' },
            { icon: '🌐', title: 'Network Failures',   desc: 'Failed fetch calls via fetch monkey-patching' },
            { icon: '🖱️', title: 'Click Events',       desc: 'User clicks with element label for breadcrumb trail' },
            { icon: '🗺️', title: 'Navigation',         desc: 'Route changes via history.pushState + popstate' },
            { icon: '📊', title: 'Web Vitals',         desc: 'LCP, FCP, CLS, TTFB via PerformanceObserver' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '4px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--dim)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        :root { --ink:#0b0c0e; --paper:#f2efe8; --red:#e8000d; --green:#00e05a; --dim:#3a3a3a; --mono:'DM Mono',monospace; --display:'Bebas Neue',sans-serif; --body:'Archivo',sans-serif; }
      `}</style>
    </div>
  )
}