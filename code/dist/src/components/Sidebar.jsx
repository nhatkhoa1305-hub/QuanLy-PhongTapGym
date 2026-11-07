import { views } from '../utils/gym.js'

function Sidebar({ currentView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-logo">G</div>
        <div>
          <p className="brand-label">GYM</p>
          <h1>CoreFit</h1>
        </div>
      </div>

      <nav className="nav-menu" aria-label="Điều hướng chính">
        {Object.entries(views).map(([view, label]) => (
          <button
            className={`nav-item${currentView === view ? ' active' : ''}`}
            key={view}
            type="button"
            aria-current={currentView === view ? 'page' : undefined}
            onClick={() => onNavigate(view)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-card">
        <p className="mini-label">Trạng thái hệ thống</p>
        <div className="status-row">
          <span className="status-dot online" />
          <span>Online</span>
        </div>
        <small>Hệ thống hoạt động ổn định</small>
      </div>
    </aside>
  )
}

export default Sidebar