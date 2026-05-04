import { useLocalStorage } from '../hooks/useLocalStorage'
import { SessionLog } from '../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './BestHoursChart.css'

export default function BestHoursChart() {
  const [logs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])

  const hourBuckets = Array.from({ length: 24 }, (_, h) => ({ hour: h, minutes: 0 }))
  logs.forEach(log => {
    const h = new Date(log.timestamp).getHours()
    hourBuckets[h].minutes += log.minutes
  })

  // Only show 6am–midnight for cleaner chart
  const data = hourBuckets.slice(6, 24).map(b => ({
    label: b.hour < 12 ? `${b.hour}am` : b.hour === 12 ? '12pm' : `${b.hour - 12}pm`,
    minutes: b.minutes,
  }))

  const maxMins = Math.max(...data.map(d => d.minutes), 1)
  const bestHour = data.reduce((best, d) => d.minutes > best.minutes ? d : best, data[0])

  return (
    <div className="card best-hours-card">
      <div className="card-header">
        <h2>Best Study Hours</h2>
        {bestHour.minutes > 0 && (
          <span className="best-hour-badge">Peak: {bestHour.label}</span>
        )}
      </div>
      {logs.length === 0 ? (
        <div className="empty-state-chart">
          <span>🕐</span>
          <p>Complete Pomodoros to see your best study hours</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} barSize={10}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#aaa' }} interval={2} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 11 }}
              formatter={(v: number) => [`${v} min`, 'Study time']}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.minutes === maxMins && entry.minutes > 0 ? '#7c3aed' : '#e9d5ff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
