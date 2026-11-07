import { classStatus, money, registrationCount, subscriptionStatus } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function ReportsPage({ data, onAction }) {
  const activeSubscriptions = data.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)))
  const stats = [
    ['Tổng hội viên', data.members.filter((item) => item.active).length, 'blue'],
    ['Gói hiệu lực', activeSubscriptions.length, 'green'],
    ['Tổng lượt đăng ký lớp', data.registrations.filter((item) => item.status === 'Đã đăng ký').length, 'orange'],
    ['Lớp đã đầy', data.classes.filter((item) => classStatus(data, item) === 'Đã đầy').length, 'purple'],
  ]

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Analytics</p><h3>Báo cáo vận hành</h3><p className="page-description">Thống kê số hội viên theo gói và sức chứa thực tế của từng lớp.</p></div><button className="secondary-btn" type="button" onClick={() => onAction({ action: 'export-report' })}>Tải CSV</button></div>
      <div className="stats-grid">{stats.map(([label, value, tone]) => <article className="stat-card" key={label}><p className="mini-label">{label}</p><h3>{value}</h3><div className={`report-meter ${tone}`}><span style={{ width: `${Math.min(Number(value) * 10, 100)}%` }} /></div></article>)}</div>
      <div className="dashboard-grid">
        <section className="panel"><div className="panel-header"><div><p className="mini-label">US11</p><h3>Hội viên theo gói</h3></div></div><DataTable headers={['Gói dịch vụ', 'Hội viên hiệu lực', 'Giá tham khảo', 'Trạng thái']}>{data.packages.map((item) => <tr key={item.id}><td>{item.name}</td><td>{activeSubscriptions.filter((subscription) => subscription.packageId === item.id).length}</td><td>{money(item.price)}</td><td><span className={`badge ${item.active ? 'success' : 'muted'}`}>{item.active ? 'Đang hoạt động' : 'Ngừng áp dụng'}</span></td></tr>)}</DataTable></section>
        <section className="panel"><div className="panel-header"><div><p className="mini-label">US12</p><h3>Sức chứa lớp</h3></div></div><DataTable headers={['Lớp', 'Đã đăng ký', 'Sức chứa', 'Còn chỗ', 'Trạng thái']}>{data.classes.map((item) => <tr key={item.id}><td>{item.name}</td><td>{registrationCount(data, item.id)}</td><td>{item.capacity}</td><td>{Math.max(item.capacity - registrationCount(data, item.id), 0)}</td><td><span className="badge muted">{classStatus(data, item)}</span></td></tr>)}</DataTable></section>
      </div>
    </>
  )
}

export default ReportsPage