import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, Priority, Subtask } from '../types'
import './TasksPage.css'

const initial: Task[] = [
  { id: 1, title: 'UI/UX Project Research', subject: 'Design', time: '10:00', done: false, priority: 'high', dueDate: '2026-05-06', createdAt: Date.now() - 5000, subtasks: [], notes: '' },
  { id: 2, title: 'Design Figma Prototype', subject: 'Design', time: '12:00', done: true, priority: 'high', dueDate: '2026-05-06', createdAt: Date.now() - 4000, subtasks: [], notes: '' },
  { id: 3, title: 'Web Development', subject: 'Programming', time: '14:00', done: false, priority: 'medium', dueDate: '2026-05-07', createdAt: Date.now() - 3000, subtasks: [], notes: '' },
  { id: 4, title: 'Read HCI Chapter 5', subject: 'Courses', time: '16:00', done: true, priority: 'low', dueDate: '2026-05-07', createdAt: Date.now() - 2000, subtasks: [], notes: '' },
  { id: 5, title: 'Prepare Presentation', subject: 'Assignments', time: '18:00', done: false, priority: 'medium', dueDate: '2026-05-08', createdAt: Date.now() - 1000, subtasks: [], notes: '' },
]

type Filter = 'All' | 'Pending' | 'Completed'
type SortKey = 'dueDate' | 'priority' | 'createdAt'

