export type Priority = 'high' | 'medium' | 'low'
export type TaskType = 'assignment' | 'personal'

export interface Subtask {
  id: number
  title: string
  done: boolean
}

export interface Task {
  id: number
  title: string
  subject: string
  time: string
  done: boolean
  priority: Priority
  dueDate: string
  type: TaskType
  completedAt?: number
  subtasks?: Subtask[]
  notes?: string
  createdAt?: number
}

export interface Course {
  id: number
  name: string
  color: string
  minutesSpent: number
  goal: number // weekly goal in minutes
}

export interface SessionLog {
  id: number
  subject: string
  mode: string
  minutes: number
  date: string // ISO date
  timestamp: number
  taskId?: number // Link to task
}

export interface Note {
  id: number
  text: string
  createdAt: number
}

export const DEFAULT_COURSES: Course[] = [
  { id: 1, name: 'Mathematics', color: '#7c3aed', minutesSpent: 120, goal: 180 },
  { id: 2, name: 'Design', color: '#3b82f6', minutesSpent: 90, goal: 120 },
  { id: 3, name: 'Programming', color: '#10b981', minutesSpent: 200, goal: 240 },
  { id: 4, name: 'History', color: '#f59e0b', minutesSpent: 45, goal: 90 },
  { id: 5, name: 'Physics', color: '#ef4444', minutesSpent: 60, goal: 120 },
]

// Keep for backward compat
export const COURSES = DEFAULT_COURSES

export const QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Believe you can and you're halfway there.",
  "The expert in anything was once a beginner.",
  "Push yourself, because no one else is going to do it for you.",
]
