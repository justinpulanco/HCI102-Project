import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Course, DEFAULT_COURSES, Task, MyTask } from '../types'
import './CoursesCard.css'

const PRESET_COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6']

export default function CoursesCard() {
  const [courses, setCourses] = useLocalStorage<Course[]>('sf-courses', DEFAULT_COURSES)
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', [])
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', [])
  const [adding, setAdding] = useState(false)
  const [detail, setDetail] = useState<Course | null>(null)
  const [form, setForm] = useState({ name: '', color: '#7c3aed', goal: 120 })

  const addCourse = () => {
    if (!form.name.trim()) return
    setCourses(c => [...c, { id: Date.now(), name: form.name, color: form.color, minutesSpent: 0, goal: form.goal }])
    setForm({ name: '', color: '#7c3aed', goal: 120 })
    setAdding(false)
  }

  const removeCourse = (id: number) => setCourses(c => c.filter(x => x.id !== id))

  const getCourseTasks = (name: string) =>
    [
      ...todayTasks.filter(t => t.subject.toLowerCase() === name.toLowerCase()),
      ...myTasks.filter(t => t.title.toLowerCase().includes(name.toLowerCase())),
    ]

  return (
    <div className="card courses-card">
      <div className="card-header">
        <h2>My Courses</h2>
        <button className="add-btn" onClick={() => setAdding(a => !a)}>+ Add</button>
      </div>

      {adding && (
        <div className="course-add-form">
          <input placeholder="Course name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="color-picker-row">
            {PRESET_COLORS.map(c => (
              <button key={c} className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                style={{ background: c }} onClick={() => setForm(f => ({ ...f, color: c }))} />
            ))}
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="color-custom" title="Custom color" />
          </div>
          <div className="course-add-actions">
            <button className="save-btn" onClick={addCourse}>Add</button>
            <button className="cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="courses-list">
        {courses.map(course => {
          const pct = Math.min(100, Math.round((course.minutesSpent / course.goal) * 100))
          const hrs = (course.minutesSpent / 60).toFixed(1)
          return (
            <div key={course.id} className="course-item">
              <div className="course-item-top">
                <button className="course-chip" style={{ background: course.color + '22', color: course.color }}
                  onClick={() => setDetail(course)}>
                  <span className="course-dot" style={{ background: course.color }} />
                  {course.name}
                </button>
                <button className="course-remove-btn" onClick={() => removeCourse(course.id)} title="Remove">✕</button>
              </div>
              <div className="course-progress-wrap">
                <div className="course-progress-bar">
                  <div className="course-progress-fill" style={{ width: `${pct}%`, background: course.color }} />
                </div>
                <span className="course-time">{hrs}h</span>
              </div>
            </div>
          )
        })}
        {courses.length === 0 && <p className="empty-state">No courses yet</p>}
      </div>

      {/* Course detail modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-card course-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="course-detail-title">
                <span className="course-dot" style={{ background: detail.color, width: 12, height: 12 }} />
                <h3>{detail.name}</h3>
              </div>
              <button className="modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="course-detail-body">
              <div className="course-detail-stats">
                <div className="detail-stat">
                  <span className="detail-stat-num">{(detail.minutesSpent / 60).toFixed(1)}h</span>
                  <span className="detail-stat-label">Time Spent</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-num">{Math.round((detail.minutesSpent / detail.goal) * 100)}%</span>
                  <span className="detail-stat-label">Goal Progress</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-num">{getCourseTasks(detail.name).length}</span>
                  <span className="detail-stat-label">Tasks</span>
                </div>
              </div>
              <h4 className="detail-tasks-title">Related Tasks</h4>
              <ul className="detail-task-list">
                {getCourseTasks(detail.name).map((t, idx) => (
                  <li key={idx} className={`detail-task-item ${t.done ? 'done' : ''}`}>
                    <span className={`detail-task-dot ${t.done ? 'done' : ''}`} />
                    <span>{t.title}</span>
                    {'dueDate' in t && (t as { dueDate?: string }).dueDate && (
                      <span className="detail-task-due">{(t as { dueDate: string }).dueDate}</span>
                    )}
                  </li>
                ))}
                {getCourseTasks(detail.name).length === 0 && (
                  <li className="detail-empty">No tasks tagged to this course</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
