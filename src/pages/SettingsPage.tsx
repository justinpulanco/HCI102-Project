import './SettingsPage.css'

interface Props { dark: boolean; onToggleDark: () => void }

export default function SettingsPage({ dark, onToggleDark }: Props) {
  return (
    <div className="settings-page">
      <h1>Settings</h1>

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

      <div className="settings-section">
        <h2>Profile</h2>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Name</p>
            <p className="settings-row-sub">David Max</p>
          </div>
          <button className="settings-edit-btn">Edit</button>
        </div>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Role</p>
            <p className="settings-row-sub">Student</p>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Pomodoro</h2>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Focus Duration</p>
            <p className="settings-row-sub">25 minutes</p>
          </div>
        </div>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Short Break</p>
            <p className="settings-row-sub">5 minutes</p>
          </div>
        </div>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Long Break</p>
            <p className="settings-row-sub">15 minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
