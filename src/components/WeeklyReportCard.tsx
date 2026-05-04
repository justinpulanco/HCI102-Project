import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, MyTask, SessionLog } from '../types'
import './WeeklyReportCard.css'

function getGrade(pct: number) {
  if (pct >= 90) return { grade: 'A+', color: '#10b981', label: 'Outstanding!' }
  if (pct >= 80) return { grade: 'A', color: '#10b981', label: 'Excellent!' }
  if (pct >= 70) return { grade: 'B', color: '#3b82f6', label: 'Good job!' }
  if (pct >= 60) return { grade: 'C', color: '#f59e0b', label: 'Keep going!' }
  if (pct >= 40) return { grade: 'D', color: '#f97316', label: 'Needs effort' }
  return { grade: 'F', color: '#ef4444', label: 'Start studying!' }
}

export default function WeeklyReportCard() {
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', [])
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', [])
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStr = weekStart.toISOString().split('T')[0]

  const allTasks = [...todayTasks, ...myTasks]
  const weekDone = allTasks.filter(t => t.done && t.completedAt && new Date(t.completedAt) >= weekStart).length
  const weekTotal = allTasks.length
  const taskPct = weekTotal === 0 ? 0 : Math.round((weekDone / weekTotal) * 100)

  const weekMins = logs.filter(l => l.date >= weekStr).reduce((s, l) => s + l.minutes, 0)
  const goalMins = 5 * 60 * 5 // 5h/day × 5 days
  const studyPct = Math.min(100, Math.round((weekMins / goalMins) * 100))

  const overallPct = Math.round((taskPct + studyPct) / 2)
  const { grade, color, label } = getGrade(overallPct)

  const metrics = [
    { label: 'Tasks Completed', value: `${weekDone}/${weekTotal}`, pct: taskPct },
    { label: 'Study Goal', value: `${(weekMins / 60).toFixed(1)}h / 25h`, pct: studyPct },
  ]

  return (
    <div className="weekly-report-card">
      <div className="report-header">
        <div>
          <h2>Weekly Report</h2>
          <p className="report-sub">This week's performance</p>
        </div>
        <div className="report-grade" style={{ color, borderColor: color }}>
          {grade}
        </div>
      </div>
      <p className="report-label-text" style={{ color }}>{label}</p>

      <div className="report-metrics">
        {metrics.map(m => (
          <div key={m.label} className="report-metric">
            <div className="report-metric-row">
              <span className="report-metric-label">{m.label}</span>
              <span className="report-metric-value">{m.value}</span>
            </div>
            <div className="report-bar-wrap">
              <div className="report-bar-fill" style={{ width: `${m.pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      <p className="report-overall">Overall score: {overallPct}%</p>
    </div>
  )
}
