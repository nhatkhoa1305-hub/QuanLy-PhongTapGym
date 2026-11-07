import {
  classStatus,
  memberName,
  packageName,
  registrationCount,
  subscriptionStatus,
  trainerName,
} from '../utils/gym.js'

function Badge({ children }) {
  const tone = ({
    'Hiệu lực': 'success', 'Đang hoạt động': 'success', 'Còn chỗ': 'success', 'Đã đăng ký': 'success',
    'Sắp hết hạn': 'warning', 'Sắp đầy': 'warning', 'Chưa bắt đầu': 'warning', 'Đã đầy': 'danger',
  })[children] || 'muted'
  return <span className={`badge ${tone}`}>{children}</span>
}

function Table({ headers, children, emptyMessage }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{hasRows ? children : <tr><td className="empty-cell" colSpan={headers.length}>{emptyMessage || 'Chưa có dữ liệu'}</td></tr>}</tbody>
      </table>
    </div>
  )
}

function Dashboard({ data, onAction }) {
  const activeMembers = data.members.filter((member) => member.active).length
  const activeSubscriptions = data.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item))).length
  const activeClasses = data.classes.filter((item) => item.active).length
  const activeRegistrations = data.registrations.filter((item) => item.status === 'Đã đăng ký').length
  const due = data.subscriptions.filter((item) => subscriptionStatus(item) === 'Sắp hết hạn')
  const popularClasses = data.classes.filter((item) => item.active).slice(0, 4)
  const stats = [
    ['Hội viên hoạt động', activeMembers, '👥', 'blue'],
    ['Gói còn hiệu lực', activeSubscriptions, '💳', 'green'],
    ['Lớp đang mở', activeClasses, '🏋️', 'orange'],
    ['Lượt đăng ký lớp', activeRegistrations, '✓', 'purple'],
  ]
  const quickLinks = [
    ['members', 'Hội viên', 'Hồ sơ và trạng thái'],
    ['subscriptions', 'Gói hội viên', 'Đăng ký, gia hạn, theo dõi'],
    ['classes', 'Lớp & lịch học', 'Lịch và sức chứa'],
    ['trainers', 'Huấn luyện viên', 'Hồ sơ và phân công'],
    ['registrations', 'Đăng ký lớp', 'Ghi danh và hủy lớp'],
    ['history', 'Lịch sử', 'Tra cứu hoạt động hội viên'],
    ['reports', 'Báo cáo', 'Số lượng và sức chứa'],
    ['users', 'Tài khoản', 'Vai trò và trạng thái'],
  ]

  return (
    <>
      <div className="page-heading">
        <div><p className="mini-label">Vận hành</p><h3>Tổng quan phòng tập</h3><p className="page-description">Theo dõi hội viên, lớp học và các hoạt động cần xử lý.</p></div>
      </div>
      <div className="stats-grid">
        {stats.map(([title, value, icon, tone]) => (
          <article className="stat-card" key={title}>
            <div className="stat-top"><p className="mini-label">{title}</p><div className={`stat-icon ${tone}`}>{icon}</div></div>
            <h3>{value}</h3><p>Dữ liệu hiện tại</p>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header"><div><p className="mini-label">Cần chú ý</p><h3>Gói sắp hết hạn</h3></div><button className="secondary-btn" type="button" onClick={() => onAction({ action: 'navigate', view: 'subscriptions' })}>Quản lý gói</button></div>
          <Table headers={['Hội viên', 'Gói', 'Hết hạn', 'Trạng thái']} emptyMessage="Không có gói sắp hết hạn.">
            {due.map((item) => <tr key={item.id}><td>{memberName(data, item.memberId)}</td><td>{packageName(data, item.packageId)}</td><td>{new Date(`${item.endDate}T00:00:00`).toLocaleDateString('vi-VN')}</td><td><Badge>{subscriptionStatus(item)}</Badge></td></tr>)}
          </Table>
        </section>
        <section className="panel">
          <div className="panel-header"><div><p className="mini-label">Lịch tập</p><h3>Lớp đang mở</h3></div><button className="secondary-btn" type="button" onClick={() => onAction({ action: 'navigate', view: 'classes' })}>Xem danh sách</button></div>
          <Table headers={['Lớp', 'Huấn luyện viên', 'Lịch', 'Sức chứa']}>
            {popularClasses.map((item) => <tr key={item.id}><td>{item.name}</td><td>{trainerName(data, item.trainerId)}</td><td>{item.day} · {item.start}</td><td>{registrationCount(data, item.id)}/{item.capacity} <Badge>{classStatus(data, item)}</Badge></td></tr>)}
          </Table>
        </section>
      </div>
      <section className="panel panel-wide">
        <div className="panel-header"><div><p className="mini-label">Truy cập nhanh</p><h3>Nghiệp vụ</h3></div></div>
        <div className="quick-links">
          {quickLinks.map(([view, title, description]) => (
            <button className="quick-link" key={view} type="button" onClick={() => onAction({ action: 'navigate', view })}>
              <strong>{title}</strong><span>{description}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

export default Dashboard