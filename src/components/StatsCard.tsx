import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, MyTask, SessionLog } from '../types'
import './StatsCard.css'

export default function StatsCard() {
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', [])
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', [])
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const allTasks = [...todayTasks, ...myTasks]
  const total = allTasks.length
  const done = allTasks.filter(t => t.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayMins = logs.filter(l => l.date === todayStr).reduce((s, l) => s + l.minutes, 0)
  const goalMins = 5 * 60 // 5 hour daily goal
  const studyPct = Math.min(100, Math.round((todayMins / goalMins) * 100))

  return (
    <div className="stats-card">
      <h2>Daily Task</h2>
      <div className="stats-count">{total.toLocaleString()}</div>
      <p className="stats-label">Task</p>
      <div className="stats-progress-row">
        <span className="stats-progress-text">Completion</span>
        <span className="stats-pct">{pct}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="stats-divider" />

      <div className="stats-progress-row">
        <span className="stats-progress-text">Study Goal ({(todayMins / 60).toFixed(1)}h / 5h)</span>
        <span className="stats-pct">{studyPct}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill study" style={{ width: `${studyPct}%` }} />
      </div>
    </div>
  )
}
