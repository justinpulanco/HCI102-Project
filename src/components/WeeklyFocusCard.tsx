import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog } from '../types'
import './WeeklyFocusCard.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates() {
  const now = new Date()
  const day = now.getDay() || 7
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (day - 1) + i)
    return d.toISOString().split('T')[0]
  })
}

export default function WeeklyFocusCard() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])
  const weekDates = getWeekDates()
  const todayStr = new Date().toISOString().split('T')[0]

  const minutesByDay = weekDates.map(date =>
    logs.filter(l => l.date === date).reduce((sum, l) => sum + l.minutes, 0)
  )

  const totalMins = minutesByDay.reduce((a, b) => a + b, 0)
  const totalHrs = (totalMins / 60).toFixed(1)
  const goalHrs = 15
  const goalPct = Math.min(100, Math.round((totalMins / (goalHrs * 60)) * 100))
  const maxMins = Math.max(...minutesByDay, 1)

  return (
    <div className="weekly-card">
      <div className="weekly-top">
        <div>
          <h2>Weekly Focus</h2>
          <div className="weekly-hours">{totalHrs}<span>h</span></div>
          <p className="weekly-goal">Goal: {goalHrs}h · {goalPct}% done</p>
        </div>
        <div className="weekly-goal-ring">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6"/>
            <circle cx="30" cy="30" r="24" fill="none" stroke="#7c3aed" strokeWidth="6"
              strokeDasharray={`${(goalPct / 100) * 150.8} 150.8`}
              strokeLinecap="round" transform="rotate(-90 30 30)"
              style={{ transition: 'stroke-dasharray 0.5s' }}
            />
          </svg>
          <span className="ring-pct">{goalPct}%</span>
        </div>
      </div>

      <div className="weekly-bars">
        {DAYS.map((day, i) => {
          const isToday = weekDates[i] === todayStr
          const h = Math.round((minutesByDay[i] / maxMins) * 48)
          return (
            <div key={day} className="weekly-bar-col">
              <div className="weekly-bar-wrap">
                <div className={`weekly-bar-fill ${isToday ? 'today' : ''}`} style={{ height: `${Math.max(h, 3)}px` }} />
              </div>
              <span className={`weekly-day-label ${isToday ? 'today' : ''}`}>{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
