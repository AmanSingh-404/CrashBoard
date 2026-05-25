import { useEffect, useState } from 'react'
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Landing/Footer'

const SECTIONS = [
  {
    id: 'getting-started', title: 'Getting started',
    items: ['Introduction', 'Quick start', 'Creating a project', 'Getting your API key'],
  },
  {
    id: 'sdk', title: 'SDK',
    items: ['Installation', 'Configuration', 'Auto-captured events', 'Manual capture', 'Custom events', 'Breadcrumbs', 'Web Vitals'],
  },
  {
    id: 'dashboard', title: 'Dashboard',
    items: ['Overview', 'Error feed', 'Error detail', 'Analytics', 'Performance', 'Source maps', 'Session replay'],
  },
  {
    id: 'alerts', title: 'Alerts',
    items: ['Creating alert rules', 'Email alerts', 'Slack integration', 'Cooldown timers'],
  },
  {
    id: 'team', title: 'Team',
    items: ['Inviting members', 'Roles and permissions', 'Comments', 'Assigning errors'],
  },
  {
    id: 'api', title: 'API Reference',
    items: ['Authentication', 'Errors', 'Projects', 'Alerts', 'Team', 'Ingest webhook'],
  },
]

const DOCS_CONTENT = {
  'Introduction': {
    title: 'Introduction',
    content: [
      { type: 'p', text: 'CrashBoard is a real-time error monitoring platform that captures crashes, errors, and performance issues from any JavaScript app and surfaces them on a live dashboard — with AI-powered debugging built in.' },
      { type: 'p', text: 'Think of it as a mini-Sentry you built yourself. It ships with a published npm SDK, Socket.io live feed, Gemini AI error analysis, source map de-minification, session replay breadcrumbs, and team collaboration.' },
      { type: 'h3', text: 'How it works' },
      { type: 'steps', steps: [
        { num: '1', title: 'Install the SDK', desc: 'Add crashboard-sdk to your app with npm install. One init() call at startup.' },
        { num: '2', title: 'Errors get captured', desc: 'The SDK hooks into window.onerror, unhandledrejection, and fetch automatically.' },
        { num: '3', title: 'Webhook ingest', desc: 'Errors POST to your backend with the project API key for authentication.' },
        { num: '4', title: 'Live dashboard', desc: 'Socket.io broadcasts errors to your dashboard in under 50ms. Gemini AI explains them.' },
      ]},
      { type: 'h3', text: 'Tech stack' },
      { type: 'table', headers: ['Layer', 'Technology'], rows: [
        ['Frontend', 'React + Recharts'],
        ['Backend', 'Node.js + Express'],
        ['Database', 'MongoDB'],
        ['Real-time', 'Socket.io'],
        ['AI', 'Google Gemini API'],
        ['Email', 'Nodemailer'],
        ['SDK', 'crashboard-sdk (npm)'],
      ]},
    ],
  },
  'Quick start': {
    title: 'Quick start',
    content: [
      { type: 'p', text: 'Get CrashBoard capturing errors in your app in under 5 minutes.' },
      { type: 'h3', text: 'Step 1 — Create an account' },
      { type: 'p', text: 'Go to the signup page and create a free account. No credit card required.' },
      { type: 'h3', text: 'Step 2 — Create a project' },
      { type: 'p', text: 'In Settings, create a new project for your app. You\'ll get a unique API key — copy it.' },
      { type: 'h3', text: 'Step 3 — Install the SDK' },
      { type: 'code', lang: 'bash', text: 'npm install crashboard-sdk' },
      { type: 'h3', text: 'Step 4 — Initialize' },
      { type: 'code', lang: 'javascript', text: `import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',
  project:   'my-app',
  env:       'production',
  ingestUrl: 'https://your-backend.render.com/api/ingest'
})` },
      { type: 'h3', text: 'Step 5 — Trigger a test error' },
      { type: 'code', lang: 'javascript', text: `// Open browser console and run:
null.crash

// Check your dashboard — the error appears instantly!` },
      { type: 'callout', variant: 'success', text: 'That\'s it! Your app is now being monitored. Every unhandled error will appear on your dashboard in real time.' },
    ],
  },
  'Installation': {
    title: 'SDK Installation',
    content: [
      { type: 'p', text: 'The crashboard-sdk is a lightweight npm package with zero runtime dependencies. It works in any JavaScript environment that runs in a browser.' },
      { type: 'code', lang: 'bash', text: `# npm
npm install crashboard-sdk

# yarn
yarn add crashboard-sdk

# pnpm
pnpm add crashboard-sdk` },
      { type: 'h3', text: 'Browser compatibility' },
      { type: 'table', headers: ['Browser', 'Minimum version'], rows: [
        ['Chrome', '61+'],
        ['Firefox', '60+'],
        ['Safari', '12+'],
        ['Edge', '79+'],
      ]},
      { type: 'callout', variant: 'info', text: 'The SDK uses PerformanceObserver for Web Vitals. This is available in all modern browsers. Older browsers still capture JS errors — they just skip the vitals.' },
    ],
  },
  'Configuration': {
    title: 'SDK Configuration',
    content: [
      { type: 'p', text: 'Pass a config object to CrashBoard.init(). Only apiKey is required.' },
      { type: 'code', lang: 'javascript', text: `CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx', // required
  project:   'my-app',              // optional label
  env:       'production',          // optional
  ingestUrl: 'https://...',         // your backend URL
})` },
      { type: 'h3', text: 'Config options' },
      { type: 'table', headers: ['Option', 'Type', 'Default', 'Description'], rows: [
        ['apiKey',    'string', '—',               'Your project API key (required)'],
        ['project',   'string', '""',              'Project name label for logs'],
        ['env',       'string', '"production"',    'Environment tag on error records'],
        ['ingestUrl', 'string', 'localhost:5000', 'Your backend ingest URL'],
      ]},
    ],
  },
  'Authentication': {
    title: 'API Authentication',
    content: [
      { type: 'p', text: 'CrashBoard uses two authentication methods depending on the endpoint.' },
      { type: 'h3', text: 'JWT Bearer token' },
      { type: 'p', text: 'All dashboard API endpoints require a JWT token in the Authorization header. Get a token by calling the login endpoint.' },
      { type: 'code', lang: 'bash', text: `curl -X POST https://your-backend.render.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword"}'` },
      { type: 'code', lang: 'javascript', text: `// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "name": "...", "email": "..." }
}

// Use in subsequent requests:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` },
      { type: 'h3', text: 'API Key (ingest endpoint)' },
      { type: 'p', text: 'The ingest endpoint uses the project API key passed in the URL. This is handled automatically by the SDK.' },
      { type: 'code', lang: 'bash', text: `POST /api/ingest/:apiKey
# No Authorization header needed — API key is in the URL` },
    ],
  },
  'Errors': {
    title: 'Errors API',
    content: [
      { type: 'p', text: 'Endpoints for fetching, filtering, and updating errors.' },
      { type: 'table', headers: ['Method', 'Endpoint', 'Description'], rows: [
        ['GET',   '/api/errors/:projectId',                      'Get all errors (paginated)'],
        ['GET',   '/api/errors/:projectId/:errorId',             'Get single error detail'],
        ['PATCH', '/api/errors/:projectId/:errorId/status',      'Update status (open/resolved/ignored)'],
        ['PATCH', '/api/errors/:projectId/:errorId/assign',      'Assign to team member'],
        ['POST',  '/api/errors/:projectId/:errorId/explain',     'Trigger AI analysis'],
        ['GET',   '/api/errors/:projectId/analytics',            'Get analytics data'],
        ['GET',   '/api/errors/:projectId/performance',          'Get Web Vitals data'],
        ['DELETE','/api/errors/:projectId/:errorId',             'Delete error'],
      ]},
      { type: 'h3', text: 'Query parameters' },
      { type: 'table', headers: ['Param', 'Type', 'Description'], rows: [
        ['status',      'string', 'Filter by status: open, resolved, ignored'],
        ['type',        'string', 'Filter by error type e.g. TypeError'],
        ['environment', 'string', 'Filter by env: production, staging, development'],
        ['page',        'number', 'Page number (default: 1)'],
        ['limit',       'number', 'Items per page (default: 20, max: 100)'],
      ]},
    ],
  },
}

