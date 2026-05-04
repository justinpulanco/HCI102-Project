import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Course } from '../types'
import './OnboardingModal.css'

const PRESET_COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export default function OnboardingModal() {
  const [done, setDone] = useLocalStorage('sf-onboarded', false)
  const [step, setStep] = useState(0)
  const [name, setName] = useLocalStorage('sf-profile', { name: 'David Max', role: 'Student' })
  const [nameInput, setNameInput] = useState(name.name)
  const [goalHours, setGoalHours] = useState(5)
  const [subjects, setSubjects] = useState<{ name: string; color: string }[]>([])
  const [subInput, setSubInput] = useState('')
  const [subColor, setSubColor] = useState('#7c3aed')
  const [, setCourses] = useLocalStorage<Course[]>('sf-courses', [])

  if (done) return null

  const addSubject = () => {
    if (!subInput.trim() || subjects.length >= 6) return
    setSubjects(s => [...s, { name: subInput.trim(), color: subColor }])
    setSubInput('')
  }

  const finish = () => {
    setName({ name: nameInput || 'Student', role: 'Student' })
    if (subjects.length > 0) {
      setCourses(subjects.map((s, i) => ({ id: i + 1, name: s.name, color: s.color, minutesSpent: 0, goal: goalHours * 60 })))
    }
    setDone(true)
  }

  const steps = [
    {
      title: "Welcome to StudyFlow! 👋",
      subtitle: "Let's set up your workspace in 3 quick steps.",
      content: (
        <div className="onboard-step">
          <label>What's your name?</label>
          <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Enter your name" />
        </div>
      ),
    },
    {
      title: "Set your daily study goal 🎯",
      subtitle: "How many hours do you want to study per day?",
      content: (
        <div className="onboard-step">
          <div className="goal-selector">
            {[2, 3, 4, 5, 6, 8].map(h => (
              <button key={h} className={`goal-btn ${goalHours === h ? 'active' : ''}`} onClick={() => setGoalHours(h)}>
                {h}h
              </button>
            ))}
          </div>
          <p className="goal-note">You can change this anytime in Settings.</p>
        </div>
      ),
    },
    {
      title: "Add your subjects 📚",
      subtitle: "Add up to 6 subjects you're studying.",
      content: (
        <div className="onboard-step">
          <div className="subject-add-row">
            <input value={subInput} onChange={e => setSubInput(e.target.value)} placeholder="Subject name" onKeyDown={e => e.key === 'Enter' && addSubject()} />
            <div className="onboard-colors">
              {PRESET_COLORS.map(c => (
                <button key={c} className={`color-swatch ${subColor === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setSubColor(c)} />
              ))}
            </div>
            <button className="onboard-add-btn" onClick={addSubject}>+</button>
          </div>
          <div className="subject-chips">
            {subjects.map((s, i) => (
              <span key={i} className="subject-chip" style={{ background: s.color + '22', color: s.color }}>
                {s.name}
                <button onClick={() => setSubjects(ss => ss.filter((_, j) => j !== i))}>✕</button>
              </span>
            ))}
            {subjects.length === 0 && <span className="onboard-hint">No subjects yet — you can skip this</span>}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="onboard-overlay">
      <div className="onboard-modal">
        <div className="onboard-progress">
          {steps.map((_, i) => <div key={i} className={`onboard-dot ${i <= step ? 'active' : ''}`} />)}
        </div>
        <h2>{steps[step].title}</h2>
        <p className="onboard-sub">{steps[step].subtitle}</p>
        {steps[step].content}
        <div className="onboard-footer">
          {step > 0 && <button className="onboard-back" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < steps.length - 1
            ? <button className="onboard-next" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="onboard-next" onClick={finish}>Get Started 🚀</button>
          }
        </div>
      </div>
    </div>
  )
}
