import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, MyTask, SessionLog } from '../types'
import MentorsChart from '../components/MentorsChart'
import HeatmapCard from '../components/HeatmapCard'
import WeeklyFocusCard from '../components/WeeklyFocusCard'
import StreakGoalsCard from '../components/StreakGoalsCard'
import BestHoursChart from '../components/BestHoursChart'
import PersonalRecordsCard from '../components/PersonalRecordsCard'
import WeeklyReportCard from '../components/WeeklyReportCard'
import './ProgressPage.css'

export default function ProgressPage() {
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', [])
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', [])
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStr = weekStart.toISOString().split('T')[0]

  const weekTasks = [...todayTasks, ...myTasks].filter(t => t.done && t.completedAt && new Date(t.completedAt) >= weekStart).length
  const weekMins = logs.filter(l => l.date >= weekStr).reduce((s, l) => s + l.minutes, 0)
  const weekHrs = (weekMins / 60).toFixed(1)

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>My Progress</h1>
      </div>

      <div className="progress-summary">
        <div className="prog-stat-card green">
          <div className="prog-stat-icon">✅</div>
          <div>
            <div className="prog-stat-num">{weekTasks}</div>
            <div className="prog-stat-label">Tasks Completed</div>
            <div className="prog-stat-sub">This Week</div>
          </div>
        </div>
        <div className="prog-stat-card blue">
          <div className="prog-stat-icon">⏱</div>
          <div>
            <div className="prog-stat-num">{weekHrs}h</div>
            <div className="prog-stat-label">Total Focus Hours</div>
            <div className="prog-stat-sub">This Week</div>
          </div>
        </div>
        <div className="prog-stat-card purple">
          <div className="prog-stat-icon">🍅</div>
          <div>
            <div className="prog-stat-num">{logs.filter(l => l.date >= weekStr).length}</div>
            <div className="prog-stat-label">Pomodoros</div>
            <div className="prog-stat-sub">This Week</div>
          </div>
        </div>
      </div>

      <div className="progress-grid">
        <div className="progress-col-main">
          <MentorsChart />
          <BestHoursChart />
          <HeatmapCard />
        </div>
        <div className="progress-col-side">
          <WeeklyReportCard />
          <PersonalRecordsCard />
          <WeeklyFocusCard />
          <StreakGoalsCard />
        </div>
      </div>

      <div className="progress-motivation">
        <span className="prog-trophy">🏆</span>
        <div>
          <p className="prog-mot-title">Great job! Keep up the amazing work! 🎉</p>
          <p className="prog-mot-sub">Consistency is the key to success.</p>
        </div>
      </div>
    </div>
  )
}
