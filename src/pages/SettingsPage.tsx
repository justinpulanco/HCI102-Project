import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './SettingsPage.css'

interface Props { dark: boolean; onToggleDark: () => void }

export interface PomodoroSettings {
  focus: number
  short: number
  long: number
}

export const DEFAULT_POMO: PomodoroSettings = { focus: 25, short: 5, long: 15 }

interface Profile { name: string; role: string }

export default function SettingsPage({ dark, onToggleDark }: Props) {
  const [profile, setProfile] = useLocalStorage<Profile>('sf-profile', { name: 'David Max', role: 'Student' })
  const [pomo, setPomo] = useLocalStorage<PomodoroSettings>('sf-pomo-settings', DEFAULT_POMO)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const saveProfile = () => {
    setProfile(profileForm)
    setEditingProfile(false)
    flash()
  }

  const savePomo = (field: keyof PomodoroSettings, val: number) => {
    if (val < 1 || val > 120) return
    setPomo(p => ({ ...p, [field]: val }))
    flash()
  }

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1800) }

  return (
    <div className="settings-page">
      <div className="settings-title-row">
        <h1>Settings</h1>
        {saved && <span className="settings-saved">✓ Saved</span>}
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Dark Mode</p>
            <p className="settings-row-sub">Switch between light and dark theme</p>
          </div>
          <button className={`toggle-switch ${dark ? 'on' : ''}`} onClick={onToggleDark} aria-label="Toggle dark mode">
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="settings-section">
        <h2>Profile</h2>
        {editingProfile ? (
          <div className="profile-edit-form">
            <div className="profile-edit-field">
              <label>Name</label>
              <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="profile-edit-field">
              <label>Role</label>
              <input value={profileForm.role} onChange={e => setProfileForm(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div className="profile-edit-actions">
              <button className="save-btn" onClick={saveProfile}>Save</button>
              <button className="cancel-btn" onClick={() => { setEditingProfile(false); setProfileForm(profile) }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="settings-row">
              <div>
                <p className="settings-row-title">Name</p>
                <p className="settings-row-sub">{profile.name}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => { setEditingProfile(true); setProfileForm(profile) }}>Edit</button>
            </div>
            <div className="settings-row">
              <div>
                <p className="settings-row-title">Role</p>
                <p className="settings-row-sub">{profile.role}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pomodoro */}
      <div className="settings-section">
        <h2>Pomodoro Durations</h2>
        <p className="settings-section-note">Changes apply on next timer reset.</p>
        {([
          { key: 'focus', label: 'Focus Duration' },
          { key: 'short', label: 'Short Break' },
          { key: 'long', label: 'Long Break' },
        ] as { key: keyof PomodoroSettings; label: string }[]).map(({ key, label }) => (
          <div key={key} className="settings-row">
            <div>
              <p className="settings-row-title">{label}</p>
              <p className="settings-row-sub">Current: {pomo[key]} minutes</p>
            </div>
            <div className="pomo-input-row">
              <button className="pomo-step-btn" onClick={() => savePomo(key, pomo[key] - 1)}>−</button>
              <input
                type="number"
                className="pomo-input"
                value={pomo[key]}
                min={1} max={120}
                onChange={e => savePomo(key, Number(e.target.value))}
              />
              <button className="pomo-step-btn" onClick={() => savePomo(key, pomo[key] + 1)}>+</button>
              <span className="pomo-unit">min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
