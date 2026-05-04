import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, Priority, TaskType } from '../types'
import './TaskCard.css'

const initial: Task[] = [
  { id: 1, title: 'Creating Awesome Mobile Apps', subject: 'Assignments', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-06', type: 'assignment' },
  { id: 2, title: 'Creating Perfect Website', subject: 'Homework', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-07', type: 'assignment' },
  { id: 3, title: 'Download Docs for Assignments', subject: 'Homework', time: '2 Hours', done: true, priority: 'low', dueDate: '2026-05-04', type: 'assignment' },
  { id: 4, title: 'Creating Mobile App Design', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-08', type: 'personal', subject: '' },
  { id: 5, title: 'Study Graphic Design', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-09', type: 'personal', subject: '' },
  { id: 6, title: 'Create Animation For Apps', time: '2 Hours', done: false, priority: 'low', dueDate: '2026-05-10', type: 'personal', subject: '' },
]

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
}

const TYPE_LABELS: Record<TaskType, string> = {
  assignment: 'Assignment',
  personal: 'Personal',
}

export default function TasksCard({ search }: { search?: string }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('sf-tasks', initial)
  const [adding, setAdding] = useState(false)
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [form, setForm] = useState({ title: '', subject: '', time: '', priority: 'medium' as Priority, dueDate: '', type: 'personal' as TaskType })
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
    setForm({ title: '', subject: '', time: '', priority: 'medium', dueDate: '', type: 'personal' })
    setAdding(false)
  }

  const visible = tasks
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))

  const isOverdue = (t: Task) => !t.done && t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString())

  return (
    <div className="card">
      <div className="card-header">
        <h2>Tasks</h2>
        <button className="add-btn" onClick={() => setAdding(true)}>+ Add</button>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Type:</span>
          {(['all', 'assignment', 'personal'] as const).map(t => (
            <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t === 'all' ? 'All' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Priority:</span>
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button key={p} className={`filter-btn ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
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
              <span className="task-meta">
                {task.type === 'assignment' && task.subject && `${task.subject} · `}
                {task.type === 'personal' ? '📌 Personal' : '📚 Assignment'}
                {task.dueDate && (
                  <span className={`due-date ${isOverdue(task) ? 'overdue' : ''}`}>
                    {' · '}{isOverdue(task) ? '⚠ ' : ''}{task.dueDate}
                  </span>
                )}
              </span>
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
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TaskType }))}>
            <option value="assignment">Assignment</option>
            <option value="personal">Personal</option>
          </select>
          {form.type === 'assignment' && (
            <input placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          )}
          <input placeholder="Time (e.g. 1 Hour)" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
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
