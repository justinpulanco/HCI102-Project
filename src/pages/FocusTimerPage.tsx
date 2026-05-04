import PomodoroCard from '../components/PomodoroCard'
import SessionHistoryCard from '../components/SessionHistoryCard'
import { QUOTES } from '../types'
import './FocusTimerPage.css'

const tip = QUOTES[new Date().getDate() % QUOTES.length]

export default function FocusTimerPage() {
  return (
    <div className="focus-page">
      <h1>Focus Timer</h1>
      <div className="focus-layout">
        <div className="focus-main">
          <PomodoroCard />
          <div className="focus-tip-card">
            <span className="focus-tip-icon">💡</span>
            <div>
              <p className="focus-tip-label">Tip</p>
              <p className="focus-tip-text">{tip}</p>
            </div>
          </div>
        </div>
        <div className="focus-side">
          <SessionHistoryCard />
        </div>
      </div>
    </div>
  )
}
