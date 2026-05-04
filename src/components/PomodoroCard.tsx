import { usePomodoro, PomodoroMode, SoundType } from '../hooks/usePomodoro'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_COURSES, Course, Task, MyTask } from '../types'
import './PomodoroCard.css'

const SIZE = 180
const STROKE = 12
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

const MODE_KEYS: PomodoroMode[] = ['focus', 'short', 'long']
const MODE_LABELS: Record<PomodoroMode, string> = { focus: 'Focus', short: 'Short', long: 'Long' }
const SOUNDS: { value: SoundType; label: string }[] = [
  { value: 'chime', label: '🎵 Chime' },
  { value: 'bell', label: '🔔 Bell' },
  { value: 'beep', label: '📳 Beep' },
  { value: 'none', label: '🔇 None' },
]

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

export default function PomodoroCard() {
  const {
    minutes, seconds, progress, running, toggle, reset,
    mode, switchMode, sessions, subject, setSubject, durations,
    sound, setSound, autoStart, setAutoStart, focusMode, setFocusMode, banner,
    linkedTaskId, setLinkedTaskId, taskSessions,
  } = usePomodoro()
  const [courses] = useLocalStorage<Course[]>('sf-courses', DEFAULT_COURSES)
  const [todayTasks] = useLocalStorage<Task[]>('sf-tasks-today', initialToday)
  const [myTasks] = useLocalStorage<MyTask[]>('sf-tasks-my', initialMy)
  const [showTaskPicker, setShowTaskPicker] = useLocalStorage('sf-pomo-show-picker', false)
  
  const dash = CIRCUMFERENCE * progress
  
  // Get all available tasks
  const allTasks = [
    ...todayTasks.map(t => ({ ...t, source: 'Today' as const })),
    ...myTasks.map(t => ({ ...t, subject: '', source: 'My Tasks' as const })),
  ].filter(t => !t.done)
  
  // Get linked task info
  const linkedTask = allTasks.find(t => t.id === linkedTaskId)
  const linkedTaskSessionCount = linkedTaskId ? (taskSessions[linkedTaskId] || 0) : 0

  return (
    <>
      {focusMode && <div className="focus-mode-overlay" onClick={() => setFocusMode(false)} />}

      <div className={`pomodoro-card ${focusMode ? 'focus-mode-active' : ''}`}>
        {banner && <div className="pomo-banner">{banner}</div>}

        <div className="pomo-top">
          <span className="pomo-label">Pomodoro</span>
          <div className="pomo-top-right">
            <span className="pomo-sessions">🍅 {sessions}</span>
            <button
              className={`pomo-focus-btn ${focusMode ? 'active' : ''}`}
              onClick={() => setFocusMode(f => !f)}
              title="Focus mode"
            >
              {focusMode ? '⊠' : '⊡'}
            </button>
          </div>
        </div>

        <div className="pomo-modes">
          {MODE_KEYS.map(m => (
            <button key={m} className={`pomo-mode-btn ${mode === m ? 'active' : ''}`} onClick={() => switchMode(m)}>
              {MODE_LABELS[m]} · {durations[m] / 60}m
            </button>
          ))}
        </div>

        <div className="pomodoro-circle-wrap">
          <svg width={SIZE} height={SIZE}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} />
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#fff" strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE}`} strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: 'stroke-dasharray 0.5s linear' }}
            />
          </svg>
          <div className="pomodoro-time">{minutes}:{seconds}</div>
        </div>

        <div className="pomo-subject-row">
          <span className={`pomo-active-dot ${running ? 'live' : ''}`} />
          {linkedTask ? (
            <div className="pomo-linked-task">
              <span className="linked-task-title">{linkedTask.title}</span>
              <span className="linked-task-sessions">{linkedTaskSessionCount} session{linkedTaskSessionCount !== 1 ? 's' : ''}</span>
              <button className="unlink-btn" onClick={() => setLinkedTaskId(null)} title="Unlink task">✕</button>
            </div>
          ) : (
            <select className="pomo-subject-select" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="General">General</option>
              {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          )}
        </div>

        {!linkedTask && (
          <button className="pomo-link-task-btn" onClick={() => setShowTaskPicker(!showTaskPicker)}>
            {showTaskPicker ? '✕ Close' : '+ Link Task'}
          </button>
        )}

        {showTaskPicker && !linkedTask && (
          <div className="pomo-task-picker">
            <div className="task-picker-header">Select a task to link</div>
            <div className="task-picker-list">
              {allTasks.length === 0 ? (
                <div className="no-tasks-msg">No available tasks</div>
              ) : (
                allTasks.map(task => (
                  <button
                    key={`${task.source}-${task.id}`}
                    className="task-picker-item"
                    onClick={() => {
                      setLinkedTaskId(task.id)
                      setShowTaskPicker(false)
                    }}
                  >
                    <span className="picker-task-title">{task.title}</span>
                    <span className="picker-task-source">{task.source}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="pomodoro-controls">
          <button className="pomo-start" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>
          <button className="pomo-reset" onClick={reset} aria-label="Reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
            </svg>
          </button>
        </div>

        <div className="pomo-settings-row">
          <select className="pomo-sound-select" value={sound} onChange={e => setSound(e.target.value as SoundType)}>
            {SOUNDS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <label className="pomo-autostart-label">
            <input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} />
            Auto-start
          </label>
        </div>
      </div>
    </>
  )
}
