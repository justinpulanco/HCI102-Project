import { COURSES } from '../types'
import './CoursesCard.css'

export default function CoursesCard() {
  return (
    <div className="card courses-card">
      <div className="card-header">
        <h2>My Courses</h2>
      </div>
      <div className="courses-list">
        {COURSES.map(course => {
          const pct = Math.min(100, Math.round((course.minutesSpent / course.goal) * 100))
          const hrs = (course.minutesSpent / 60).toFixed(1)
          return (
            <div key={course.id} className="course-item">
              <div className="course-chip" style={{ background: course.color + '22', color: course.color }}>
                <span className="course-dot" style={{ background: course.color }} />
                {course.name}
              </div>
              <div className="course-progress-wrap">
                <div className="course-progress-bar">
                  <div className="course-progress-fill" style={{ width: `${pct}%`, background: course.color }} />
                </div>
                <span className="course-time">{hrs}h</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
