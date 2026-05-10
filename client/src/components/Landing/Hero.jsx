import { useEffect, useRef, useState } from 'react'

const ERR_TYPES = [
  { t: 'TypeError',        s: 'critical', msgs: ["Cannot read 'id' of undefined", "user?.token is null"] },
  { t: 'NetworkError',     s: 'warning',  msgs: ["POST /api/transfer 500", "GET /users timeout"] },
  { t: 'ReferenceError',   s: 'critical', msgs: ["initSDK is not defined", "loadPayment undefined"] },
  { t: 'UnhandledPromise', s: 'info',     msgs: ["Rejection: fetch failed", "async timeout"] },
]
const BROWSERS = ['Chrome', 'Firefox', 'Safari']

const TICKER_ITEMS = [
  { text: "Cannot read 'wallet' of undefined · PaymentGateway.js:147", type: 'hi', label: 'TypeError' },
  { text: '✓ RESOLVED · ReferenceError: initSDK not defined · 2m ago', type: 'go' },
  { text: 'POST /api/transfer 408 Timeout · 203 users affected', type: 'hi', label: 'NetworkError' },
  { text: 'Null check before wallet access · confidence 94%', type: 'go', label: 'AI FIX SUGGESTED' },
  { text: 'Unexpected token in JSON · Bundle.js:1', type: 'hi', label: 'SyntaxError' },
  { text: '12 new errors in last 60s · Dashboard updating', type: 'go', label: '● LIVE' },
]

