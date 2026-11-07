import { classStatus, filtered, getClass, getMember, registrationCount, trainerName } from '../utils/gym.js'

function DataTable({ headers, children, emptyMessage = 'Chưa có dữ liệu' }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>{emptyMessage}</td></tr>}</tbody></table></div>
}

function ClassesPage({ data, searchTerm, canManage, onAction, rosterClassId }) {
  if (rosterClassId) {
    const classItem = getClass(data, rosterClassId)
    const registrations = data.registrations.filter((item) => item.classId === rosterClassId && item.status === 'Đã đăng ký')
    return (
      <section className="panel">
        <div className="panel-header"><div><p className="mini-label">Danh sách lớp</p><h3>{classItem?.name || 'Lớp tập'}</h3></div><button className="secondary-btn" type="button" onClick={() => onAction({ action: 'back-to-classes' })}>Quay lại</button></div>
        <DataTable headers={['Hội viên', 'Điện thoại', 'Ngày đăng ký', 'Trạng thái']} emptyMessage="Lớp chưa có hội viên.">
          {registrations.map((item) => {
            const member = getMember(data, item.memberId)
            return <tr key={item.id}><td>{member?.name || ''}</td><td>{member?.phone || ''}</td><td>{new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN')}</td><td><span className="badge success">{item.status}</span></td></tr>
          })}
        </DataTable>
      </section>
    )
  }

  const records = filtered(data.classes, (item) => [item.id, item.name, trainerName(data, item.trainerId), item.day, item.start], searchTerm)
  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Classes</p><h3>Lớp tập & lịch học</h3><p className="page-description">Quản lý huấn luyện viên, lịch học và sức chứa. Lớp đang có người đăng ký không bị xóa cứng.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Tạo lớp</button>}</div>
      <section className="panel">
        <DataTable headers={['Mã lớp', 'Lớp', 'Huấn luyện viên', 'Lịch học', 'Đăng ký', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => {
            const status = classStatus(data, item)
            const tone = status === 'Còn chỗ' ? 'success' : status === 'Sắp đầy' ? 'warning' : status === 'Đã đầy' ? 'danger' : 'muted'
            return <tr key={item.id}><td>{item.id}</td><td><strong>{item.name}</strong></td><td>{trainerName(data, item.trainerId)}</td><td>{item.day} · {item.start}–{item.end}</td><td>{registrationCount(data, item.id)}/{item.capacity}</td><td><span className={`badge ${tone}`}>{status}</span></td><td className="actions-cell">{canManage && <button className="table-action" type="button" onClick={() => onAction({ action: 'edit', id: item.id })}>Sửa</button>}<button className="table-action" type="button" onClick={() => onAction({ action: 'class-roster', id: item.id })}>Học viên</button>{canManage && <button className={`table-action ${item.active ? 'danger' : ''}`} type="button" onClick={() => onAction({ action: 'toggle-class', id: item.id })}>{item.active ? 'Ngừng mở' : 'Mở lớp'}</button>}</td></tr>
          })}
        </DataTable>
      </section>
    </>
  )
}

export default ClassesPage