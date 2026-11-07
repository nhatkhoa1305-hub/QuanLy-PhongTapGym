import { filtered, roleDescription } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function UsersPage({ data, searchTerm, role, canManage, onAction }) {
  const records = filtered(data.users, (item) => [item.id, item.username, item.name, item.role], searchTerm)
  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Security</p><h3>Tài khoản & phân quyền</h3><p className="page-description">Quản lý tài khoản demo và đổi vai trò hiện tại để xem phạm vi thao tác.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Tạo tài khoản</button>}</div>
      <section className="panel">
        <div className="role-note"><strong>Quyền của vai trò {role}:</strong> {roleDescription(role)}</div>
        <DataTable headers={['Tên đăng nhập', 'Họ tên', 'Vai trò', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => <tr key={item.id}><td>{item.username}</td><td>{item.name}</td><td>{item.role}</td><td><span className={`badge ${item.active ? 'success' : 'danger'}`}>{item.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td><td>{canManage && item.username !== 'admin' ? <button className={`table-action ${item.active ? 'danger' : ''}`} type="button" onClick={() => onAction({ action: 'toggle-user', id: item.id })}>{item.active ? 'Khóa' : 'Mở khóa'}</button> : '—'}</td></tr>)}
        </DataTable>
      </section>
      <p className="page-description">Đây là phân quyền phía giao diện trên dữ liệu demo. Cần backend xác thực để bảo vệ hệ thống thật.</p>
    </>
  )
}

export default UsersPage