export default function Hero() {
  const [liveErrors, setLiveErrors] = useState([])

  useEffect(() => {
    const addError = () => {
      const e = ERR_TYPES[Math.floor(Math.random() * ERR_TYPES.length)]
      const m = e.msgs[Math.floor(Math.random() * e.msgs.length)]
      const b = BROWSERS[Math.floor(Math.random() * BROWSERS.length)]
      const t = new Date()
      const ts = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`
      const newErr = { id: Date.now(), type: e.t, severity: e.s, msg: m, browser: b, time: ts }
      setLiveErrors(prev => [newErr, ...prev].slice(0, 4))
    }

    // seed 3 errors immediately
    setTimeout(() => addError(), 400)
    setTimeout(() => addError(), 800)
    setTimeout(() => addError(), 1200)

    const interval = setInterval(addError, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      paddingTop: '52px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto 1fr',
      borderBottom: '2px solid var(--ink)',
      overflow: 'hidden',
    }}>

      {/* ── TICKER ── */}
      <div style={{
        gridColumn: '1 / -1',
        borderBottom: '2px solid var(--ink)',
        padding: '10px 0',
        overflow: 'hidden',
        background: 'var(--ink)',
        display: 'flex',
      }}>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'tick 18s linear infinite',
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} style={{
              fontFamily: 'var(--mono)', fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              padding: '0 32px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: '8px',
              flexShrink: 0,
            }}>
              {item.label && (
                <span style={{ color: item.type === 'hi' ? 'var(--red)' : 'var(--green)', fontWeight: 500 }}>
                  {item.label}
                </span>
              )}
              {item.label && ' · '}
              {item.text}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes slideRight { from { opacity: 0; transform: translateX(12px) } to { opacity: 1; transform: none } }
        `}</style>
      </div>

      {/* ── LEFT — Headline ── */}
      <div style={{
        padding: '60px 56px',
        borderRight: '2px solid var(--ink)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          {/* Label */}
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--dim)',
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '32px',
          }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--red)', display: 'inline-block' }} />
            Error Monitoring · Real-Time · AI-Powered
          </div>

          {/* Big headline */}
          <h1 style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(80px, 12vw, 168px)',
            lineHeight: 0.88,
            letterSpacing: '0.01em',
          }}>
            <div>KNOW</div>
            <div style={{ WebkitTextStroke: '2px var(--red)', color: 'transparent' }}>BEFORE</div>
            <div style={{ WebkitTextStroke: '2px var(--ink)', color: 'transparent' }}>YOUR</div>
            <div>USERS</div>
            <div style={{ WebkitTextStroke: '2px var(--red)', color: 'transparent' }}>DO.</div>
          </h1>

          <p style={{
            marginTop: '40px', fontSize: '15px', fontWeight: 300,
            lineHeight: 1.75, color: 'var(--dim)', maxWidth: '380px',
          }}>
            CrashBoard captures every crash the moment it fires —{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
              before your support inbox fills up.
            </strong>{' '}
            Real-time WebSocket feed. AI that reads your stack trace and writes the fix.
          </p>

          {/* Buttons */}
          <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 32px',
              background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'var(--display)', fontSize: '22px', letterSpacing: '0.06em',
              textDecoration: 'none', cursor: 'none',
              border: '2px solid var(--ink)',
            }}>
              → Start for Free
            </a>
            <a href="#" style={{
              fontFamily: 'var(--mono)', fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--dim)', textDecoration: 'none', cursor: 'none',
              padding: '16px 20px', border: '2px solid var(--ink)',
            }}>
              Watch Demo
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          borderTop: '1px solid var(--rule)',
          paddingTop: '24px',
        }}>
          {[
            { n: '2.4', unit: 'K', label: 'Developers\nmonitoring live' },
            { n: '<50', unit: 'ms', label: 'Error to\ndashboard alert' },
            { n: '12', unit: 'M', label: 'Errors tracked\nthis month' },
          ].map((stat, i, arr) => (
            <div key={i} style={{
              flex: 1,
              paddingRight: i < arr.length - 1 ? '24px' : 0,
              borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
              marginRight: i < arr.length - 1 ? '24px' : 0,
            }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '44px', lineHeight: 1, letterSpacing: '0.02em' }}>
                {stat.n}<span style={{ fontSize: '24px' }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--dim)', letterSpacing: '0.08em', marginTop: '4px', whiteSpace: 'pre-line' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Terminal ── */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--ink)' }}>

        {/* Terminal header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '8px' }}>
            crashboard — live feed — vertex-bank-frontend
          </span>
        </div>

        {/* Terminal body */}
        <div style={{
          flex: 1, padding: '28px 24px',
          fontFamily: 'var(--mono)', fontSize: '12.5px', lineHeight: 2,
          overflow: 'hidden', position: 'relative',
        }}>
          {/* fade at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            background: 'linear-gradient(transparent, var(--ink))',
            pointerEvents: 'none', zIndex: 1,
          }} />

          <TermLine><Prompt />  <Cmd>crashboard init --project vertex-bank</Cmd></TermLine>
          <TermLine><Ok>✓</Ok> SDK initialized · project: <File>vertex-bank-frontend</File></TermLine>
          <TermLine><Ok>✓</Ok> WebSocket connected · latency: <Num>14ms</Num></TermLine>
          <TermLine><Dim>─────────────────────────────────</Dim></TermLine>
          <TermLine><Err>✗ CRITICAL</Err> TypeError · <File>PaymentGateway.js:147</File></TermLine>
          <TermLine>&nbsp;&nbsp;Cannot read properties of <Warn>undefined</Warn> (reading <Num>'wallet'</Num>)</TermLine>
          <TermLine>&nbsp;&nbsp;Users affected: <Err>203</Err> · Occurrences: <Err>284</Err></TermLine>
          <TermLine><Ok>✨ AI</Ok> Null check missing before <File>user.wallet</File> access</TermLine>
          <TermLine><Dim>─────────────────────────────────</Dim></TermLine>
          <TermLine><Warn>⚠ WARNING</Warn> NetworkError · <File>api/transfer:34</File></TermLine>
          <TermLine>&nbsp;&nbsp;POST /api/transfer <Warn>408</Warn> Timeout · <Num>143</Num> occurrences</TermLine>
          <TermLine><Dim>─────────────────────────────────</Dim></TermLine>
          <TermLine>
            <Prompt>● </Prompt>Listening for new errors{' '}
            <span style={{ display: 'inline-block', width: 8, height: 14, background: '#fff', verticalAlign: 'middle', animation: 'blink 0.8s step-end infinite' }} />
          </TermLine>
        </div>

        {/* Live error cards */}
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {liveErrors.map(err => (
            <div key={err.id} style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: `3px solid ${err.severity === 'critical' ? '#ff4444' : err.severity === 'warning' ? '#ffaa00' : '#60a5fa'}`,
              borderRadius: '4px',
              padding: '10px 14px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              animation: 'slideRight 0.3s ease both',
            }}>
              <div style={{
                fontSize: '10px', fontWeight: 500, fontFamily: 'var(--mono)',
                flexShrink: 0, paddingTop: '1px',
                color: err.severity === 'critical' ? '#ff6666' : err.severity === 'warning' ? '#ffcc44' : '#60a5fa',
              }}>
                {err.type}
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.5)', flex: 1, lineHeight: 1.5 }}>
                {err.msg} · {err.browser}
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: '1px' }}>
                {err.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Small terminal helper components ──
const TermLine = ({ children }) => (
  <div style={{ color: 'rgba(255,255,255,0.55)' }}>{children}</div>
)
const Prompt = () => <span style={{ color: 'rgba(255,255,255,0.2)' }}>$ </span>
const Cmd    = ({ children }) => <span style={{ color: '#fff' }}>{children}</span>
const Ok     = ({ children }) => <span style={{ color: 'var(--green)' }}>{children}</span>
const Err    = ({ children }) => <span style={{ color: '#ff4444' }}>{children}</span>
const Warn   = ({ children }) => <span style={{ color: '#ffaa00' }}>{children}</span>
const Dim    = ({ children }) => <span style={{ color: 'rgba(255,255,255,0.2)' }}>{children}</span>
const File   = ({ children }) => <span style={{ color: '#60a5fa' }}>{children}</span>
const Num    = ({ children }) => <span style={{ color: '#f97316' }}>{children}</span>