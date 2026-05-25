import { useEffect } from 'react'
import Navbar from '../components/Landing/Navbar'
import Footer from '../components/Landing/Footer'

const PLANS = [
  {
    tier: 'Hobby', price: '0', per: 'Free forever', hot: false,
    desc: 'Perfect for personal projects and side hustles.',
    features: [
      { yes: true,  text: '1 project' },
      { yes: true,  text: '5,000 errors / month' },
      { yes: true,  text: 'Real-time error feed' },
      { yes: true,  text: 'AI explainer (10 / day)' },
      { yes: true,  text: '7-day error retention' },
      { yes: true,  text: 'Basic analytics' },
      { yes: false, text: 'Source map support' },
      { yes: false, text: 'Session replay' },
      { yes: false, text: 'Team members' },
      { yes: false, text: 'Smart alerts' },
      { yes: false, text: 'Slack integration' },
    ],
    cta: 'Get started free', ctaLink: '/signup',
  },
  {
    tier: 'Pro', price: '799', per: '/ month', hot: true, badge: 'Most popular',
    desc: 'For developers who ship to production and need full visibility.',
    features: [
      { yes: true, text: '10 projects' },
      { yes: true, text: '500,000 errors / month' },
      { yes: true, text: 'Real-time feed + smart alerts' },
      { yes: true, text: 'AI explainer (unlimited)' },
      { yes: true, text: '90-day error retention' },
      { yes: true, text: 'Full analytics dashboard' },
      { yes: true, text: 'Source map support' },
      { yes: true, text: 'Session replay breadcrumbs' },
      { yes: true, text: '3 team members' },
      { yes: true, text: 'Email + Slack alerts' },
      { yes: false,text: 'SSO / SAML' },
    ],
    cta: 'Start 14-day trial', ctaLink: '/signup',
  },
  {
    tier: 'Team', price: '2,499', per: '/ month', hot: false,
    desc: 'For engineering teams that need collaboration and reliability.',
    features: [
      { yes: true, text: 'Unlimited projects' },
      { yes: true, text: '5,000,000 errors / month' },
      { yes: true, text: 'Everything in Pro' },
      { yes: true, text: 'Unlimited team members' },
      { yes: true, text: '1-year error retention' },
      { yes: true, text: 'SSO / SAML' },
      { yes: true, text: 'SLA guarantee' },
      { yes: true, text: 'Priority support' },
      { yes: true, text: 'Custom alert rules' },
      { yes: true, text: 'Audit logs' },
      { yes: true, text: 'Dedicated onboarding' },
    ],
    cta: 'Contact sales', ctaLink: 'mailto:hello@crashboard.dev',
  },
]

const FAQS = [
  { q: 'Is the free plan really free forever?', a: 'Yes. No credit card required, no trial period. The Hobby plan is free forever. You only upgrade when you need more projects, higher error volume, or team features.' },
  { q: 'What counts as an error?', a: 'Every unique error event captured by the SDK counts. Duplicate errors — the same error fingerprint fired multiple times — increment the occurrence counter on the same record, not your quota.' },
  { q: 'Can I change plans anytime?', a: 'Yes. Upgrade or downgrade whenever you want. No lock-in, no cancellation fees.' },
  { q: 'Do you offer student or open source discounts?', a: 'Yes! Students with a valid .edu email get 50% off Pro. Open source projects with a public GitHub repo get Pro free. Contact us to apply.' },
  { q: 'What happens if I exceed my error quota?', a: "We'll notify you before you hit the limit. Errors are still captured — none are dropped. You'll be prompted to upgrade, but we never silently stop monitoring your app." },
  { q: 'Is pricing in INR?', a: 'Yes. CrashBoard is built by Indian developers for Indian developers. All prices are in INR, no currency conversion surprises.' },
]

