import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, MyTask } from '../types'
import './DeadlinesCard.css'

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date(new Date().toDateString()).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const initialToday: Task[] = [
  { id: 1, title: 'Creating Awesome Mobile Apps', subject: 'Assignments', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-06' },
  { id: 2, title: 'Creating Perfect Website', subject: 'Homework', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-07' },
  { id: 3, title: 'Download Docs for Assignments', subject: 'Homework', time: '2 Hours', done: true, priority: 'low', dueDate: '2026-05-04' },
]
const initialMy: MyTask[] = [
  { id: 1, title: 'Creating Mobile App Design', time: '1 Hour', done: false, priority: 'high', dueDate: '2026-05-08' },
  { id: 2, title: 'Study Graphic Design', time: '2 Hours', done: false, priority: 'medium', dueDate: '2026-05-09' },
  { id: 3, title: 'Create Animation For Apps', time: '2 Hours', done: false, priority: 'low', dueDate: '2026-05-10' },
]

export default function DeadlinesCard() {
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', initialToday)
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', initialMy)

  const all = [
    ...todayTasks.map(t => ({ ...t, source: 'Today' })),
    ...myTasks.map(t => ({ ...t, subject: '', source: 'My Tasks' })),
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
          const days = daysUntil(task.dueDate)
          const overdue = days !== null && days < 0
          const today = days === 0
          return (
            <li key={`${task.source}-${task.id}`} className={`deadline-item ${overdue ? 'overdue' : today ? 'due-today' : ''}`}>
              <div className="deadline-info">
                <span className="deadline-title">{task.title}</span>
                <span className="deadline-source">{task.source}</span>
              </div>
              <span className="deadline-badge">
                {overdue ? `${Math.abs(days!)}d overdue` : today ? 'Today!' : `${days}d left`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
