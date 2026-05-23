import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/* ── TERMINAL LINES ── */
const buildLines = (pathname) => [
  { text: '$ crashboard analyze --error RouteNotFoundError', type: 'cmd',   delay: 200 },
  { text: '',                                                                type: 'blank', delay: 100 },
  { text: '✓ Error captured · severity: CRITICAL',                          type: 'ok',    delay: 400 },
  { text: '✓ Session breadcrumbs attached (8 events)',                      type: 'ok',    delay: 300 },
  { text: '✓ User agent fingerprinted · 1 affected',                        type: 'ok',    delay: 300 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '─── Scanning route configuration ───',                           type: 'dim',   delay: 400 },
  { text: '',                                                                type: 'blank', delay: 100 },
  { text: '  Routes registered: 14',                                        type: 'plain', delay: 300 },
  { text: '  Routes matched: 0',                                            type: 'err',   delay: 300 },
  { text: `  Path requested: ${pathname}`,                                  type: 'file',  delay: 200 },
  { text: '  Fallback handler: NOT FOUND',                                  type: 'err',   delay: 400 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '─── Breadcrumb trail ───',                                       type: 'dim',   delay: 300 },
  { text: '',                                                                type: 'blank', delay: 100 },
  { text: '  [8] Clicked navigation link',                                  type: 'plain', delay: 250 },
  { text: '  [7] history.pushState called',                                 type: 'plain', delay: 200 },
  { text: '  [6] Router.navigate fired',                                    type: 'plain', delay: 200 },
  { text: '  [5] Route resolution failed ← ERROR',                         type: 'err',   delay: 300 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '─── Gemini AI analysis ───',                                     type: 'dim',   delay: 500 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '  Loading model... ████████░░ 80%',                              type: 'ai',    delay: 400 },
  { text: '  Loading model... ██████████ 100%',                             type: 'ai',    delay: 600 },
  { text: '',                                                                type: 'blank', delay: 300 },
  { text: '  Root cause identified:',                                       type: 'ai',    delay: 400 },
  { text: '  Missing catch-all <Route path="*"> handler.',                  type: 'ai',    delay: 300 },
  { text: '  React Router v6 requires explicit fallback.',                  type: 'ai',    delay: 300 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '  Fix confidence: 97%',                                          type: 'ok',    delay: 400 },
  { text: '  Est. resolution time: ~3 mins',                                type: 'ok',    delay: 300 },
  { text: '',                                                                type: 'blank', delay: 200 },
  { text: '✓ Analysis complete · fix ready below ↓',                       type: 'ok',    delay: 300 },
]

const WORDS = ['404', 'TypeError', 'null', 'undefined', 'ERROR', 'crash', 'NaN', 'void', '∅']

/* ── colour helpers ── */
function lineColor(type) {
  const map = {
    ok:    '#00e05a',
    err:   '#e8000d',
    warn:  '#ffaa00',
    file:  '#60a5fa',
    ai:    '#c084fc',
    dim:   'rgba(255,255,255,0.12)',
    cmd:   '#fff',
    plain: 'rgba(255,255,255,0.4)',
    blank: 'transparent',
  }
  return map[type] || 'rgba(255,255,255,0.4)'
}

