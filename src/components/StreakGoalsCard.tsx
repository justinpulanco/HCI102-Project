import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog, QUOTES } from '../types'
import './StreakGoalsCard.css'

function calcStreak(logs: SessionLog[]): number {
  if (!logs.length) return 0
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    if (dates[i] === expected.toISOString().split('T')[0]) streak++
    else break
  }
  return streak
}

const WEEKLY_GOAL_SESSIONS = 10

export default function StreakGoalsCard() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])
  const streak = calcStreak(logs)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekSessions = logs.filter(l => new Date(l.date) >= weekStart).length
  const goalPct = Math.min(100, Math.round((weekSessions / WEEKLY_GOAL_SESSIONS) * 100))

  const todayStr = new Date().toISOString().split('T')[0]
  const quote = QUOTES[new Date(todayStr).getDate() % QUOTES.length]

  return (
    <div className="streak-card">
      <div className="streak-row">
        <div className="streak-block">
          <span className="streak-fire">🔥</span>
          <div>
            <div className="streak-num">{streak}</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-block">
          <span className="streak-fire">🎯</span>
          <div>
            <div className="streak-num">{weekSessions}<span className="streak-of">/{WEEKLY_GOAL_SESSIONS}</span></div>
            <div className="streak-label">Weekly Goal</div>
          </div>
        </div>
      </div>

      <div className="goal-bar-wrap">
        <div className="goal-bar-fill" style={{ width: `${goalPct}%` }} />
      </div>
      <p className="goal-pct-label">{goalPct}% of weekly goal</p>

      <p className="daily-quote">"{quote}"</p>
    </div>
  )
}