const PRIORITY_COLORS: Record<Priority, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export default function TasksPage({ search = '', onToast }: { search?: string; onToast?: (msg: string) => void }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('sf-tasks-all', initial)
  const [filter, setFilter] = useState<Filter>('All')
  const [sort, setSort] = useState<SortKey>('createdAt')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [form, setForm] = useState({ title: '', subject: '', time: '', dueDate: '', priority: 'medium' as Priority, notes: '' })
  const [newSubtask, setNewSubtask] = useState('')

  const sorted = [...tasks].sort((a, b) => {
    if (sort === 'dueDate') return (a.dueDate || '').localeCompare(b.dueDate || '')
    if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    return (b.createdAt ?? 0) - (a.createdAt ?? 0)
  })

  const visible = sorted.filter(t => {
    const matchFilter = filter === 'All' ? true : filter === 'Pending' ? !t.done : t.done
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const toggle = (id: number) => {
    setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done, completedAt: !task.done ? Date.now() : undefined } : task))
    const task = tasks.find(t => t.id === id)
    if (task && !task.done) onToast?.('Task completed! ✅')
  }

  const remove = (id: number) => setTasks(t => t.filter(task => task.id !== id))

  const openAdd = () => {
    setEditId(null)
    setForm({ title: '', subject: '', time: '', dueDate: '', priority: 'medium', notes: '' })
    setShowModal(true)
  }

  const openEdit = (task: Task) => {
    setEditId(task.id)
    setForm({ title: task.title, subject: task.subject, time: task.time, dueDate: task.dueDate, priority: task.priority, notes: task.notes ?? '' })
    setShowModal(true)
  }

  const save = () => {
    if (!form.title.trim()) return
    if (editId !== null) {
      setTasks(t => t.map(task => task.id === editId ? { ...task, ...form } : task))
    } else {
      setTasks(t => [...t, { id: Date.now(), ...form, done: false, createdAt: Date.now(), subtasks: [] }])
      onToast?.('Task added!')
    }
    setShowModal(false)
  }

  // Subtasks
  const addSubtask = (taskId: number) => {
    if (!newSubtask.trim()) return
    const sub: Subtask = { id: Date.now(), title: newSubtask.trim(), done: false }
    setTasks(t => t.map(task => task.id === taskId ? { ...task, subtasks: [...(task.subtasks ?? []), sub] } : task))
    setNewSubtask('')
  }

  const toggleSubtask = (taskId: number, subId: number) => {
    setTasks(t => t.map(task => task.id === taskId
      ? { ...task, subtasks: task.subtasks?.map(s => s.id === subId ? { ...s, done: !s.done } : s) }
      : task))
  }

  const removeSubtask = (taskId: number, subId: number) => {
    setTasks(t => t.map(task => task.id === taskId
      ? { ...task, subtasks: task.subtasks?.filter(s => s.id !== subId) }
      : task))
  }

  const saveNote = (taskId: number, note: string) => {
    setTasks(t => t.map(task => task.id === taskId ? { ...task, notes: note } : task))
  }

  // Bulk
  const toggleSelect = (id: number) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const selectAll = () => setSelected(new Set(visible.map(t => t.id)))
  const clearSelect = () => setSelected(new Set())
  const bulkDone = () => { setTasks(t => t.map(task => selected.has(task.id) ? { ...task, done: true, completedAt: Date.now() } : task)); clearSelect(); onToast?.(`${selected.size} tasks marked done ✅`) }
  const bulkDelete = () => { setTasks(t => t.filter(task => !selected.has(task.id))); clearSelect() }

  const pending = tasks.filter(t => !t.done).length
  const completed = tasks.filter(t => t.done).length

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <h1>My Tasks</h1>
        <button className="tasks-add-btn" onClick={openAdd}>+ Add Task</button>
      </div>

      <div className="tasks-summary">
        <div className="summary-chip"><span className="summary-num">{pending}</span><span className="summary-label">Pending</span></div>
        <div className="summary-chip done"><span className="summary-num">{completed}</span><span className="summary-label">Completed</span></div>
        <div className="summary-chip total"><span className="summary-num">{tasks.length}</span><span className="summary-label">Total</span></div>
      </div>

      <div className="tasks-toolbar">
        <div className="tasks-filter-tabs">
          {(['All', 'Pending', 'Completed'] as Filter[]).map(f => (
            <button key={f} className={`tasks-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="tasks-sort-row">
          <span className="sort-label">Sort:</span>
          {([['dueDate', 'Due Date'], ['priority', 'Priority'], ['createdAt', 'Created']] as [SortKey, string][]).map(([k, l]) => (
            <button key={k} className={`sort-btn ${sort === k ? 'active' : ''}`} onClick={() => setSort(k)}>{l}</button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span>{selected.size} selected</span>
          <button className="bulk-btn done" onClick={bulkDone}>Mark Done</button>
          <button className="bulk-btn del" onClick={bulkDelete}>Delete</button>
          <button className="bulk-btn" onClick={selectAll}>Select All</button>
          <button className="bulk-btn" onClick={clearSelect}>Clear</button>
        </div>
      )}

      <ul className="tasks-full-list">
        {visible.length === 0 && (
          <li className="tasks-empty">
            <div className="empty-illustration">📋</div>
            <p>No tasks here</p>
            <span>Add a task to get started!</span>
          </li>
        )}
        {visible.map(task => {
          const isExpanded = expanded === task.id
          const subtasksDone = (task.subtasks ?? []).filter(s => s.done).length
          const subtasksTotal = (task.subtasks ?? []).length
          return (
            <li key={task.id} className={`tasks-full-item ${task.done ? 'done' : ''} ${selected.has(task.id) ? 'selected' : ''}`}>
              <input type="checkbox" className="task-select-cb" checked={selected.has(task.id)} onChange={() => toggleSelect(task.id)} />
              <button className="check-btn" onClick={() => toggle(task.id)} aria-label="Toggle">
                <svg className="check-icon" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="priority-dot" style={{ background: PRIORITY_COLORS[task.priority] }} />
              <div className="tasks-full-info">
                <span className="tasks-full-title">{task.title}</span>
                <span className="tasks-full-meta">
                  {task.subject} · {task.time}
                  {subtasksTotal > 0 && <span className="subtask-badge"> · {subtasksDone}/{subtasksTotal} subtasks</span>}
                </span>
              </div>
              <span className="tasks-full-due">{task.dueDate}</span>
              <div className="tasks-full-actions">
                <button className="task-action-btn expand" onClick={() => setExpanded(isExpanded ? null : task.id)} aria-label="Expand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isExpanded ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                  </svg>
                </button>
                <button className="task-action-btn edit" onClick={() => openEdit(task)} aria-label="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="task-action-btn del" onClick={() => remove(task.id)} aria-label="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>

              {isExpanded && (
                <div className="task-expanded">
                  {/* Notes */}
                  <div className="task-notes-section">
                    <label className="expanded-label">Notes</label>
                    <textarea
                      className="task-notes-input"
                      placeholder="Add a note..."
                      value={task.notes ?? ''}
                      onChange={e => saveNote(task.id, e.target.value)}
                      rows={2}
                    />
                  </div>
                  {/* Subtasks */}
                  <div className="task-subtasks-section">
                    <label className="expanded-label">Subtasks</label>
                    <ul className="subtask-list">
                      {(task.subtasks ?? []).map(sub => (
                        <li key={sub.id} className={`subtask-item ${sub.done ? 'done' : ''}`}>
                          <button className="subtask-check" onClick={() => toggleSubtask(task.id, sub.id)}>
                            {sub.done ? '✅' : '⭕'}
                          </button>
                          <span className="subtask-title">{sub.title}</span>
                          <button className="subtask-del" onClick={() => removeSubtask(task.id, sub.id)}>✕</button>
                        </li>
                      ))}
                    </ul>
                    <div className="subtask-add-row">
                      <input
                        placeholder="Add subtask..."
                        value={newSubtask}
                        onChange={e => setNewSubtask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSubtask(task.id)}
                      />
                      <button className="subtask-add-btn" onClick={() => addSubtask(task.id)}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
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
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <label>Notes</label>
              <textarea placeholder="Optional notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="modal-textarea" />
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
