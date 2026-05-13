import { useEffect, useState } from 'react'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
    display: 'flex', alignItems: 'stretch',
    borderBottom: '2px solid var(--ink)',
    background: 'var(--paper)',
    height: '52px',
  },
  logo: {
    display: 'flex', alignItems: 'center',
    padding: '0 24px',
    borderRight: '2px solid var(--ink)',
    fontFamily: 'var(--display)',
    fontSize: '26px', letterSpacing: '0.04em',
    color: 'var(--ink)', textDecoration: 'none',
    flexShrink: 0,
  },
  slash: { color: 'var(--red)' },
  links: {
    display: 'flex', alignItems: 'center',
    padding: '0 20px', flex: 1,
  },
  navRight: {
    display: 'flex', alignItems: 'center', marginLeft: 'auto',
  },
  tag: {
    padding: '0 16px', height: '100%',
    display: 'flex', alignItems: 'center',
    fontSize: '10px', fontFamily: 'var(--mono)',
    color: 'var(--dim)',
    borderLeft: '1px solid var(--rule)',
  },
  cta: {
    display: 'flex', alignItems: 'center',
    padding: '0 24px', height: '100%',
    background: 'var(--red)', color: '#fff',
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    textDecoration: 'none', cursor: 'none',
    borderLeft: '2px solid var(--ink)',
  },
}

const linkStyle = {
  fontSize: '11px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--dim)', textDecoration: 'none',
  padding: '0 16px', height: '52px',
  display: 'flex', alignItems: 'center',
  borderRight: '1px solid var(--rule)',
  cursor: 'none',
}

export default function Navbar() {
  const [errorCount, setErrorCount] = useState(1284)

  // increment counter to match the live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setErrorCount(prev => prev + 1)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <a href="/" style={styles.logo}>
        CRASH<span style={styles.slash}>/</span>BOARD
      </a>

      {/* Nav Links */}
      <div style={styles.links}>
        <a href="#features" style={{ ...linkStyle, borderLeft: '1px solid var(--rule)' }}>Features</a>
        <a href="#sdk"      style={linkStyle}>SDK</a>
        <a href="#pricing"  style={linkStyle}>Pricing</a>
        <a href="#"         style={linkStyle}>Docs</a>
      </div>

      {/* Right side */}
      <div style={styles.navRight}>
        <div style={styles.tag}>
          ● {errorCount.toLocaleString()} errors captured today
        </div>
        <a href="/login" style={styles.cta}>Start Free →</a>
      </div>
    </nav>
  )
}