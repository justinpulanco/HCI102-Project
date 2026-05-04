import { useLocalStorage } from '../hooks/useLocalStorage'
import { Task, MyTask } from '../types'
import './SummaryBanner.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' }
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤' }
  return { text: 'Good Evening', emoji: '🌙' }
}

export default function SummaryBanner() {
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', [])
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', [])
  const [sessions] = useLocalStorage('sf-sessions', 0)

  const today = new Date().toISOString().split('T')[0]
  const allTasks = [...todayTasks, ...myTasks]
  const dueTodayCount = allTasks.filter(t => !t.done && t.dueDate === today).length
  const completedToday = allTasks.filter(t => t.done && t.completedAt && new Date(t.completedAt).toISOString().split('T')[0] === today).length

  const { text, emoji } = getGreeting()

  return (
    <div className="summary-banner">
      <div className="summary-banner-left">
        <span className="summary-greeting-emoji">{emoji}</span>
        <div>
          <h2>{text}, David Max!</h2>
          <p>
            {dueTodayCount > 0
              ? `You have ${dueTodayCount} task${dueTodayCount > 1 ? 's' : ''} due today`
              : 'No tasks due today — great job!'}
            {completedToday > 0 && ` · ${completedToday} completed`}
            {sessions > 0 && ` · ${sessions} Pomodoro${sessions > 1 ? 's' : ''} done`}
          </p>
        </div>
      </div>
      <div className="summary-banner-chips">
        <div className="banner-chip purple">
          <span>{dueTodayCount}</span>
          <span>Due Today</span>
        </div>
        <div className="banner-chip green">
          <span>{completedToday}</span>
          <span>Done Today</span>
        </div>
        <div className="banner-chip orange">
          <span>{sessions}</span>
          <span>Pomodoros</span>
        </div>
      </div>
    </div>
  )
}
