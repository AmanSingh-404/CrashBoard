import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../store/authStore'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ── live feed data ── */
const FEED_DATA = [
  { s: 'critical', t: 'TypeError',        m: "Cannot read 'wallet' of undefined" },
  { s: 'warning',  t: 'NetworkError',     m: 'POST /api/transfer 408 Timeout' },
  { s: 'critical', t: 'ReferenceError',   m: 'initSDK is not defined' },
  { s: 'info',     t: 'UnhandledPromise', m: 'Rejection: fetch timeout' },
  { s: 'resolved', t: '✓ RESOLVED',       m: 'TypeError · PaymentGateway.js:147' },
  { s: 'warning',  t: 'SyntaxError',      m: "Unexpected token '<' in JSON" },
  { s: 'critical', t: 'TypeError',        m: 'Cannot destructure null response' },
  { s: 'info',     t: 'PerformanceWarn',  m: 'LCP > 4s on /dashboard route' },
  { s: 'resolved', t: '✓ AI FIX APPLIED', m: 'Null-check added · 0 users affected' },
  { s: 'critical', t: 'RangeError',       m: 'Max call stack exceeded in Chart.jsx' },
]

const SEED = [
  { s: 'resolved', t: '✓ AI FIX APPLIED', m: 'Null-check added · 0 users affected' },
  { s: 'critical', t: 'TypeError',         m: "Cannot read 'wallet' of undefined · Chrome" },
  { s: 'warning',  t: 'NetworkError',      m: 'POST /api/transfer 500 · Firefox' },
  { s: 'info',     t: 'UnhandledPromise',  m: 'Rejection: fetch failed · Safari' },
]

const SEV_COLOR = { critical: '#e8000d', warning: '#ffaa00', info: '#4d9fff', resolved: '#00e05a' }