export default function NotFound() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  /* ── state ── */
  const [clock, setClock]           = useState('--:--:--')
  const [elapsed, setElapsed]       = useState('just now')
  const [termLines, setTermLines]   = useState([])
  const [showFix, setShowFix]       = useState(false)
  const [confPct, setConfPct]       = useState(0)
  const [aiDone, setAiDone]         = useState(false)
  const [aiStatus, setAiStatus]     = useState('Analyzing...')
  const [reported, setReported]     = useState(false)
  const [glitchLines, setGlitch]    = useState([false, false, false, false, false])
  const [particles, setParticles]   = useState([])

  const termRef   = useRef(null)
  const startTs   = useRef(Date.now())
  const lineIdx   = useRef(0)
  const LINES     = useRef(buildLines(pathname))

  /* ── detect browser ── */
  const ua = navigator.userAgent
  const browser = ua.includes('Firefox') ? 'Firefox'
    : ua.includes('Edg') ? 'Edge'
    : ua.includes('Safari') && !ua.includes('Chrome') ? 'Safari'
    : 'Chrome'

  /* ── clock ── */
  useEffect(() => {
    const tick = () => {
      const t = new Date()
      setClock(t.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* ── elapsed ── */
  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - startTs.current) / 1000)
      setElapsed(s < 5 ? 'just now' : `${s}s ago`)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  /* ── glitch effect ── */
  useEffect(() => {
    const trigger = () => {
      setGlitch([true, true, true, true, true].map(() => Math.random() > 0.5))
      setTimeout(() => setGlitch([false, false, false, false, false]), 80)
    }
    trigger()
    const id = setInterval(trigger, 3500)
    return () => clearInterval(id)
  }, [])

  /* ── spawn particles ── */
  const spawnParticles = (count = 24) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      word: WORDS[Math.floor(Math.random() * WORDS.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.3,
      tx: (Math.random() - 0.5) * 200,
      ty: -(Math.random() * 200 + 100),
      rot: (Math.random() - 0.5) * 60,
      dur: (Math.random() * 0.8 + 0.6).toFixed(2),
      delay: (Math.random() * 0.4).toFixed(2),
    }))
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1500)
  }

  /* ── initial particles ── */
  useEffect(() => { spawnParticles(24) }, [])

  /* ── typewriter terminal ── */
  useEffect(() => {
    const lines = LINES.current

    const typeNext = () => {
      if (lineIdx.current >= lines.length) {
        /* show fix box */
        setShowFix(true)
        setTimeout(() => {
          let p = 0
          const t = setInterval(() => {
            p = Math.min(p + 2, 97)
            setConfPct(p)
            if (p >= 97) clearInterval(t)
          }, 28)
        }, 200)
        setAiDone(true)
        setAiStatus('Complete')
        return
      }

      const l = lines[lineIdx.current++]

      if (l.type === 'cmd') {
        /* typewriter for command lines */
        const cmdText = l.text.slice(2)
        let ci = 0
        setTermLines(prev => [...prev, { type: 'cmd', content: '', isTyping: true }])
        const typeChar = () => {
          if (ci <= cmdText.length) {
            setTermLines(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { type: 'cmd', content: cmdText.slice(0, ci), isTyping: ci < cmdText.length }
              return updated
            })
            ci++
            setTimeout(typeChar, 22 + Math.random() * 18)
          } else {
            setTimeout(typeNext, l.delay)
          }
        }
        typeChar()
        return
      }

      setTermLines(prev => [...prev, l])
      setTimeout(typeNext, l.delay)
    }

    setTimeout(typeNext, 600)
  }, [])

  /* ── auto-scroll terminal ── */
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [termLines])

  /* ── report handler ── */
  const handleReport = (e) => {
    e.preventDefault()
    setReported(true)
    spawnParticles(12)
    setGlitch([true, true, true, true, true])
    setTimeout(() => setGlitch([false, false, false, false, false]), 80)
    setTermLines(prev => [
      ...prev,
      { type: 'ok', text: `✓ Error reported to team · ticket #CB-${Math.floor(Math.random() * 9000 + 1000)} created` },
    ])
    setTimeout(() => setReported(false), 1200)
  }

  /* ── konami ── */
  useEffect(() => {
    const seq = []
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const handler = (e) => {
      seq.push(e.key)
      if (seq.length > 6) seq.shift()
      if (seq.join(',') === code.join(',')) {
        spawnParticles(60)
        setGlitch([true, true, true, true, true])
        setTimeout(() => setGlitch([false, false, false, false, false]), 80)
        setTermLines(prev => [...prev, { type: 'ai', text: '✨ Easter egg found. You clearly know your way around a keyboard.' }])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const glitchPositions = ['12%', '28%', '55%', '71%', '89%']

  return (
    <div style={{
      background: '#080a0c', color: '#fff',
      fontFamily: "'Archivo', sans-serif",
      height: '100vh', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Archivo:wght@300;400;700;900&display=swap');

        :root {
          --red: #e8000d;
          --green: #00e05a;
          --amber: #ffaa00;
          --blue: #4d9fff;
          --dim: rgba(255,255,255,0.35);
          --dimmer: rgba(255,255,255,0.15);
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.1);
          --mono: 'DM Mono', monospace;
          --display: 'Bebas Neue', sans-serif;
        }

        /* scanlines */
        .nf-root::before {
          content:''; position:fixed; inset:0;
          background: repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px);
          pointer-events:none; z-index:8000;
        }

        /* noise */
        .nf-root::after {
          content:''; position:fixed; inset:0; pointer-events:none; opacity:0.04;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:140px; z-index:7000;
        }

        @keyframes livepulse { 50% { opacity:0.3; box-shadow:none; } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes blink { 50% { opacity:0 } }
        @keyframes cardIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        @keyframes numIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }
        @keyframes tlIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes particleFly {
          0%   { opacity:1; transform: translate(0,0) rotate(0deg); }
          100% { opacity:0; transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); }
        }
        @keyframes zeroGlitch {
          0%,90%,100% { transform:none; filter:none; }
          91% { transform:translateX(-4px) skewX(-8deg); filter:hue-rotate(90deg); }
          93% { transform:translateX(3px)  skewX(4deg); }
          95% { transform:translateX(-2px); filter:hue-rotate(-60deg); }
          97% { transform:none; filter:none; }
          98% { transform:translateX(1px); }
        }
        @keyframes cloneGlitch {
          0%,88%,100% { opacity:0; transform:none; }
          89% { opacity:0.5; transform:translateX(-6px); clip-path:inset(20% 0 60% 0); }
          91% { opacity:0.3; transform:translateX(4px);  clip-path:inset(55% 0 15% 0); }
          93% { opacity:0; }
        }
        @keyframes cloneGlitch2 {
          0%,90%,100% { opacity:0; transform:none; }
          91% { opacity:0.3; transform:translateX(5px);  clip-path:inset(40% 0 30% 0); }
          93% { opacity:0.2; transform:translateX(-3px); clip-path:inset(10% 0 70% 0); }
          95% { opacity:0; }
        }

        .nf-404-zero {
          -webkit-text-stroke: 2px #e8000d;
          color: transparent;
          display: inline-block;
          animation: zeroGlitch 4s infinite;
        }
        .nf-glitch-clone {
          position:absolute; top:0; left:0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(100px,14vw,180px);
          line-height: 0.88; letter-spacing: 0.02em;
          color: #e8000d; pointer-events:none; opacity:0;
          animation: cloneGlitch 4s infinite;
        }
        .nf-glitch-clone2 {
          color: #4d9fff;
          animation: cloneGlitch2 4s infinite;
        }
        .nf-404-wrap {
          animation: numIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both;
          position: relative; display: inline-block;
        }
        .nf-crash-title  { animation: numIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .nf-crash-sub    { animation: numIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .nf-actions      { animation: numIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s both; }
        .nf-error-card   { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

        .nf-st-line:hover { color: rgba(255,255,255,0.6); }
        .nf-btn-home:hover  { background: #c00009 !important; transform: scale(1.02); }
        .nf-btn-report:hover { border-color: rgba(255,255,255,0.3) !important; color: #fff !important; }
        .nf-btn-back:hover  { color: rgba(255,255,255,0.35) !important; }

        .nf-terminal::-webkit-scrollbar { width: 3px; }
        .nf-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* ── GLITCH LINES ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 6000 }}>
        {glitchPositions.map((top, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            height: glitchLines[i] ? `${Math.random() * 3 + 1}px` : '1px',
            top,
            background: 'var(--red)',
            opacity: glitchLines[i] ? 0.6 : 0,
            transform: glitchLines[i] ? `translateX(${(Math.random() - 0.5) * 30}px)` : 'none',
            transition: 'opacity 0.08s',
          }} />
        ))}
      </div>

      {/* ── PARTICLES ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)',
            left: p.x, top: p.y,
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
            '--dur': `${p.dur}s`, '--delay': `${p.delay}s`,
            animation: `particleFly ${p.dur}s ease-out ${p.delay}s both`,
            opacity: 0,
          }}>
            {p.word}
          </div>
        ))}
      </div>

      {/* ── TOP BAR ── */}
      <div style={{
        flexShrink: 0, height: '44px',
        background: '#0e1014',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '12px',
        position: 'relative', zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '18px', letterSpacing: '0.04em' }}>
          CRASH<span style={{ color: 'var(--red)' }}>/</span>BOARD
        </div>

        <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>vertex-bank-frontend</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
          <span>errors</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
          <span style={{ color: 'var(--red)' }}>RouteNotFoundError#4f2a1</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)', animation: 'livepulse 1.2s infinite' }} />
          live · 1 new error
        </div>

        <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

        <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
          {clock}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}>

          {/* 404 zone */}
          <div style={{ padding: '40px 48px 24px', position: 'relative', flexShrink: 0 }}>
            {/* Ghost number */}
            <div style={{
              position: 'absolute',
              fontFamily: 'var(--display)', fontSize: '320px', lineHeight: 1,
              color: 'rgba(255,255,255,0.018)', letterSpacing: '0.04em',
              top: '50%', left: '50%', transform: 'translate(-50%,-52%)',
              pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            }}>404</div>

            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--red)', marginBottom: '20px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 8px var(--red)', animation: 'livepulse 1s infinite' }} />
              CRITICAL · RouteNotFoundError · Caught just now
            </div>

            {/* 404 with glitch */}
            <div className="nf-404-wrap">
              <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(100px,14vw,180px)', lineHeight: 0.88, letterSpacing: '0.02em' }}>
                <span style={{ color: '#fff' }}>4</span>
                <span className="nf-404-zero">0</span>
                <span style={{ color: 'var(--red)' }}>4</span>
              </div>
              <div className="nf-glitch-clone">404</div>
              <div className="nf-glitch-clone nf-glitch-clone2">404</div>
            </div>

            <div className="nf-crash-title" style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(28px,3.5vw,48px)',
              letterSpacing: '0.04em', lineHeight: 1,
              color: '#fff', marginTop: '12px', marginBottom: '8px',
            }}>
              PAGE <span style={{ color: 'var(--red)' }}>CRASHED</span> INTO<br />THE VOID.
            </div>

            <p className="nf-crash-sub" style={{
              fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7, maxWidth: '480px',
            }}>
              This URL doesn't exist — and CrashBoard just caught it happening. The route you requested was not found. Our AI is already analyzing why you ended up here.
            </p>
          </div>

          {/* Error card */}
          <div className="nf-error-card" style={{
            margin: '20px 48px',
            background: reported ? 'rgba(0,224,90,0.05)' : 'rgba(232,0,13,0.05)',
            border: reported ? '1px solid rgba(0,224,90,0.2)' : '1px solid rgba(232,0,13,0.2)',
            borderLeft: reported ? '3px solid #00e05a' : '3px solid var(--red)',
            borderRadius: '2px',
            padding: '16px 20px',
            flexShrink: 0,
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'rgba(232,0,13,0.15)', color: 'var(--red)',
                padding: '3px 8px', borderRadius: '2px',
              }}>
                CRITICAL
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>RouteNotFoundError</div>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.15)' }}>
                {elapsed}
              </div>
            </div>

            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', lineHeight: 1.6 }}>
              Cannot GET <span style={{ color: '#60a5fa' }}>{pathname}</span> — No route matches this path in the application router
            </div>

            <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.25)', flexWrap: 'wrap' }}>
              <span>📄 Router.js:<span style={{ color: '#f97316' }}>89</span></span>
              <span>🌐 {browser}</span>
              <span>👤 1 user affected</span>
              <span>🔁 1 occurrence</span>
              <span>🗂️ vertex-bank-frontend</span>
            </div>
          </div>

          {/* Stack trace */}
          <div style={{ margin: '0 48px', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
              marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              Stack Trace
            </div>

            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', lineHeight: 1.9, color: 'rgba(255,255,255,0.3)' }}>
              {[
                { fn: 'Router.resolve',       file: 'Router.js',         line: '89',  hot: true  },
                { fn: 'AppRouter.navigate',   file: 'AppRouter.jsx',     line: '124', hot: false },
                { fn: 'history.pushState',    file: 'history.js',        line: '44',  hot: false },
                { fn: 'Link.onClick',         file: 'components/Nav.jsx', line: '67', hot: false },
                { fn: 'React.SyntheticEvent', file: 'react-dom.min.js',  line: '1',   hot: false },
              ].map((frame, i) => (
                <div key={i} className="nf-st-line" style={{ display: 'flex', gap: '12px', padding: '1px 0', cursor: 'default' }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>at</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{frame.fn}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ color: frame.hot ? 'var(--red)' : '#60a5fa' }}>{frame.file}</span>
                  <span style={{ color: '#f97316' }}>:{frame.line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="nf-actions" style={{
            padding: '24px 48px',
            display: 'flex', alignItems: 'center', gap: '12px',
            flexWrap: 'wrap', marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <a href="/" className="nf-btn-home" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              background: 'var(--red)', color: '#fff',
              fontFamily: 'var(--display)', fontSize: '18px', letterSpacing: '0.06em',
              textDecoration: 'none', cursor: 'pointer',
              border: '2px solid var(--red)',
              transition: 'background 0.15s, transform 0.15s',
              flexShrink: 0,
            }}>
              → GO HOME
            </a>

            <a href="#" className="nf-btn-report" onClick={handleReport} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px',
              background: 'transparent', color: 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--mono)', fontSize: '11px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'border-color 0.15s, color 0.15s',
              flexShrink: 0,
            }}>
              ⚑ Report This
            </a>

            <a
              href="#"
              className="nf-btn-back"
              onClick={(e) => { e.preventDefault(); navigate(-1) }}
              style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)', textDecoration: 'none', cursor: 'pointer',
                transition: 'color 0.15s', padding: '12px 8px',
              }}
            >
              ← Go back
            </a>
          </div>
        </div>

        {/* ── RIGHT PANEL — AI TERMINAL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#0e1014', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              Gemini AI · Live Analysis
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {!aiDone ? (
                <>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid rgba(168,85,247,0.3)', borderTopColor: 'rgba(168,85,247,0.8)', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ color: 'rgba(168,85,247,0.8)' }}>Analyzing...</span>
                </>
              ) : (
                <span style={{ color: 'var(--green)' }}>Complete</span>
              )}
            </div>
          </div>

          {/* Terminal */}
          <div ref={termRef} className="nf-terminal" style={{
            flex: 1, padding: '20px 18px',
            fontFamily: 'var(--mono)', fontSize: '11.5px', lineHeight: 1.85,
            overflowY: 'auto', overflowX: 'hidden', minHeight: 0,
          }}>
            {/* initial blinking cursor before typewriter starts */}
            {termLines.length === 0 && (
              <div>
                <span style={{ display: 'inline-block', width: '7px', height: '12px', background: 'rgba(255,255,255,0.7)', verticalAlign: 'middle', animation: 'blink 0.75s step-end infinite' }} />
              </div>
            )}

            {termLines.map((line, i) => {
              if (line.type === 'blank') return <div key={i}>&nbsp;</div>

              if (line.type === 'cmd') {
                return (
                  <div key={i} style={{ color: 'rgba(255,255,255,0.4)', animation: 'tlIn 0.2s ease both' }}>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>$ </span>
                    <span style={{ color: '#fff' }}>{line.content}</span>
                    {line.isTyping && (
                      <span style={{ display: 'inline-block', width: '7px', height: '12px', background: 'rgba(255,255,255,0.7)', verticalAlign: 'middle', animation: 'blink 0.75s step-end infinite' }} />
                    )}
                  </div>
                )
              }

              return (
                <div key={i} style={{ color: lineColor(line.type), animation: 'tlIn 0.2s ease both' }}>
                  {line.text || line.content || ''}
                </div>
              )
            })}
          </div>

          {/* AI Fix Box */}
          {showFix && (
            <div style={{
              margin: '0 18px 16px',
              background: 'rgba(168,85,247,0.05)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '4px',
              padding: '14px 16px',
              flexShrink: 0,
              animation: 'cardIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '9px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#c084fc', marginBottom: '8px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ✨ Suggested Fix
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '10px' }}>
                Add a catch-all route handler in your React Router config to gracefully handle unknown paths instead of throwing a RouteNotFoundError.
              </div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--green)',
                padding: '10px 12px',
                background: 'rgba(0,224,90,0.05)',
                border: '1px solid rgba(0,224,90,0.15)',
                borderLeft: '2px solid var(--green)',
                lineHeight: 1.8,
              }}>
                {`// In your App.jsx router config`}<br />
                {`<Route path="*" element={<NotFound />} />`}<br />
                <br />
                {`// Or in Express backend`}<br />
                {`app.use((req, res) => res.status(404)...);`}
              </div>
              <div style={{ marginTop: '8px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Confidence</span>
                <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #00e05a, #4ade80)',
                    borderRadius: '2px',
                    width: `${confPct}%`,
                    transition: 'width 1.5s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </div>
                <span>{confPct}%</span>
              </div>
            </div>
          )}

          {/* Status bar */}
          <div style={{
            flexShrink: 0, height: '28px',
            background: 'var(--red)',
            display: 'flex', alignItems: 'center',
            padding: '0 20px', gap: '20px',
            fontFamily: 'var(--mono)', fontSize: '9px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
          }}>
            <span style={{ animation: 'blink 1s step-end infinite' }}>●</span>
            <span>LIVE</span>
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span>RouteNotFoundError</span>
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span>1 occurrence</span>
            <div style={{ flex: 1 }} />
            <span>AI: <span style={{ color: aiDone ? 'var(--green)' : 'inherit' }}>{aiDone ? 'fix ready' : 'analyzing'}</span></span>
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.2)' }} />
            <span>vertex-bank-frontend</span>
          </div>
        </div>
      </div>
    </div>
  )
}