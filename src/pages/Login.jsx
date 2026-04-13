import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authLogin, authRegister } from '../lib/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const AlienIcon = () => (
  <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
    <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" stroke="#00ff41" strokeWidth="1.5" fill="none"/>
    <polygon points="20,8 32,14.5 32,27.5 20,34 8,27.5 8,14.5" stroke="#00ff41" strokeWidth="0.8" fill="rgba(0,255,65,0.05)"/>
    <circle cx="20" cy="20" r="4" fill="#00ff41"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="#00ff41" strokeWidth="1"/>
    <line x1="20" y1="26" x2="20" y2="32" stroke="#00ff41" strokeWidth="1"/>
  </svg>
)

export default function Login() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [strength, setStrength] = useState({ score: 0, label: 'Password strength' })
  const [agreed, setAgreed] = useState(false)
  const { user, login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fields
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [regUser, setRegUser] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regPass2, setRegPass2] = useState('')

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  function calcStrength(p) {
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['var(--red)', 'var(--red)', 'var(--yellow)', 'var(--blue)', 'var(--green)']
    return { score, label: p.length === 0 ? 'Password strength' : labels[score], color: colors[score] }
  }

  function handleLogin(e) {
    e.preventDefault()
    const res = authLogin(loginUser, loginPass)
    if (res.ok) {
      login(res.user)
      toast(`Welcome back, ${res.user.username}!`, 'success')
      navigate('/')
    } else {
      toast(res.msg, 'error')
    }
  }

  function handleRegister(e) {
    e.preventDefault()
    if (!agreed) { toast('Please agree to the community terms.', 'warning'); return }
    if (regPass !== regPass2) { toast('Passwords do not match.', 'error'); return }
    const res = authRegister(regUser, regEmail, regPass)
    if (res.ok) {
      login(res.user)
      toast(`Account created! Welcome, ${res.user.username}!`, 'success')
      navigate('/')
    } else {
      toast(res.msg, 'error')
    }
  }

  const strengthInfo = calcStrength(regPass)

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-page__glow" />
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo__icon"><AlienIcon /></div>
          <div className="auth-logo__name">AlienwareCommunity</div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab-btn${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login' ? (
            <div className="auth-form">
              <div className="auth-form__title">Welcome back, Commander</div>
              <div className="auth-form__subtitle">Sign in to access your account</div>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Username or Email</label>
                  <input className="form-input" type="text" placeholder="Enter username or email" value={loginUser} onChange={e => setLoginUser(e.target.value)} autoComplete="username" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Enter password" value={loginPass} onChange={e => setLoginPass(e.target.value)} autoComplete="current-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁'}</button>
                  </div>
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Access System</button>
              </form>
              <div className="auth-footer-text">
                No account? <a href="#" onClick={e => { e.preventDefault(); setTab('register') }}>Register here</a>
              </div>
            </div>
          ) : (
            <div className="auth-form">
              <div className="auth-form__title">Join the Community</div>
              <div className="auth-form__subtitle">Create your free fan account</div>
              <form onSubmit={handleRegister}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input className="form-input" type="text" placeholder="AlienFan42" value={regUser} onChange={e => setRegUser(e.target.value)} autoComplete="username" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} autoComplete="email" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" value={regPass} onChange={e => { setRegPass(e.target.value); setStrength(calcStrength(e.target.value)) }} autoComplete="new-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁'}</button>
                  </div>
                  <div className="strength-meter">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="strength-bar" style={{ background: i < strengthInfo.score ? strengthInfo.color : 'var(--bg4)' }} />
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: regPass.length > 0 ? strengthInfo.color : 'var(--text-dim)' }}>
                    {strengthInfo.label}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="password-wrapper">
                    <input className="form-input" type={showPass2 ? 'text' : 'password'} placeholder="Repeat password" value={regPass2} onChange={e => setRegPass2(e.target.value)} autoComplete="new-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPass2(v => !v)}>{showPass2 ? '🙈' : '👁'}</button>
                  </div>
                </div>
                <div className="terms-check">
                  <input type="checkbox" id="terms-agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <label htmlFor="terms-agree">
                    I agree to the community <a href="#">terms of conduct</a> and understand this is a fan site not affiliated with Dell or Alienware.
                  </label>
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Create Account</button>
              </form>
              <div className="auth-footer-text">
                Already a member? <a href="#" onClick={e => { e.preventDefault(); setTab('login') }}>Sign in</a>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          Your data is stored locally in this browser session.<br />
          This is a fan community — no real payment or personal data collected.
        </div>
      </div>
    </div>
  )
}
