import { useEffect, useRef } from 'react'

const PLANS = [
  {
    tier: 'Hobby',
    price: '0', per: 'Free forever',
    hot: false,
    features: [
      { yes: true,  text: '1 project' },
      { yes: true,  text: '5,000 errors/month' },
      { yes: true,  text: 'Real-time feed' },
      { yes: true,  text: 'AI explainer (10/day)' },
      { yes: true,  text: '7-day retention' },
      { yes: false, text: 'Source maps' },
      { yes: false, text: 'Session replay' },
      { yes: false, text: 'Team members' },
    ],
    cta: 'GET STARTED',
  },
  {
    tier: 'Pro',
    price: '799', per: 'per month',
    hot: true, badge: 'MOST POPULAR',
    features: [
      { yes: true, text: '10 projects' },
      { yes: true, text: '500K errors/month' },
      { yes: true, text: 'Real-time + alerts' },
      { yes: true, text: 'AI explainer (unlimited)' },
      { yes: true, text: '90-day retention' },
      { yes: true, text: 'Source map support' },
      { yes: true, text: 'Session replay' },
      { yes: true, text: '3 team members' },
    ],
    cta: 'START PRO TRIAL',
  },
  {
    tier: 'Team',
    price: '2,499', per: 'per month',
    hot: false,
    features: [
      { yes: true, text: 'Unlimited projects' },
      { yes: true, text: '5M errors/month' },
      { yes: true, text: 'Everything in Pro' },
      { yes: true, text: 'Unlimited members' },
      { yes: true, text: '1-year retention' },
      { yes: true, text: 'SSO / SAML' },
      { yes: true, text: 'SLA guarantee' },
      { yes: true, text: 'Priority support' },
    ],
    cta: 'CONTACT SALES',
  },
]

export default function Pricing() {
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
      id="pricing"
      ref={ref}
      className="sr"
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        borderBottom: '2px solid var(--ink)',
      }}
    >
      {/* ── Left intro ── */}
      <div style={{
        padding: '60px 36px',
        borderRight: '2px solid var(--ink)',
        background: 'var(--ink)', color: 'var(--paper)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--display)', fontSize: '56px',
            lineHeight: 0.92, letterSpacing: '0.03em',
          }}>
            SIMPLE<br />PRICING.
          </div>
          <div style={{
            fontSize: '12px', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.8, marginTop: '16px',
          }}>
            Start free. Upgrade when you grow. No surprise bills, no per-seat nonsense.
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--red)', letterSpacing: '0.08em',
        }}>
          ₹ INR pricing for Indian developers
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {PLANS.map((plan, i) => (
          <div key={i} style={{
            padding: '44px 36px',
            borderRight: i < PLANS.length - 1 ? '2px solid var(--ink)' : 'none',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            background: plan.hot ? 'var(--red)' : 'transparent',
            transition: 'background 0.2s',
          }}>
            {/* Badge */}
            {plan.badge && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--ink)', color: 'var(--paper)',
                fontFamily: 'var(--mono)', fontSize: '9px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '6px 12px',
              }}>
                {plan.badge}
              </div>
            )}

            {/* Tier */}
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: plan.hot ? 'rgba(255,255,255,0.6)' : 'var(--dim)',
              marginBottom: '16px',
            }}>
              {plan.tier}
            </div>

            {/* Price */}
            <div style={{
              fontFamily: 'var(--display)', fontSize: '72px',
              letterSpacing: '0.01em', lineHeight: 1,
              color: plan.hot ? '#fff' : 'var(--ink)',
            }}>
              <sub style={{ fontSize: '24px', verticalAlign: 'super' }}>₹</sub>
              {plan.price}
            </div>

            <div style={{
              fontSize: '11px', fontFamily: 'var(--mono)',
              color: plan.hot ? 'rgba(255,255,255,0.6)' : 'var(--dim)',
              marginBottom: '32px', marginTop: '4px',
            }}>
              {plan.per}
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: plan.hot ? 'rgba(255,255,255,0.2)' : 'var(--rule)',
              marginBottom: '24px',
            }} />

            {/* Features */}
            {plan.features.map((f, j) => (
              <div key={j} style={{
                display: 'flex', gap: '8px',
                fontSize: '12px',
                color: plan.hot ? 'rgba(255,255,255,0.8)' : 'var(--dim)',
                marginBottom: '10px', lineHeight: 1.5,
              }}>
                <span style={{
                  color: plan.hot ? '#fff' : 'var(--ink)',
                  fontWeight: 700, flexShrink: 0,
                  opacity: f.yes ? 1 : 0.25,
                }}>
                  {f.yes ? '✓' : '✗'}
                </span>
                {f.text}
              </div>
            ))}

            {/* CTA button */}
            <button style={{
              marginTop: 'auto', paddingTop: '24px',
              fontFamily: 'var(--display)', fontSize: '20px',
              letterSpacing: '0.06em', cursor: 'pointer',
              background: 'none',
              border: `2px solid ${plan.hot ? '#fff' : 'var(--ink)'}`,
              color: plan.hot ? '#fff' : 'var(--ink)',
              padding: '14px', width: '100%',
              transition: 'background 0.15s, color 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = plan.hot ? '#fff' : 'var(--ink)'
                e.currentTarget.style.color      = plan.hot ? 'var(--red)' : 'var(--paper)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color      = plan.hot ? '#fff' : 'var(--ink)'
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}