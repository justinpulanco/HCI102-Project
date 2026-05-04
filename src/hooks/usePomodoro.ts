import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { SessionLog } from '../types'
import { PomodoroSettings, DEFAULT_POMO } from '../pages/SettingsPage'

export type PomodoroMode = 'focus' | 'short' | 'long'
export type SoundType = 'bell' | 'chime' | 'beep' | 'none'

function playSound(type: SoundType) {
  if (type === 'none') return
  try {
    const ctx = new AudioContext()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    if (type === 'beep') {
      const osc = ctx.createOscillator()
      osc.connect(gain)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(); osc.stop(ctx.currentTime + 0.3)
    } else if (type === 'bell') {
      [880, 1100, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.connect(gain)
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.4)
        osc.start(ctx.currentTime + i * 0.25)
        osc.stop(ctx.currentTime + i * 0.25 + 0.4)
      })
    } else if (type === 'chime') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.connect(gain)
        osc.type = 'triangle'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5)
        osc.start(ctx.currentTime + i * 0.15)
        osc.stop(ctx.currentTime + i * 0.15 + 0.5)
      })
    }
  } catch { /* AudioContext not available */ }
}

const NEXT_MODE: Record<PomodoroMode, PomodoroMode> = {
  focus: 'short',
  short: 'focus',
  long: 'focus',
}

export function usePomodoro() {
  const [settings] = useLocalStorage<PomodoroSettings>('sf-pomo-settings', DEFAULT_POMO)
  const [sound, setSound] = useLocalStorage<SoundType>('sf-pomo-sound', 'chime')
  const [autoStart, setAutoStart] = useLocalStorage('sf-pomo-autostart', false)
  const [focusMode, setFocusMode] = useLocalStorage('sf-pomo-focus', false)

  const durations: Record<PomodoroMode, number> = {
    focus: settings.focus * 60,
    short: settings.short * 60,
    long: settings.long * 60,
  }

  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [timeLeft, setTimeLeft] = useState(durations.focus)
  const [running, setRunning] = useState(false)
  const [subject, setSubject] = useState('General')
  const [sessions, setSessions] = useLocalStorage('sf-sessions', 0)
  const [, setSessionLogs] = useLocalStorage<SessionLog[]>('sf-session-logs', [])
  const [banner, setBanner] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = durations[mode]

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false)
            playSound(sound)

            if (mode === 'focus') {
              setSessions(s => s + 1)
              const log: SessionLog = {
                id: Date.now(), subject, mode,
                minutes: settings.focus,
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now(),
              }
              setSessionLogs(logs => [log, ...logs].slice(0, 50))
              const next = NEXT_MODE[mode]
              const nextLabel = next === 'short' ? `${settings.short}m short break` : `${settings.long}m long break`
              setBanner(`🍅 Focus done! Starting ${nextLabel}...`)
              if (autoStart) {
                setTimeout(() => {
                  setMode(next)
                  setTimeLeft(durations[next])
                  setRunning(true)
                  setBanner(null)
                }, 3000)
              } else {
                setTimeout(() => setBanner(null), 4000)
              }
            } else {
              setBanner('☕ Break over! Ready to focus?')
              if (autoStart) {
                setTimeout(() => {
                  setMode('focus')
                  setTimeLeft(durations.focus)
                  setRunning(true)
                  setBanner(null)
                }, 3000)
              } else {
                setTimeout(() => setBanner(null), 4000)
              }
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
  }, [running, mode, subject, sound, autoStart, settings.focus, settings.short, settings.long, setSessions, setSessionLogs, stop, durations])

  const switchMode = (m: PomodoroMode) => {
    setRunning(false); setMode(m); setTimeLeft(durations[m])
  }
  const toggle = () => setRunning(r => !r)
  const reset = () => { setRunning(false); setTimeLeft(durations[mode]) }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')
  const progress = timeLeft / total

  return {
    minutes, seconds, progress, running, toggle, reset,
    mode, switchMode, sessions, subject, setSubject, durations,
    sound, setSound, autoStart, setAutoStart, focusMode, setFocusMode, banner,
  }
}
