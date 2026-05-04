import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MyTask, Priority } from '../types'
import './TaskCard.css'

const initial: MyTask[] = [
  { id: 1, title: 'Creating Mobile App Design', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-08' },
  { id: 2, title: 'Study Graphic Design', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-09' },
  { id: 3, title: 'Create Animation For Apps', time: '2 Hours', done: false, priority: 'low', dueDate: '2026-05-10' },
]

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
}

export default function MyTaskCard({ search }: { search?: string }) {
  const [tasks, setTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', initial)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', time: '', priority: 'medium' as Priority, dueDate: '' })
  const [justDone, setJustDone] = useState<number | null>(null)

  const toggle = (id: number) => {
    setJustDone(id)
    setTimeout(() => setJustDone(null), 600)
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done, completedAt: !task.done ? Date.now() : undefined } : task))
  }

  const remove = (id: number) => setTasks(t => t.filter(task => task.id !== id))

  const add = () => {
    if (!form.title.trim()) return
    setTasks(t => [...t, { id: Date.now(), ...form, done: false }])
    setForm({ title: '', time: '', priority: 'medium', dueDate: '' })
    setAdding(false)
  }

  const visible = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="card">
      <div className="card-header">
        <h2>My Task</h2>
        <button className="add-btn" onClick={() => setAdding(true)}>+ Add</button>
      </div>

      <ul className="task-list">
        {visible.map(task => (
          <li key={task.id} className={`task-item ${task.done ? 'done' : ''} ${justDone === task.id ? 'pop' : ''}`}>
            <button className="check-btn" onClick={() => toggle(task.id)} aria-label="Toggle task">
              <svg className="check-icon" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="priority-dot" style={{ background: PRIORITY_COLORS[task.priority] }} />
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              {task.dueDate && <span className="task-meta">{task.dueDate}</span>}
            </div>
            <span className="task-time">{task.time}</span>
            <button className="delete-btn" onClick={() => remove(task.id)} aria-label="Delete task">✕</button>
          </li>
        ))}
        {visible.length === 0 && <li className="empty-state">No tasks found</li>}
      </ul>

      {adding && (
        <div className="add-form">
          <input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input placeholder="Time (e.g. 2 Hours)" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <div className="form-actions">
            <button className="save-btn" onClick={add}>Save</button>
            <button className="cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
