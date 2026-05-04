import { usePomodoro, PomodoroMode } from '../hooks/usePomodoro'
import { COURSES } from '../types'
import './PomodoroCard.css'

const SIZE = 180
const STROKE = 12
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

const MODES: { key: PomodoroMode; label: string }[] = [
  { key: 'focus', label: '25m' },
  { key: 'short', label: '5m' },
  { key: 'long', label: '15m' },
]

export default function PomodoroCard() {
  const { minutes, seconds, progress, running, toggle, reset, mode, switchMode, sessions, subject, setSubject } = usePomodoro()
  const dash = CIRCUMFERENCE * progress

  return (
    <div className="pomodoro-card">
      <div className="pomo-top">
        <span className="pomo-label">Pomodoro</span>
        <span className="pomo-sessions">🍅 {sessions} today</span>
      </div>

      <div className="pomo-modes">
        {MODES.map(m => (
          <button key={m.key} className={`pomo-mode-btn ${mode === m.key ? 'active' : ''}`} onClick={() => switchMode(m.key)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="pomodoro-circle-wrap">
        <svg width={SIZE} height={SIZE}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#fff" strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRCUMFERENCE}`} strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dasharray 0.5s linear' }}
          />
        </svg>
        <div className="pomodoro-time">{minutes}:{seconds}</div>
      </div>

      <div className="pomo-subject-row">
        <span className={`pomo-active-dot ${running ? 'live' : ''}`} />
        <select className="pomo-subject-select" value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="General">General</option>
          {COURSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div className="pomodoro-controls">
        <button className="pomo-start" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>
        <button className="pomo-reset" onClick={reset} aria-label="Reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