export default function Pricing() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--body)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ paddingTop: '52px', background: 'var(--ink)', padding: '100px 80px 80px', textAlign: 'center', borderBottom: '2px solid var(--ink)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
          INR pricing · no credit card required · cancel anytime
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(64px,10vw,120px)', lineHeight: .88, letterSpacing: '.02em', color: 'var(--paper)', margin: '0 0 20px' }}>
          SIMPLE<br />
          <span style={{ color: 'var(--red)' }}>PRICING.</span>
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', maxWidth: '440px', lineHeight: 1.8, margin: '0 auto' }}>
          Start free. Upgrade when you grow. No surprise bills, no per-seat nonsense.
        </p>
      </div>

      {/* Pricing cards */}
      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '80px' }}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              style={{
                border: plan.hot ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,0.12)',
                borderRadius: '4px',
                background: plan.hot ? 'var(--ink)' : 'var(--paper)',
                padding: '36px 32px',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
                transform: plan.hot ? 'scale(1.03)' : 'none',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--red)', color: '#fff',
                  fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase',
                  padding: '5px 16px', borderRadius: '20px',
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: plan.hot ? 'rgba(255,255,255,0.4)' : 'var(--dim)', marginBottom: '12px' }}>
                {plan.tier}
              </div>

              <div style={{ fontFamily: 'var(--display)', fontSize: '64px', lineHeight: 1, letterSpacing: '.01em', color: plan.hot ? '#fff' : 'var(--ink)', marginBottom: '4px' }}>
                <span style={{ fontSize: '28px', verticalAlign: 'super' }}>₹</span>{plan.price}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: plan.hot ? 'rgba(255,255,255,0.4)' : 'var(--dim)', marginBottom: '16px' }}>
                {plan.per}
              </div>

              <p style={{ fontSize: '13px', fontWeight: 300, color: plan.hot ? 'rgba(255,255,255,0.5)' : 'var(--dim)', lineHeight: 1.6, marginBottom: '24px' }}>
                {plan.desc}
              </p>

              <div style={{ height: '1px', background: plan.hot ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', marginBottom: '20px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '28px' }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: plan.hot ? 'rgba(255,255,255,0.7)' : 'var(--dim)', lineHeight: 1.4 }}>
                    <span style={{ color: f.yes ? (plan.hot ? '#00e05a' : 'green') : 'rgba(0,0,0,0.2)', fontWeight: 700, flexShrink: 0 }}>
                      {f.yes ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </div>
                ))}
              </div>

              <a
                href={plan.ctaLink}
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '14px', border: `2px solid ${plan.hot ? '#fff' : 'var(--ink)'}`,
                  fontFamily: 'var(--display)', fontSize: '18px', letterSpacing: '.06em',
                  color: plan.hot ? '#fff' : 'var(--ink)', textDecoration: 'none',
                  transition: 'background .15s, color .15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = plan.hot ? '#fff' : 'var(--ink)'
                  e.currentTarget.style.color = plan.hot ? 'var(--ink)' : '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = plan.hot ? '#fff' : 'var(--ink)'
                }}
              >
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Feature comparison note */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--dim)', letterSpacing: '.08em' }}>
            All plans include · Real-time dashboard · AI explainer · Error deduplication · Session breadcrumbs · Core Web Vitals
          </div>
        </div>

        {/* FAQ */}
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '56px', letterSpacing: '.02em', color: 'var(--ink)', marginBottom: '32px' }}>
          FREQUENTLY ASKED
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
                {faq.q}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 300, color: 'var(--dim)', lineHeight: 1.8 }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: '2px solid var(--ink)', background: 'var(--red)', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '56px', color: '#fff', letterSpacing: '.02em', lineHeight: .9, margin: '0 0 16px' }}>
          START FREE TODAY.
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px' }}>
          No credit card · Free plan forever · 5-minute setup
        </p>
        <a href="/signup" style={{ display: 'inline-block', background: '#fff', color: 'var(--red)', fontFamily: 'var(--display)', fontSize: '20px', letterSpacing: '.06em', padding: '14px 40px', textDecoration: 'none', border: '2px solid #fff' }}>
          CREATE FREE ACCOUNT →
        </a>
      </div>

      <Footer />

      <style>{`
        :root { --ink:#0b0c0e; --paper:#f2efe8; --red:#e8000d; --dim:#3a3a3a; --mono:'DM Mono',monospace; --display:'Bebas Neue',sans-serif; --body:'Archivo',sans-serif; }
      `}</style>
    </div>
  )
}