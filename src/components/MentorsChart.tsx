import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import './MentorsChart.css'

type Metric = 'tasks' | 'hours' | 'assignments'

const dataMap: Record<Metric, { month: string; value: number; prev: number }[]> = {
  tasks: [
    { month: 'Jan', value: 65, prev: 50 }, { month: 'Feb', value: 80, prev: 65 },
    { month: 'Mar', value: 55, prev: 80 }, { month: 'Apr', value: 90, prev: 55 },
    { month: 'May', value: 70, prev: 90 }, { month: 'Jun', value: 85, prev: 70 },
  ],
  hours: [
    { month: 'Jan', value: 12, prev: 8 }, { month: 'Feb', value: 18, prev: 12 },
    { month: 'Mar', value: 10, prev: 18 }, { month: 'Apr', value: 22, prev: 10 },
    { month: 'May', value: 15, prev: 22 }, { month: 'Jun', value: 20, prev: 15 },
  ],
  assignments: [
    { month: 'Jan', value: 8, prev: 6 }, { month: 'Feb', value: 12, prev: 8 },
    { month: 'Mar', value: 7, prev: 12 }, { month: 'Apr', value: 15, prev: 7 },
    { month: 'May', value: 10, prev: 15 }, { month: 'Jun', value: 13, prev: 10 },
  ],
}

const METRICS: { key: Metric; label: string }[] = [
  { key: 'tasks', label: 'Tasks' },
  { key: 'hours', label: 'Hours' },
  { key: 'assignments', label: 'Assignments' },
]

const months = dataMap.tasks.map(d => d.month)

export default function MentorsChart() {
  const [selected, setSelected] = useState('Mar')
  const [metric, setMetric] = useState<Metric>('tasks')
  const data = dataMap[metric]
  const goal = metric === 'hours' ? 20 : metric === 'tasks' ? 75 : 12

  const selectedData = data.find(d => d.month === selected)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>Monthly Mentors</h2>
        <div className="chart-controls">
          <div className="metric-tabs">
            {METRICS.map(m => (
              <button key={m.key} className={`metric-tab ${metric === m.key ? 'active' : ''}`} onClick={() => setMetric(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
          <select className="month-select" value={selected} onChange={e => setSelected(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={20}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#aaa' }} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(124,58,237,0.05)' }}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }}
            formatter={(val, _, props) => [
              `${val ?? 0} (prev: ${(props.payload as { prev?: number } | undefined)?.prev ?? '-'})`, metric
            ]}
          />
          <ReferenceLine y={goal} stroke="#7c3aed" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map(entry => (
              <Cell key={entry.month} fill={entry.month === selected ? '#7c3aed' : '#e9d5ff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {selectedData && (
        <div className="chart-month-summary">
          <div className="chart-summary-item">
            <span className="chart-summary-label">{selected} — {metric}</span>
            <span className="chart-summary-value">{selectedData.value}</span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-label">vs prev month</span>
            <span className={`chart-summary-delta ${selectedData.value >= selectedData.prev ? 'up' : 'down'}`}>
              {selectedData.value >= selectedData.prev ? '▲' : '▼'} {Math.abs(selectedData.value - selectedData.prev)}
            </span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-label">vs goal ({goal})</span>
            <span className={`chart-summary-delta ${selectedData.value >= goal ? 'up' : 'down'}`}>
              {selectedData.value >= goal ? '✓ Met' : `${goal - selectedData.value} short`}
            </span>
          </div>
        </div>
      )}
      <p className="chart-goal-note">Dashed line = goal ({goal} {metric})</p>
    </div>
  )
}
