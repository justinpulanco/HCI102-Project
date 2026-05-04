import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog } from '../types'
import './HeatmapCard.css'

const WEEKS = 10
const DAYS_PER_WEEK = 7

export default function HeatmapCard() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const minutesByDate: Record<string, number> = {}
  logs.forEach(l => {
    minutesByDate[l.date] = (minutesByDate[l.date] ?? 0) + l.minutes
  })

  const today = new Date()
  const cells: { date: string; mins: number }[] = []
  for (let i = WEEKS * DAYS_PER_WEEK - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    cells.push({ date: key, mins: minutesByDate[key] ?? 0 })
  }

  const maxMins = Math.max(...cells.map(c => c.mins), 1)

  const intensity = (mins: number) => {
    if (mins === 0) return 0
    const r = mins / maxMins
    if (r < 0.25) return 1
    if (r < 0.5) return 2
    if (r < 0.75) return 3
    return 4
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < WEEKS; i++) weeks.push(cells.slice(i * 7, i * 7 + 7))

  return (
    <div className="card heatmap-card">
      <div className="card-header">
        <h2>Study Activity</h2>
        <div className="heatmap-legend">
          {[0,1,2,3,4].map(l => <span key={l} className={`heatmap-cell level-${l}`} />)}
        </div>
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map(cell => (
              <div
                key={cell.date}
                className={`heatmap-cell level-${intensity(cell.mins)}`}
                title={`${cell.date}: ${cell.mins} min`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