function getStrength(val) {
  if (!val) return null
  let score = 0
  if (val.length >= 8)          score++
  if (/[A-Z]/.test(val))        score++
  if (/[0-9]/.test(val))        score++
  if (/[^a-zA-Z0-9]/.test(val)) score++
  if (val.length >= 14)         score++
  const levels = [
    { w: '20%', bg: '#e8000d', text: 'Weak' },
    { w: '40%', bg: '#ff6600', text: 'Fair' },
    { w: '60%', bg: '#ffaa00', text: 'Good' },
    { w: '80%', bg: '#4d9fff', text: 'Strong' },
    { w: '100%',bg: '#00e05a', text: 'Very strong' },
  ]
  return levels[Math.min(score, 4)]
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/* ── small helpers ── */
function Field({ label, right, children }) {
  return (
    <div style={{ marginBottom: '16px', position: 'relative' }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label}</span>{right}
      </div>
      {children}
    </div>
  )
}
function FieldError({ children }) {
  return <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', color: '#e8000d', marginTop: '6px', letterSpacing: '.04em' }}>{children}</div>
}
function ApiError({ msg }) {
  if (!msg) return null
  return <div style={{ background: 'rgba(232,0,13,.1)', border: '1px solid rgba(232,0,13,.3)', borderRadius: '2px', padding: '10px 14px', marginBottom: '16px', fontFamily: "'DM Mono',monospace", fontSize: '11px', color: '#e8000d' }}>{msg}</div>
}

export default function Auth() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  /* ── tabs ── */
  const [tab, setTab] = useState('login')

  /* ── login state ── */
  const [loginEmail,      setLoginEmail]      = useState('')
  const [loginPass,       setLoginPass]        = useState('')
  const [loginPwdShow,    setLoginPwdShow]     = useState(false)
  const [loginErrs,       setLoginErrs]        = useState({})
  const [loginLoading,    setLoginLoading]     = useState(false)
  const [loginSuccess,    setLoginSuccess]     = useState(false)
  const [loginApiErr,     setLoginApiErr]      = useState('')

  /* ── signup state ── */
  const [signupName,      setSignupName]       = useState('')
  const [signupEmail,     setSignupEmail]      = useState('')
  const [signupPass,      setSignupPass]       = useState('')
  const [signupPwdShow,   setSignupPwdShow]    = useState(false)
  const [termsChecked,    setTermsChecked]     = useState(false)
  const [signupErrs,      setSignupErrs]       = useState({})
  const [signupLoading,   setSignupLoading]    = useState(false)
  const [signupSuccess,   setSignupSuccess]    = useState(false)
  const [signupApiErr,    setSignupApiErr]     = useState('')
  const strength = getStrength(signupPass)

  /* ── feed ── */
  const [feedItems, setFeedItems] = useState([])
  const [errTotal,  setErrTotal]  = useState(1284)
  const feedIdx = useRef(0)

  const pushFeed = (item) => {
    const now = new Date()
    const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
    setFeedItems(prev => [{ ...item, ts, id: Date.now() + Math.random() }, ...prev].slice(0, 7))
    if (item.s === 'critical' || item.s === 'warning') setErrTotal(n => n + 1)
  }

  useEffect(() => {
    SEED.forEach((d, i) => setTimeout(() => pushFeed(d), i * 180))
    const id = setInterval(() => { pushFeed(FEED_DATA[feedIdx.current % FEED_DATA.length]); feedIdx.current++ }, 3800)
    return () => clearInterval(id)
  }, [])

  /* ── cursor ── */
  useEffect(() => {
    const cur = document.getElementById('cursor')
    if (!cur) return
    const fn = e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px' }
    document.addEventListener('mousemove', fn)
    return () => document.removeEventListener('mousemove', fn)
  }, [])

  /* ── handlers ── */
  const handleLogin = async () => {
    const e = {}
    if (!isEmail(loginEmail)) e.email = 'Please enter a valid email'
    if (!loginPass)           e.pass  = 'Password is required'
    if (Object.keys(e).length) { setLoginErrs(e); return }
    setLoginLoading(true); setLoginApiErr('')
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email: loginEmail, password: loginPass })
      setAuth(data.user, data.token)
      setLoginSuccess(true)
      pushFeed({ s: 'resolved', t: '✓ LOGIN SUCCESS', m: `${loginEmail} · signed in` })
      setTimeout(() => navigate('/dashboard'), 1600)
    } catch (err) {
      setLoginApiErr(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoginLoading(false) }
  }

  const handleSignup = async () => {
    const e = {}
    if (!signupName)           e.name  = 'Name is required'
    if (!isEmail(signupEmail)) e.email = 'Please enter a valid email'
    if (signupPass.length < 6) e.pass  = 'Password must be at least 6 characters'
    if (!termsChecked)         e.terms = 'Please accept the terms to continue'
    if (Object.keys(e).length) { setSignupErrs(e); return }
    setSignupLoading(true); setSignupApiErr('')
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name: signupName, email: signupEmail, password: signupPass })
      setAuth(data.user, data.token)
      setSignupSuccess(true)
      pushFeed({ s: 'resolved', t: '✓ NEW USER', m: `${signupEmail} · account created` })
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      setSignupApiErr(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setSignupLoading(false) }
  }

  const onKey = (fn) => (e) => { if (e.key === 'Enter') fn() }

  return (
    <div style={{ height:'100vh', display:'flex', overflow:'hidden', background:'#080a0c', color:'#fff', fontFamily:"'Archivo',sans-serif" }}>
      <div id="cursor" style={{ position:'fixed', width:'24px', height:'24px', borderRadius:'50%', border:'2px solid #e8000d', background:'rgba(232,0,13,.4)', boxShadow:'0 0 16px 2px rgba(232,0,13,.8)', pointerEvents:'none', transform:'translate(-50%,-50%)', zIndex:9999, transition:'width .1s, height .1s' }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Archivo:wght@300;400;700;900&display=swap');

        body { overflow: hidden; }

        /* noise overlay */
        .auth-wrap::before {
          content:''; position:fixed; inset:0; pointer-events:none; opacity:.03;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:160px; z-index:8000;
        }
        /* scanlines */
        .auth-wrap::after {
          content:''; position:fixed; inset:0; pointer-events:none;
          background:repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);
          z-index:7000;
        }

        @keyframes fpulse    { 50%{ opacity:.3; box-shadow:none; } }
        @keyframes feedIn    { from{ opacity:0; transform:translateY(-10px) } to{ opacity:1; transform:none } }
        @keyframes cardReveal{ from{ opacity:0; transform:translateY(20px)  } to{ opacity:1; transform:none } }
        @keyframes formIn    { from{ opacity:0; transform:translateX(16px)  } to{ opacity:1; transform:none } }
        @keyframes bounceIn  { from{ opacity:0; transform:scale(.5) } to{ opacity:1; transform:none } }
        @keyframes glowFloat { 0%,100%{ transform:translate(-50%,-50%) scale(1) } 50%{ transform:translate(-50%,-55%) scale(1.08) } }
        @keyframes spin      { to{ transform:rotate(360deg) } }
        @keyframes scanSwipe { 0%{opacity:0;clip-path:inset(0 100% 0 0)} 30%{opacity:.8} 100%{opacity:0;clip-path:inset(0 0% 0 100%)} }

        .cb-input {
          width:100%; padding:14px 16px;
          background:#141619; border:1px solid rgba(255,255,255,.12);
          border-radius:2px; color:#fff;
          font-family:'DM Mono',monospace; font-size:13px;
          outline:none; cursor:text;
          transition:border-color .2s, background .2s;
        }
        .cb-input::placeholder { color:rgba(255,255,255,.2); }
        .cb-input:focus { border-color:#e8000d; background:rgba(232,0,13,.04); }
        .cb-input:focus ~ .sl { animation:scanSwipe .5s ease forwards; }
        .cb-input.ico { padding-right:44px; }

        .sl {
          position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,#e8000d,transparent);
          top:50%; transform:translateY(-50%); opacity:0; pointer-events:none;
        }

        .cb-tab {
          flex:1; padding:12px 0;
          font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:.08em;
          text-align:center; cursor:pointer; color:rgba(255,255,255,.2);
          background:transparent; border:none;
          transition:color .2s, background .2s; position:relative;
        }
        .cb-tab.on { color:#fff; background:#141619; }
        .cb-tab::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#e8000d; transform:scaleX(0); transition:transform .25s cubic-bezier(.16,1,.3,1); }
        .cb-tab.on::after { transform:scaleX(1); }

        .cb-btn {
          width:100%; padding:16px;
          background:#e8000d; color:#fff;
          font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.08em;
          border:2px solid #e8000d; border-radius:2px; cursor:pointer;
          position:relative; overflow:hidden;
          transition:background .2s, transform .15s;
        }
        .cb-btn::before { content:''; position:absolute; inset:0; background:rgba(255,255,255,.1); transform:translateX(-100%) skewX(-20deg); transition:transform .4s cubic-bezier(.16,1,.3,1); }
        .cb-btn:hover::before { transform:translateX(100%) skewX(-20deg); }
        .cb-btn:hover { transform:scale(1.01); }
        .cb-btn:active { transform:scale(.99); }
        .cb-btn:disabled { opacity:.7; }
        .cb-spinner { display:inline-block; width:16px; height:16px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; vertical-align:middle; }

        .cb-oauth {
          flex:1; padding:11px 12px;
          background:#141619; border:1px solid rgba(255,255,255,.12); border-radius:2px;
          color:rgba(255,255,255,.4); font-family:'DM Mono',monospace; font-size:11px;
          letter-spacing:.06em; text-transform:uppercase; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:border-color .15s, color .15s, background .15s;
        }
        .cb-oauth:hover { border-color:rgba(255,255,255,.25); color:#fff; background:#1c1f26; }

        .cb-chk { width:16px; height:16px; border:1px solid rgba(255,255,255,.12); background:#141619; flex-shrink:0; margin-top:1px; cursor:pointer; display:flex; align-items:center; justify-content:center; border-radius:1px; font-size:10px; transition:background .15s, border-color .15s; }
        .cb-chk.on { background:#e8000d; border-color:#e8000d; }
      `}</style>

      {/* ════ LEFT PANEL ════ */}
      <div className="auth-wrap" style={{ width:'42%', background:'#080a0c', borderRight:'1px solid rgba(255,255,255,.12)', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', flexShrink:0 }}>

        {/* brand */}
        <div style={{ padding:'32px 40px 0', flexShrink:0 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'28px', letterSpacing:'.04em' }}>
            CRASH<span style={{ color:'#e8000d' }}>/</span>BOARD
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.2)', marginTop:'6px' }}>
            Know before your users do.
          </div>
        </div>

        {/* hero */}
        <div style={{ padding:'48px 40px 24px', flexShrink:0 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(52px,5.5vw,80px)', lineHeight:.88, letterSpacing:'.02em' }}>
            <div>CATCH</div>
            <div style={{ WebkitTextStroke:'1.5px #fff', color:'transparent' }}>EVERY</div>
            <div style={{ color:'#e8000d' }}>CRASH.</div>
          </div>
          <p style={{ fontSize:'13px', fontWeight:300, lineHeight:1.75, color:'rgba(255,255,255,.4)', marginTop:'16px', maxWidth:'320px' }}>
            Real-time error monitoring with AI that reads your stack trace and writes the fix — before a single user complains.
          </p>
        </div>

        {/* feed label */}
        <div style={{ padding:'0 40px 12px', fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#e8000d', boxShadow:'0 0 6px #e8000d', animation:'fpulse 1.2s infinite' }} />
          Live Error Feed
        </div>

        {/* feed list */}
        <div style={{ flex:1, overflow:'hidden', padding:'0 40px', display:'flex', flexDirection:'column', gap:'6px', position:'relative', minHeight:0 }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'80px', background:'linear-gradient(transparent,#080a0c)', pointerEvents:'none', zIndex:2 }} />
          {feedItems.map(item => (
            <div key={item.id} style={{ border:'1px solid rgba(255,255,255,.07)', borderLeft:`2px solid ${SEV_COLOR[item.s]||'#fff'}`, padding:'10px 14px', borderRadius:'2px', display:'flex', alignItems:'flex-start', gap:'10px', animation:'feedIn .4s cubic-bezier(.16,1,.3,1) both', flexShrink:0, background:'rgba(255,255,255,.08)' }}>
              <div style={{ fontSize:'8px', fontFamily:"'DM Mono',monospace", letterSpacing:'.1em', textTransform:'uppercase', paddingTop:'1px', flexShrink:0, color:SEV_COLOR[item.s] }}>
                {item.s === 'resolved' ? 'OK' : item.s}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'11px', fontWeight:700, color:'#fff', marginBottom:'2px' }}>{item.t}</div>
                <div style={{ fontSize:'10px', fontFamily:"'DM Mono',monospace", color:'rgba(255,255,255,.2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.5 }}>{item.m}</div>
              </div>
              <div style={{ fontSize:'8px', fontFamily:"'DM Mono',monospace", color:'rgba(255,255,255,.15)', flexShrink:0, paddingTop:'1px' }}>{item.ts}</div>
            </div>
          ))}
        </div>

        {/* stats */}
        <div style={{ padding:'20px 40px 32px', display:'flex', borderTop:'1px solid rgba(255,255,255,.07)', flexShrink:0 }}>
          {[
            { n: errTotal.toLocaleString(), c:'#e8000d', l:'Errors today' },
            { n:'67',    c:'#00e05a', l:'Resolved' },
            { n:'<50ms', c:'#4d9fff', l:'Alert time' },
          ].map((s,i,a) => (
            <div key={i} style={{ flex:1, paddingRight:i<a.length-1?'20px':0, borderRight:i<a.length-1?'1px solid rgba(255,255,255,.07)':'none', marginRight:i<a.length-1?'20px':0 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'32px', lineHeight:1, letterSpacing:'.02em', color:s.c }}>{s.n}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,.2)', marginTop:'4px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════ RIGHT PANEL ════ */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px', position:'relative', overflow:'hidden' }}>

        {/* grid bg */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize:'40px 40px', WebkitMaskImage:'radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)', maskImage:'radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)', pointerEvents:'none' }} />

        {/* red glow */}
        <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:'500px', height:'400px', background:'radial-gradient(ellipse,rgba(232,0,13,.06) 0%,transparent 70%)', pointerEvents:'none', animation:'glowFloat 6s ease-in-out infinite' }} />

        {/* card */}
        <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:10, animation:'cardReveal .6s cubic-bezier(.16,1,.3,1) .1s both' }}>

          {/* tabs */}
          <div style={{ display:'flex', marginBottom:'32px', border:'1px solid rgba(255,255,255,.12)', borderRadius:'2px', overflow:'hidden', background:'#0d0f12' }}>
            <button className={`cb-tab${tab==='login'?' on':''}`}  onClick={() => setTab('login')}>SIGN IN</button>
            <button className={`cb-tab${tab==='signup'?' on':''}`} onClick={() => setTab('signup')}>SIGN UP</button>
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <div style={{ animation:'formIn .35s cubic-bezier(.16,1,.3,1) both' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'48px', letterSpacing:'.02em', lineHeight:.9, marginBottom:'8px' }}>
                WELCOME<br /><span style={{ color:'#e8000d' }}>BACK.</span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', fontWeight:300, color:'rgba(255,255,255,.4)', marginBottom:'32px', letterSpacing:'.04em' }}>
                // sign in to your dashboard
              </div>

              <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
                <button className="cb-oauth">🐙 GitHub</button>
                <button className="cb-oauth">🔵 Google</button>
              </div>

              <Divider />
              <ApiError msg={loginApiErr} />

              <Field label="Email">
                <div style={{ position:'relative' }}>
                  <input className="cb-input ico" type="email" placeholder="you@company.com"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginErrs(p=>({...p,email:''})) }}
                    onKeyDown={onKey(handleLogin)} />
                  <div className="sl" /><Icon>@</Icon>
                </div>
                {loginErrs.email && <FieldError>{loginErrs.email}</FieldError>}
              </Field>

              <Field label="Password" right={<a href="#" style={{ color:'rgba(255,255,255,.2)', textDecoration:'none', fontSize:'9px', fontFamily:"'DM Mono',monospace" }}>Forgot password?</a>}>
                <div style={{ position:'relative' }}>
                  <input className="cb-input ico" type={loginPwdShow?'text':'password'} placeholder="••••••••••••"
                    value={loginPass}
                    onChange={e => { setLoginPass(e.target.value); setLoginErrs(p=>({...p,pass:''})) }}
                    onKeyDown={onKey(handleLogin)} />
                  <div className="sl" />
                  <Icon onClick={() => setLoginPwdShow(v=>!v)}>{loginPwdShow?'🙈':'👁'}</Icon>
                </div>
                {loginErrs.pass && <FieldError>{loginErrs.pass}</FieldError>}
              </Field>

              {loginSuccess ? (
                <SuccessState title="SIGNED IN" msg={"Redirecting to your dashboard...\nErrors are being monitored."} />
              ) : (
                <button className="cb-btn" onClick={handleLogin} disabled={loginLoading}>
                  {loginLoading ? <span className="cb-spinner" /> : '→ SIGN IN'}
                </button>
              )}

              <FormFooter>
                Don't have an account?{' '}
                <a href="#" onClick={e=>{e.preventDefault();setTab('signup')}} style={{ color:'#e8000d', textDecoration:'none' }}>Create one free →</a>
              </FormFooter>
            </div>
          )}

          {/* ── SIGNUP ── */}
          {tab === 'signup' && (
            <div style={{ animation:'formIn .35s cubic-bezier(.16,1,.3,1) both' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'48px', letterSpacing:'.02em', lineHeight:.9, marginBottom:'8px' }}>
                START<br /><span style={{ color:'#e8000d' }}>FREE.</span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', fontWeight:300, color:'rgba(255,255,255,.4)', marginBottom:'32px', letterSpacing:'.04em' }}>
                // no card needed · 5-min setup
              </div>

              <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
                <button className="cb-oauth">🐙 GitHub</button>
                <button className="cb-oauth">🔵 Google</button>
              </div>

              <Divider />
              <ApiError msg={signupApiErr} />

              <Field label="Full Name">
                <div style={{ position:'relative' }}>
                  <input className="cb-input ico" type="text" placeholder="Aman Singh"
                    value={signupName}
                    onChange={e => { setSignupName(e.target.value); setSignupErrs(p=>({...p,name:''})) }}
                    onKeyDown={onKey(handleSignup)} />
                  <div className="sl" /><Icon>✦</Icon>
                </div>
                {signupErrs.name && <FieldError>{signupErrs.name}</FieldError>}
              </Field>

              <Field label="Work Email">
                <div style={{ position:'relative' }}>
                  <input className="cb-input ico" type="email" placeholder="you@company.com"
                    value={signupEmail}
                    onChange={e => { setSignupEmail(e.target.value); setSignupErrs(p=>({...p,email:''})) }}
                    onKeyDown={onKey(handleSignup)} />
                  <div className="sl" /><Icon>@</Icon>
                </div>
                {signupErrs.email && <FieldError>{signupErrs.email}</FieldError>}
              </Field>

              <Field label="Password">
                <div style={{ position:'relative' }}>
                  <input className="cb-input ico" type={signupPwdShow?'text':'password'} placeholder="••••••••••••"
                    value={signupPass}
                    onChange={e => { setSignupPass(e.target.value); setSignupErrs(p=>({...p,pass:''})) }}
                    onKeyDown={onKey(handleSignup)} />
                  <div className="sl" />
                  <Icon onClick={() => setSignupPwdShow(v=>!v)}>{signupPwdShow?'🙈':'👁'}</Icon>
                </div>
                {signupPass && strength && (
                  <>
                    <div style={{ height:'3px', background:'#1c1f26', borderRadius:'2px', overflow:'hidden', marginTop:'8px' }}>
                      <div style={{ height:'100%', borderRadius:'2px', width:strength.w, background:strength.bg, transition:'width .4s cubic-bezier(.16,1,.3,1),background .4s' }} />
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:strength.bg, marginTop:'4px' }}>{strength.text}</div>
                  </>
                )}
                {signupErrs.pass && <FieldError>{signupErrs.pass}</FieldError>}
              </Field>

              {/* terms */}
              <div onClick={() => { setTermsChecked(v=>!v); setSignupErrs(p=>({...p,terms:''})) }} style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'6px', cursor:'pointer' }}>
                <div className={`cb-chk${termsChecked?' on':''}`}>{termsChecked&&'✓'}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,.2)', lineHeight:1.6, letterSpacing:'.04em' }}>
                  I agree to CrashBoard's{' '}
                  <a href="#" onClick={e=>e.stopPropagation()} style={{ color:'#e8000d', textDecoration:'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" onClick={e=>e.stopPropagation()} style={{ color:'#e8000d', textDecoration:'none' }}>Privacy Policy</a>. No spam, ever.
                </div>
              </div>
              {signupErrs.terms && <div style={{ marginBottom:'10px' }}><FieldError>{signupErrs.terms}</FieldError></div>}

              {signupSuccess ? (
                <SuccessState title="ACCOUNT CREATED" msg={"Welcome to CrashBoard.\nIntegrate your SDK and start monitoring in 3 lines of code."} color="#00e05a" />
              ) : (
                <button className="cb-btn" onClick={handleSignup} disabled={signupLoading}>
                  {signupLoading ? <span className="cb-spinner" /> : '→ CREATE ACCOUNT'}
                </button>
              )}

              <FormFooter>
                Already have an account?{' '}
                <a href="#" onClick={e=>{e.preventDefault();setTab('login')}} style={{ color:'#e8000d', textDecoration:'none' }}>Sign in →</a>
              </FormFooter>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── tiny sub-components ── */
function Divider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
      <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.2)' }}>or continue with email</span>
      <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
    </div>
  )
}
function Icon({ children, onClick }) {
  return <span onClick={onClick} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.2)', fontSize:'13px', cursor:'pointer', userSelect:'none' }}>{children}</span>
}

function FormFooter({ children }) {
  return <div style={{ marginTop:'20px', textAlign:'center', fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,.2)', letterSpacing:'.04em' }}>{children}</div>
}
function SuccessState({ icon, title, msg, color='#00e05a' }) {
  return (
    <div style={{ textAlign:'center', padding:'20px 0', animation:'formIn .4s ease both' }}>
      <div style={{ fontSize:'48px', marginBottom:'16px', animation:'bounceIn .5s cubic-bezier(.34,1.56,.64,1) both' }}>{icon}</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'36px', color, marginBottom:'8px' }}>{title}</div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(255,255,255,.2)', lineHeight:1.7, whiteSpace:'pre-line' }}>{msg}</div>
    </div>
  )
}