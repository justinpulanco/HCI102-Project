import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { useDarkMode } from './hooks/useDarkMode'

// Pages
import LoginPage from './pages/LoginPage'
import TasksPage from './pages/TasksPage'
import FocusTimerPage from './pages/FocusTimerPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'

// Dashboard components
import TaskTodayCard from './components/TaskTodayCard'
import PomodoroCard from './components/PomodoroCard'
import MyTaskCard from './components/MyTaskCard'
import StatsCard from './components/StatsCard'
import MentorsChart from './components/MentorsChart'
import CoursesCard from './components/CoursesCard'
import WeeklyFocusCard from './components/WeeklyFocusCard'
import DeadlinesCard from './components/DeadlinesCard'
import StreakGoalsCard from './components/StreakGoalsCard'
import SessionHistoryCard from './components/SessionHistoryCard'
import QuickNotesCard from './components/QuickNotesCard'
import HeatmapCard from './components/HeatmapCard'

import './App.css'

function Dashboard({ search }: { search: string }) {
  return (
    <div className="dashboard-grid">
      <div className="col-left">
        <TaskTodayCard search={search} />
        <MentorsChart />
        <HeatmapCard />
      </div>
      <div className="col-center">
        <PomodoroCard />
        <StatsCard />
        <StreakGoalsCard />
      </div>
      <div className="col-right">
        <MyTaskCard search={search} />
        <WeeklyFocusCard />
        <CoursesCard />
      </div>
      <div className="col-bottom">
        <DeadlinesCard />
        <SessionHistoryCard />
        <QuickNotesCard />
      </div>
    </div>
  )
}

function AppLayout() {
  const { dark, toggle: toggleDark } = useDarkMode()
  const [search, setSearch] = useState('')

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header search={search} onSearch={setSearch} dark={dark} onToggleDark={toggleDark} />
        <div className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard search={search} />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/focus" element={<FocusTimerPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage dark={dark} onToggleDark={toggleDark} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
