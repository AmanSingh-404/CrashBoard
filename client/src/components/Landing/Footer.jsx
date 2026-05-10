const LINKS = ['Features', 'Pricing', 'Docs', 'SDK', 'GitHub', 'Blog', 'Privacy', 'Terms']

export default function Footer() {
  return (
    <footer style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr auto',
    }}>
      {/* Brand */}
      <div style={{ padding: '32px 36px', borderRight: '2px solid var(--ink)' }}>
        <div style={{
          fontFamily: 'var(--display)', fontSize: '28px',
          letterSpacing: '0.04em', color: 'var(--ink)',
        }}>
          CRASH<span style={{ color: 'var(--red)' }}>/</span>BOARD
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--dim)', letterSpacing: '0.08em', marginTop: '8px',
        }}>
          Know before your users do.
        </div>
        <div style={{
          marginTop: '24px', fontFamily: 'var(--mono)',
          fontSize: '10px', color: 'var(--dim)',
        }}>
          Built by Aman Singh · 2025
        </div>
      </div>

      {/* Links */}
      <div style={{
        padding: '32px 40px',
        display: 'flex', gap: '32px',
        flexWrap: 'wrap', alignItems: 'flex-start',
      }}>
        {LINKS.map(link => (
          <a key={link} href="#" style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--dim)', textDecoration: 'none',
            transition: 'color 0.15s', cursor: 'none',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div style={{
        padding: '32px 36px',
        borderLeft: '2px solid var(--ink)',
        fontFamily: 'var(--mono)', fontSize: '10px',
        color: 'var(--dim)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        © 2025 CrashBoard
      </div>
    </footer>
  )
}