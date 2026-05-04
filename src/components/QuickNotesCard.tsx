import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Note } from '../types'
import './QuickNotesCard.css'

export default function QuickNotesCard() {
  const [notes, setNotes] = useLocalStorage<Note[]>('sf-notes', [])
  const [text, setText] = useState('')

  const add = () => {
    if (!text.trim()) return
    setNotes(n => [{ id: Date.now(), text: text.trim(), createdAt: Date.now() }, ...n])
    setText('')
  }

  const remove = (id: number) => setNotes(n => n.filter(note => note.id !== id))

  return (
    <div className="card notes-card">
      <div className="card-header">
        <h2>Quick Notes</h2>
        <span className="notes-count">{notes.length}</span>
      </div>
      <div className="notes-input-row">
        <input
          placeholder="Jot something down..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="notes-add-btn" onClick={add}>+</button>
      </div>
      <ul className="notes-list">
        {notes.slice(0, 6).map(note => (
          <li key={note.id} className="note-item">
            <span className="note-text">{note.text}</span>
            <button className="delete-btn" onClick={() => remove(note.id)} aria-label="Delete note">✕</button>
          </li>
        ))}
        {notes.length === 0 && <li className="empty-state">No notes yet</li>}
      </ul>
    </div>
  )
}
