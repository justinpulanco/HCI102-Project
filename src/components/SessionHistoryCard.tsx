import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog, COURSES } from '../types'
import './SessionHistoryCard.css'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function SessionHistoryCard() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const courseColor = (name: string) =>
    COURSES.find(c => c.name === name)?.color ?? '#7c3aed'

  return (
    <div className="card session-history-card">
      <div className="card-header">
        <h2>Session History</h2>
        <span className="session-count">{logs.length} sessions</span>
      </div>
      {logs.length === 0 && <p className="empty-state">Complete a Pomodoro to see history</p>}
      <ul className="session-list">
        {logs.slice(0, 8).map(log => (
          <li key={log.id} className="session-item">
            <span className="session-dot" style={{ background: courseColor(log.subject) }} />
            <div className="session-info">
              <span className="session-subject">{log.subject}</span>
              <span className="session-meta">{log.minutes} min · {log.mode}</span>
            </div>
            <span className="session-time">{timeAgo(log.timestamp)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
