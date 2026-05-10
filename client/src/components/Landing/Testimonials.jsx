import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    q: "The AI error explainer is the feature I didn't know I needed. Pasted a cryptic stack trace and it told me exactly which line, why it happened, and showed me the fix. Saved two hours on a Saturday.",
    name: 'Ravi Sharma',
    role: 'FULL STACK · BENGALURU',
    av: 'R', color: '#6366f1',
  },
  {
    q: "I integrated the SDK into my Next.js app and had errors streaming into the dashboard in under five minutes. The session breadcrumbs are game-changing — I finally understand how users actually break things.",
    name: 'Priya Nair',
    role: 'FRONTEND ENGINEER · MUMBAI',
    av: 'P', color: '#f43f5e',
  },
  {
    q: "Source map support changed everything. Our prod bundle is completely minified so stack traces were useless. CrashBoard de-minifies them automatically. I can finally read our own errors.",
    name: 'Arjun Mehta',
    role: 'SDE-2 · HYDERABAD',
    av: 'A', color: '#22c55e',
  },
  {
    q: "We caught a critical payment bug affecting 300 users before a single support ticket came in. CrashBoard alerted us, Gemini explained the fix, and we shipped a patch in 20 minutes. Incredible.",
    name: 'Karan Gupta',
    role: 'TECH LEAD · PUNE',
    av: 'K', color: '#f59e0b',
  },
]

export default function Testimonials() {
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
        gridTemplateColumns: '280px 1fr',
        borderBottom: '2px solid var(--ink)',
      }}
    >
      {/* ── Vertical label ── */}
      <div style={{
        padding: '60px 40px',
        borderRight: '2px solid var(--ink)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'var(--display)', fontSize: '56px',
          lineHeight: 0.92, letterSpacing: '0.03em',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: 'var(--ink)',
        }}>
          WHAT DEVS SAY
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--dim)', letterSpacing: '0.08em',
        }}>
          ★★★★★ 4.9/5
        </div>
      </div>

      {/* ── 2×2 card grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} style={{
            padding: '40px 36px',
            borderRight:  i % 2 === 0 ? '2px solid var(--ink)' : 'none',
            borderBottom: i < 2       ? '2px solid var(--ink)' : 'none',
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '14px', fontWeight: 300, lineHeight: 1.85,
              color: 'var(--dim)', marginBottom: '24px',
              fontStyle: 'italic',
            }}>
              <span style={{
                fontFamily: 'Georgia', fontSize: '40px', lineHeight: 0,
                verticalAlign: '-16px', color: 'var(--red)', marginRight: '2px',
              }}>
                "
              </span>
              {t.q}
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px',
                background: t.color,
                fontFamily: 'var(--display)', fontSize: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
              }}>
                {t.av}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                  {t.name}
                </div>
                <div style={{
                  fontSize: '10px', fontFamily: 'var(--mono)',
                  color: 'var(--dim)', letterSpacing: '0.06em', marginTop: '2px',
                }}>
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 