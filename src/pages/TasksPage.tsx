import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, Priority } from '../types'
import './TasksPage.css'

const initial: Task[] = [
  { id: 1, title: 'UI/UX Project Research', subject: 'Design', time: '10:00 AM', done: false, priority: 'high', dueDate: '2026-05-06' },
  { id: 2, title: 'Design Figma Prototype', subject: 'Design', time: '12:00 PM', done: true, priority: 'high', dueDate: '2026-05-06' },
  { id: 3, title: 'Web Development', subject: 'Programming', time: '2:00 PM', done: false, priority: 'medium', dueDate: '2026-05-07' },
  { id: 4, title: 'Read HCI Chapter 5', subject: 'Courses', time: '4:00 PM', done: true, priority: 'low', dueDate: '2026-05-07' },
  { id: 5, title: 'Prepare Presentation', subject: 'Assignments', time: '6:00 PM', done: false, priority: 'medium', dueDate: '2026-05-08' },
]

type Filter = 'All' | 'Pending' | 'Completed'

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#10b981',
}

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('sf-tasks-all', initial)
  const [filter, setFilter] = useState<Filter>('All')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', subject: '', time: '', dueDate: '', priority: 'medium' as Priority })

  const visible = tasks.filter(t =>
    filter === 'All' ? true : filter === 'Pending' ? !t.done : t.done
  )

  const toggle = (id: number) =>
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task))

  const remove = (id: number) =>
    setTasks(t => t.filter(task => task.id !== id))

  const openAdd = () => {
    setEditId(null)
    setForm({ title: '', subject: '', time: '', dueDate: '', priority: 'medium' })
    setShowModal(true)
  }

  const openEdit = (task: Task) => {
    setEditId(task.id)
    setForm({ title: task.title, subject: task.subject, time: task.time, dueDate: task.dueDate, priority: task.priority })
    setShowModal(true)
  }

  const save = () => {
    if (!form.title.trim()) return
    if (editId !== null) {
      setTasks(t => t.map(task => task.id === editId ? { ...task, ...form } : task))
    } else {
      setTasks(t => [...t, { id: Date.now(), ...form, done: false }])
    }
    setShowModal(false)
  }

  const pending = tasks.filter(t => !t.done).length
  const completed = tasks.filter(t => t.done).length

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <h1>My Tasks</h1>
        <button className="tasks-add-btn" onClick={openAdd}>+ Add Task</button>
      </div>

      <div className="tasks-summary">
        <div className="summary-chip">
          <span className="summary-num">{pending}</span>
          <span className="summary-label">Pending</span>
        </div>
        <div className="summary-chip done">
          <span className="summary-num">{completed}</span>
          <span className="summary-label">Completed</span>
        </div>
        <div className="summary-chip total">
          <span className="summary-num">{tasks.length}</span>
          <span className="summary-label">Total</span>
        </div>
      </div>

      <div className="tasks-filter-tabs">
        {(['All', 'Pending', 'Completed'] as Filter[]).map(f => (
          <button key={f} className={`tasks-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <ul className="tasks-full-list">
        {visible.map(task => (
          <li key={task.id} className={`tasks-full-item ${task.done ? 'done' : ''}`}>
            <button className="check-btn" onClick={() => toggle(task.id)} aria-label="Toggle">
              <svg className="check-icon" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="priority-dot" style={{ background: PRIORITY_COLORS[task.priority] }} />
            <div className="tasks-full-info">
              <span className="tasks-full-title">{task.title}</span>
              <span className="tasks-full-meta">{task.subject} · {task.time}</span>
            </div>
            <span className="tasks-full-due">{task.dueDate}</span>
            <div className="tasks-full-actions">
              <button className="task-action-btn edit" onClick={() => openEdit(task)} aria-label="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className="task-action-btn del" onClick={() => remove(task.id)} aria-label="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </li>
        ))}
        {visible.length === 0 && <li className="tasks-empty">No tasks here 🎉</li>}
      </ul>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Task Name</label>
              <input placeholder="Enter task name" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <label>Subject</label>
              <input placeholder="e.g. Design, Programming" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              <label>Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              <label>Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={save}>Save Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
