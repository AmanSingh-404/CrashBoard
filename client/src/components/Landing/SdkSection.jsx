import { useEffect, useRef } from 'react'

const STEPS = [
  {
    n: '1',
    title: 'Install the package',
    desc: 'npm install crashboard-sdk — your own published npm package',
  },
  {
    n: '2',
    title: 'Initialize with your API key',
    desc: 'One CrashBoard.init() call in your app entry point',
  },
  {
    n: '3',
    title: 'Watch errors stream in',
    desc: 'Every crash appears on your dashboard in under 50ms',
  },
]

const CODE = `<span style="color:rgba(255,255,255,0.25)">// 1. Install</span>
<span style="color:rgba(255,255,255,0.4)">$ </span><span style="color:#60a5fa">npm</span> install <span style="color:#4ade80">crashboard-sdk</span>

<span style="color:rgba(255,255,255,0.25)">// 2. Initialize (app entry point)</span>
<span style="color:#ff7043">import</span> <span style="color:#c084fc">CrashBoard</span> <span style="color:#ff7043">from</span> <span style="color:#4ade80">'crashboard-sdk'</span><span style="color:rgba(255,255,255,0.4)">;</span>

<span style="color:#c084fc">CrashBoard</span><span style="color:rgba(255,255,255,0.4)">.</span><span style="color:#60a5fa">init</span><span style="color:rgba(255,255,255,0.4)">({</span>
  apiKey<span style="color:rgba(255,255,255,0.4)">:</span> <span style="color:#4ade80">'cb_live_xxxxxxxxxxxx'</span><span style="color:rgba(255,255,255,0.4)">,</span>
  project<span style="color:rgba(255,255,255,0.4)">:</span> <span style="color:#4ade80">'my-app'</span><span style="color:rgba(255,255,255,0.4)">,</span>
  env<span style="color:rgba(255,255,255,0.4)">:</span> <span style="color:#4ade80">'production'</span>
<span style="color:rgba(255,255,255,0.4)">});</span>

<span style="color:rgba(255,255,255,0.25)">// 3. That's it. Auto-captured:</span>
<span style="color:rgba(255,255,255,0.25)">// ✓ TypeError / ReferenceError / SyntaxError</span>
<span style="color:rgba(255,255,255,0.25)">// ✓ Unhandled Promise rejections</span>
<span style="color:rgba(255,255,255,0.25)">// ✓ Network failures &amp; timeouts</span>
<span style="color:rgba(255,255,255,0.25)">// ✓ Core Web Vitals (LCP, FCP, CLS)</span>
<span style="color:rgba(255,255,255,0.25)">// ✓ Breadcrumb trail (last 10 actions)</span>

<span style="color:rgba(255,255,255,0.25)">// Optional: track custom events</span>
<span style="color:#c084fc">CrashBoard</span><span style="color:rgba(255,255,255,0.4)">.</span><span style="color:#60a5fa">track</span><span style="color:rgba(255,255,255,0.4)">(</span><span style="color:#4ade80">'PaymentFailed'</span><span style="color:rgba(255,255,255,0.4)">, {</span>
  userId<span style="color:rgba(255,255,255,0.4)">:</span> user<span style="color:rgba(255,255,255,0.4)">.</span>id<span style="color:rgba(255,255,255,0.4)">,</span>
  amount<span style="color:rgba(255,255,255,0.4)">:</span> txn<span style="color:rgba(255,255,255,0.4)">.</span>amount<span style="color:rgba(255,255,255,0.4)">,</span>
  method<span style="color:rgba(255,255,255,0.4)">:</span> <span style="color:#4ade80">'UPI'</span>
<span style="color:rgba(255,255,255,0.4)">});</span>`

export default function SdkSection() {
  const leftRef  = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    if (leftRef.current)  observer.observe(leftRef.current)
    if (rightRef.current) observer.observe(rightRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="sdk" style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      borderBottom: '2px solid var(--ink)',
    }}>

      {/* ── Left ── */}
      <div ref={leftRef} className="sr-left" style={{ padding: '80px 56px', borderRight: '2px solid var(--ink)' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--red)', marginBottom: '20px',
        }}>
          Developer First · Zero Config
        </div>

        <h2 style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(52px, 7vw, 88px)',
          lineHeight: 0.9, letterSpacing: '0.02em',
          color: 'var(--ink)', marginBottom: '24px',
        }}>
          THREE<br />LINES.<br />
          <span style={{ WebkitTextStroke: '2px var(--ink)', color: 'transparent' }}>FULL</span>
          <br />VISIBILITY.
        </h2>

        <p style={{
          fontSize: '14px', fontWeight: 300, lineHeight: 1.8,
          color: 'var(--dim)', maxWidth: '420px', marginBottom: '40px',
        }}>
          Install the SDK, drop in your API key, ship to production.
          CrashBoard starts watching immediately — no config files,
          no DevOps, no dashboard setup required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '16px',
              padding: '16px 0',
              borderTop: '1px solid var(--rule)',
              borderBottom: i === STEPS.length - 1 ? '1px solid var(--rule)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--display)', fontSize: '28px',
                color: 'var(--red)', lineHeight: 1, flexShrink: 0, width: '28px',
              }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 300, color: 'var(--dim)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — Code block ── */}
      <div ref={rightRef} className="sr-right" style={{
        background: 'var(--ink)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['JavaScript', 'TypeScript', 'React'].map((tab, i) => (
            <div key={tab} style={{
              padding: '12px 20px',
              fontFamily: 'var(--mono)', fontSize: '10px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: i === 0 ? 'var(--paper)' : 'rgba(255,255,255,0.3)',
              background: i === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
            }}>
              {tab}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre style={{
          flex: 1, padding: '32px 28px',
          fontFamily: 'var(--mono)', fontSize: '12.5px', lineHeight: 2,
          color: 'rgba(255,255,255,0.7)',
          overflow: 'auto', margin: 0,
        }}
          dangerouslySetInnerHTML={{ __html: CODE }}
        />
      </div>
    </section>
  )
}