import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signup, login, loginAsGuest } = useAuth()
  
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const clearAllData = () => {
    if (window.confirm('This will clear all data. Are you sure?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (mode === 'signup') {
        result = signup(email, password, name)
      } else {
        result = login(email, password)
      }

      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    if (forgotEmail.trim()) setForgotSent(true)
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="login-brand-name">StudyFlow</span>
        </div>
        <div className="login-hero-text">
          <h1>Stay Focused,<br/>Stay Productive</h1>
          <p>Your personal study companion for better learning outcomes.</p>
        </div>
        <div className="login-illustration">
          <div className="illus-circle illus-circle-1" />
          <div className="illus-circle illus-circle-2" />
          <svg className="illus-student" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="60" r="30" fill="#c4b5fd"/>
            <rect x="60" y="95" width="80" height="70" rx="20" fill="#7c3aed"/>
            <rect x="30" y="110" width="40" height="12" rx="6" fill="#a78bfa"/>
            <rect x="130" y="110" width="40" height="12" rx="6" fill="#a78bfa"/>
            <rect x="70" y="165" width="20" height="35" rx="8" fill="#6d28d9"/>
            <rect x="110" y="165" width="20" height="35" rx="8" fill="#6d28d9"/>
            <rect x="50" y="130" width="100" height="60" rx="8" fill="#ede9fe"/>
            <line x1="65" y1="148" x2="135" y2="148" stroke="#7c3aed" strokeWidth="2"/>
            <line x1="65" y1="158" x2="115" y2="158" stroke="#7c3aed" strokeWidth="2"/>
          </svg>
        </div>
        <p className="login-footer">© 2024 StudyFlow. All rights reserved.</p>
        <button className="clear-data-btn" onClick={clearAllData} title="Clear all data and start fresh">
          🗑️ Clear Data
        </button>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="login-sub">{mode === 'login' ? 'Login to continue your productivity journey' : 'Join StudyFlow and start studying smarter'}</p>

          {error && <div className="login-error">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="login-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required={mode === 'signup'} />
              </div>
            )}

            <div className="login-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="login-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {mode === 'login' && (
              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <button type="button" className="forgot-link" onClick={() => { setForgotOpen(true); setForgotSent(false); setForgotEmail('') }}>
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="login-divider"><span>or</span></div>

          <div className="login-mode-switch">
            <p className="mode-text">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" className="mode-link" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

          <button className="guest-btn" onClick={handleGuest}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Continue as Guest
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="modal-overlay" onClick={() => setForgotOpen(false)}>
          <div className="forgot-modal" onClick={e => e.stopPropagation()}>
            <button className="forgot-modal-close" onClick={() => setForgotOpen(false)}>✕</button>
            {forgotSent ? (
              <div className="forgot-success">
                <span className="forgot-success-icon">✉️</span>
                <h3>Check your email</h3>
                <p>We sent a reset link to <strong>{forgotEmail}</strong></p>
                <button className="login-btn" onClick={() => setForgotOpen(false)}>Back to Login</button>
              </div>
            ) : (
              <>
                <h3>Reset Password</h3>
                <p className="forgot-sub">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleForgot} className="forgot-form">
                  <div className="login-field">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                  </div>
                  <button type="submit" className="login-btn">Send Reset Link</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
