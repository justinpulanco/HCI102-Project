import { useLocalStorage } from './useLocalStorage'

export interface Notification {
  id: number
  text: string
  read: boolean
  time: number
}

const initial: Notification[] = [
  { id: 1, text: 'Pomodoro session completed! 🍅', read: false, time: Date.now() - 60000 * 5 },
  { id: 2, text: 'Task "Web Development" is due today', read: false, time: Date.now() - 60000 * 30 },
  { id: 3, text: 'You\'re on a 3-day streak! 🔥', read: true, time: Date.now() - 60000 * 60 },
]

export function useNotifications() {
  const [notifs, setNotifs] = useLocalStorage<Notification[]>('sf-notifs', initial)

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markAllUnread = () => setNotifs(n => n.map(x => ({ ...x, read: false })))

  const add = (text: string) =>
    setNotifs(n => [{ id: Date.now(), text, read: false, time: Date.now() }, ...n].slice(0, 20))

  return { notifs, unread, markAllRead, markAllUnread, add }
}
