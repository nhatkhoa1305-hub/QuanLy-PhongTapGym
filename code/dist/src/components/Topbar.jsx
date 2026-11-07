import { canManage, views } from '../utils/gym.js'

const creatableViews = ['members', 'packages', 'classes', 'trainers', 'users', 'subscriptions', 'registrations']

function Topbar({ currentView, searchTerm, onSearch, role, roles, onRoleChange, onCreate }) {
  const canCreate = creatableViews.includes(currentView) && canManage(currentView, role)

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">HỆ THỐNG QUẢN LÝ PHÒNG TẬP</p>
        <h2>{views[currentView]}</h2>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Tìm trong mục hiện tại"
            value={searchTerm}
            aria-label="Tìm kiếm"
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <label className="role-picker">
          <span>Vai trò</span>
          <select aria-label="Vai trò hiện tại" value={role} onChange={(event) => onRoleChange(event.target.value)}>
            {roles.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        {canCreate && (
          <button className="primary-btn" type="button" onClick={onCreate}>
            + Tạo mới
          </button>
        )}
      </div>
    </header>
  )
}

export default Topbar