import { Toast } from '../hooks/useToast'
import './ToastContainer.css'

interface Props {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

const ICONS = { success: '✅', info: 'ℹ️', warning: '⚠️' }

export default function ToastContainer({ toasts, onDismiss }: Props) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => onDismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