function DocContent({ doc }) {
  if (!doc) return (
    <div style={{ padding: '40px 0', color: 'var(--dim)', fontSize: '13px' }}>
      Select a topic from the sidebar.
    </div>
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: '48px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '24px', lineHeight: .9 }}>
        {doc.title.toUpperCase()}
      </h1>
      {doc.content.map((block, i) => {
        if (block.type === 'p') return (
          <p key={i} style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'var(--dim)', marginBottom: '16px' }}>
            {block.text}
          </p>
        )
        if (block.type === 'h3') return (
          <h3 key={i} style={{ fontFamily: 'var(--display)', fontSize: '28px', letterSpacing: '.03em', color: 'var(--ink)', margin: '28px 0 12px' }}>
            {block.text.toUpperCase()}
          </h3>
        )
        if (block.type === 'code') return (
          <div key={i} style={{ marginBottom: '20px' }}>
            <div style={{ background: 'var(--ink)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{block.lang}</span>
              </div>
              <pre style={{ margin: 0, padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: '12px', lineHeight: 1.9, color: 'rgba(255,255,255,0.65)', overflowX: 'auto', whiteSpace: 'pre' }}>
                {block.text}
              </pre>
            </div>
          </div>
        )
        if (block.type === 'callout') return (
          <div key={i} style={{
            padding: '14px 18px', marginBottom: '20px',
            borderLeft: `3px solid ${block.variant === 'success' ? 'green' : '#4d9fff'}`,
            background: block.variant === 'success' ? 'rgba(0,200,100,0.06)' : 'rgba(77,159,255,0.06)',
            borderRadius: '0 4px 4px 0',
            fontSize: '13px', color: 'var(--dim)', lineHeight: 1.7,
          }}>
            {block.text}
          </div>
        )
        if (block.type === 'table') return (
          <div key={i} style={{ marginBottom: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  {block.headers.map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--dim)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {row.map((cell, k) => (
                      <td key={k} style={{ padding: '10px 12px', color: k === 0 ? 'var(--ink)' : 'var(--dim)', fontFamily: k === 0 ? 'var(--mono)' : 'var(--body)', fontSize: k === 0 ? '12px' : '13px', fontWeight: k === 0 ? 500 : 300 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        if (block.type === 'steps') return (
          <div key={i} style={{ marginBottom: '24px' }}>
            {block.steps.map((step, j) => (
              <div key={j} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{step.title}</div>
                  <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--dim)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )
        return null
      })}
    </div>
  )
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('Introduction')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--body)' }}>
      <Navbar />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 52px)', paddingTop: '52px' }}>

        {/* Sidebar */}
        <div style={{ borderRight: '1px solid rgba(0,0,0,0.1)', padding: '32px 0', position: 'sticky', top: '52px', height: 'calc(100vh - 52px)', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '0 20px 16px', fontFamily: 'var(--display)', fontSize: '20px', letterSpacing: '.04em', color: 'var(--ink)', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '12px' }}>
            DOCS
          </div>
          {SECTIONS.map(section => (
            <div key={section.id} style={{ marginBottom: '8px' }}>
              <div style={{ padding: '6px 20px', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dim)', marginTop: '12px' }}>
                {section.title}
              </div>
              {section.items.map(item => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '7px 20px', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: activeSection === item ? 500 : 400,
                    color: activeSection === item ? 'var(--ink)' : 'var(--dim)',
                    background: activeSection === item ? 'rgba(232,0,13,0.06)' : 'transparent',
                    borderLeft: activeSection === item ? '2px solid var(--red)' : '2px solid transparent',
                    transition: 'all .1s',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '48px 60px', maxWidth: '780px' }}>
          <DocContent doc={DOCS_CONTENT[activeSection]} />

          {!DOCS_CONTENT[activeSection] && (
            <div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '48px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: .9 }}>
                {activeSection.toUpperCase()}
              </h1>
              <div style={{ padding: '20px 24px', background: 'rgba(232,0,13,0.04)', border: '1px solid rgba(232,0,13,0.15)', borderLeft: '3px solid var(--red)', borderRadius: '0 4px 4px 0', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.7 }}>
                This section is coming soon. In the meantime, check the other docs pages or ask in the community.
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        :root { --ink:#0b0c0e; --paper:#f2efe8; --red:#e8000d; --dim:#3a3a3a; --mono:'DM Mono',monospace; --display:'Bebas Neue',sans-serif; --body:'Archivo',sans-serif; }
      `}</style>
    </div>
  )
}