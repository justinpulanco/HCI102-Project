import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import './Header.css'

interface HeaderProps {
  search: string
  onSearch: (v: string) => void
  dark: boolean
  onToggleDark: () => void
}

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Header({ search, onSearch, dark, onToggleDark }: HeaderProps) {
  const navigate = useNavigate()
  const { notifs, unread, markAllRead, markAllUnread } = useNotifications()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const notifsRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setShowAvatar(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="header">
      <div className="header-greeting">
        <h1>{getGreeting()}, David Max</h1>
        <p>Let's finish your task today!</p>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">✕</button>
          )}
        </div>

        <button className="dark-toggle" onClick={onToggleDark} aria-label="Toggle dark mode">
          {dark
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>

        {/* Notifications */}
        <div className="header-dropdown-wrap" ref={notifsRef}>
          <button
            className="notif-btn"
            aria-label="Notifications"
            onClick={() => { setShowNotifs(s => !s); setShowAvatar(false) }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread > 0 && <span className="notif-dot" />}
          </button>

          {showNotifs && (
            <div className="dropdown-panel notif-panel">
              <div className="dropdown-header">
                <span>Notifications</span>
                <div className="notif-actions">
                  {unread > 0 && (
                    <button className="mark-read-btn" onClick={markAllRead}>Mark all read</button>
                  )}
                  {unread < notifs.length && (
                    <button className="mark-read-btn" onClick={markAllUnread}>Mark all unread</button>
                  )}
                </div>
              </div>
              <ul className="notif-list">
                {notifs.slice(0, 8).map(n => (
                  <li key={n.id} className={`notif-item ${n.read ? 'read' : ''}`}>
                    <span className="notif-text">{n.text}</span>
                    <span className="notif-time">{timeAgo(n.time)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div className="header-dropdown-wrap" ref={avatarRef}>
          <button
            className="header-avatar"
            onClick={() => { setShowAvatar(s => !s); setShowNotifs(false) }}
            aria-label="Profile menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {showAvatar && (
            <div className="dropdown-panel avatar-panel">
              <div className="avatar-panel-profile">
                <div className="avatar-panel-icon">DM</div>
                <div>
                  <p className="avatar-panel-name">David Max</p>
                  <p className="avatar-panel-role">Student</p>
                </div>
              </div>
              <div className="avatar-panel-divider" />
              <button className="avatar-panel-item" onClick={() => { navigate('/settings'); setShowAvatar(false) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Settings
              </button>
              <button className="avatar-panel-item logout" onClick={() => navigate('/')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
