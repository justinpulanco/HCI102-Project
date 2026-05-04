import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, Priority } from '../types'
import './NextBestTaskCard.css'

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

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

function getTimeLeft(dueDate: string): { text: string; urgency: 'overdue' | 'urgent' | 'soon' | 'later' } {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (diff < 0) {
    return { text: `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`, urgency: 'overdue' }
  }
  if (hours < 24) {
    return { text: `Due in ${hours}h ${minutes}m`, urgency: 'urgent' }
  }
  if (days <= 2) {
    return { text: `Due in ${days} day${days !== 1 ? 's' : ''}`, urgency: 'soon' }
  }
  return { text: `Due in ${days} days`, urgency: 'later' }
}

export default function NextBestTaskCard() {
  const navigate = useNavigate()
  const [tasks] = useLocalStorage<Task[]>('sf-tasks', initial)
  const [, setLinkedTaskId] = useLocalStorage<number | null>('sf-pomo-task-id', null)

  // Find the best task: sort by priority first, then by due date
  const nextTask = tasks
    .filter(t => !t.done && t.dueDate)
    .sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })[0]

  const handleStartTask = () => {
    if (nextTask) {
      setLinkedTaskId(nextTask.id)
      navigate('/focus')
    }
  }

  if (!nextTask) {
    return (
      <div className="next-best-card">
        <h2>Next Best Task</h2>
        <div className="no-tasks">
          <p>🎉 All caught up!</p>
          <span>No pending tasks</span>
        </div>
      </div>
    )
  }

  const timeInfo = getTimeLeft(nextTask.dueDate)
  const urgencyClass = timeInfo.urgency

  return (
    <div className="next-best-card">
      <h2>Next Best Task</h2>
      <div className={`next-task-content ${urgencyClass}`}>
        <div className="task-header">
          <span className="priority-dot" style={{ background: PRIORITY_COLORS[nextTask.priority] }} />
          <div className="task-meta">
            <span className="task-source">{nextTask.type === 'assignment' ? '📚 Assignment' : '📌 Personal'}</span>
            {nextTask.subject && <span className="task-subject">{nextTask.subject}</span>}
          </div>
        </div>

        <h3 className="task-title">{nextTask.title}</h3>

        <div className="task-details">
          <div className="detail-item">
            <span className="detail-label">Time needed:</span>
            <span className="detail-value">{nextTask.time}</span>
          </div>
          <div className={`detail-item urgency-${urgencyClass}`}>
            <span className="detail-label">Status:</span>
            <span className="detail-value">{timeInfo.text}</span>
          </div>
        </div>

        <button className="start-task-btn" onClick={handleStartTask}>Start Task</button>
      </div>
    </div>
  )
}
