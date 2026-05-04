import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { SessionLog } from '../types'

export type PomodoroMode = 'focus' | 'short' | 'long'

export const DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

function playDing() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch { /* AudioContext not available */ }
}

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [subject, setSubject] = useState('General')
  const [sessions, setSessions] = useLocalStorage('sf-sessions', 0)
  const [sessionLogs, setSessionLogs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = DURATIONS[mode]

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false)
            playDing()
            if (mode === 'focus') {
              setSessions(s => s + 1)
              const log: SessionLog = {
                id: Date.now(),
                subject,
                mode,
                minutes: Math.round(DURATIONS[mode] / 60),
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now(),
              }
              setSessionLogs(logs => [log, ...logs].slice(0, 50))
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      stop()
    }
    return stop
  }, [running, mode, subject, setSessions, setSessionLogs, stop])

  const switchMode = (m: PomodoroMode) => {
    setRunning(false)
    setMode(m)
    setTimeLeft(DURATIONS[m])
  }

  const toggle = () => setRunning(r => !r)
  const reset = () => { setRunning(false); setTimeLeft(DURATIONS[mode]) }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')
  const progress = timeLeft / total

  return { minutes, seconds, progress, running, toggle, reset, mode, switchMode, sessions, subject, setSubject, sessionLogs }
}
