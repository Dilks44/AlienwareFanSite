import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const AlienLogo = () => (
  <svg className="navbar__logo-icon" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" stroke="#00ff41" strokeWidth="1.5" fill="none"/>
    <polygon points="20,8 32,14.5 32,27.5 20,34 8,27.5 8,14.5" stroke="#00ff41" strokeWidth="0.8" fill="rgba(0,255,65,0.05)"/>
    <circle cx="20" cy="20" r="4" fill="#00ff41"/>
  </svg>
)

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast('Logged out successfully.', 'info')
    navigate('/')
  }

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : null

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <AlienLogo />
          AlienwareCommunity
        </NavLink>

        <ul className="navbar__nav">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/forum">Forum</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
          <li><NavLink to="/downloads">Downloads</NavLink></li>
          <li><NavLink to="/history">History</NavLink></li>
        </ul>

        <div className="navbar__actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle light/dark mode"
            aria-label="Toggle theme"
          >
            <span className="theme-toggle__icon">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb" />
            </span>
          </button>

          {user ? (
            <>
              <div className="avatar" title={user.username}>{initials}</div>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost btn--sm">Sign In</NavLink>
              <NavLink to="/login?tab=register" className="btn btn--primary btn--sm">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
