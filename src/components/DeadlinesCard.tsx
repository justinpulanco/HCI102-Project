import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task } from '../types'
import './DeadlinesCard.css'

function getUrgencyInfo(dateStr: string): { text: string; urgency: 'overdue' | 'urgent' | 'soon' | 'later'; icon: string } {
  if (!dateStr) return { text: 'No date', urgency: 'later', icon: '⚪' }
  
  const now = new Date()
  const due = new Date(dateStr)
  const diff = due.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (diff < 0) {
    return { text: `Overdue by ${Math.abs(days)}d`, urgency: 'overdue', icon: '🔴' }
  }
  if (hours < 24) {
    return { text: `Due in ${hours}h ${minutes}m`, urgency: 'urgent', icon: '🔴' }
  }
  if (days <= 2) {
    return { text: `Due in ${days}d`, urgency: 'soon', icon: '🟡' }
  }
  return { text: `Due in ${days}d`, urgency: 'later', icon: '🟢' }
}

const initial: Task[] = [
  { id: 1, title: 'Creating Awesome Mobile Apps', subject: 'Assignments', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-06', type: 'assignment' },
  { id: 2, title: 'Creating Perfect Website', subject: 'Homework', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-07', type: 'assignment' },
  { id: 3, title: 'Download Docs for Assignments', subject: 'Homework', time: '2 Hours', done: true, priority: 'low', dueDate: '2026-05-04', type: 'assignment' },
  { id: 4, title: 'Creating Mobile App Design', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-08', type: 'personal', subject: '' },
  { id: 5, title: 'Study Graphic Design', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-09', type: 'personal', subject: '' },
  { id: 6, title: 'Create Animation For Apps', time: '2 Hours', done: false, priority: 'low', dueDate: '2026-05-10', type: 'personal', subject: '' },
]

export default function DeadlinesCard() {
  const [tasks] = useLocalStorage<Task[]>('sf-tasks', initial)

  const all = [
    ...tasks
  ]
    .filter(t => !t.done && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="deadlines-card">
      <h2>Upcoming Deadlines</h2>
      {all.length === 0 && <p className="no-deadlines">No upcoming deadlines 🎉</p>}
      <ul className="deadlines-list">
        {all.map(task => {
          const urgency = getUrgencyInfo(task.dueDate)
          return (
            <li key={task.id} className={`deadline-item urgency-${urgency.urgency}`}>
              <div className="deadline-info">
                <span className="urgency-icon">{urgency.icon}</span>
                <div className="deadline-text">
                  <span className="deadline-title">{task.title}</span>
                  <span className="deadline-source">{task.type === 'assignment' ? '📚 Assignment' : '📌 Personal'}</span>
                </div>
              </div>
              <span className="deadline-badge">{urgency.text}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
