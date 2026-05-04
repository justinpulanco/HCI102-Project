import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog } from '../types'
import './PersonalRecordsCard.css'

function calcLongestStreak(logs: SessionLog[]) {
  if (!logs.length) return 0
  const dates = [...new Set(logs.map(l => l.date))].sort()
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) { cur++; max = Math.max(max, cur) } else cur = 1
  }
  return max
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function PersonalRecordsCard() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const longestStreak = calcLongestStreak(logs)

  const dayMinutes = Array(7).fill(0)
  logs.forEach(l => { dayMinutes[new Date(l.timestamp).getDay()] += l.minutes })
  const bestDayIdx = dayMinutes.indexOf(Math.max(...dayMinutes))
  const bestDay = dayMinutes[bestDayIdx] > 0 ? DAY_NAMES[bestDayIdx] : '—'

  const totalSessions = logs.length
  const totalMins = logs.reduce((s, l) => s + l.minutes, 0)

  const records = [
    { icon: '🔥', label: 'Longest Streak', value: `${longestStreak} day${longestStreak !== 1 ? 's' : ''}` },
    { icon: '📅', label: 'Most Productive Day', value: bestDay },
    { icon: '🍅', label: 'Total Sessions', value: String(totalSessions) },
    { icon: '⏱', label: 'Total Study Time', value: `${(totalMins / 60).toFixed(1)}h` },
  ]

  return (
    <div className="card records-card">
      <div className="card-header"><h2>Personal Records</h2></div>
      <div className="records-grid">
        {records.map(r => (
          <div key={r.label} className="record-item">
            <span className="record-icon">{r.icon}</span>
            <div>
              <div className="record-value">{r.value}</div>
              <div className="record-label">{r.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
