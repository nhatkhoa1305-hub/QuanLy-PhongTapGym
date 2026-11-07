import { classStatus, dateText, filtered, getClass, memberName, registrationCount } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function RegistrationsPage({ data, searchTerm, canManage, onAction }) {
  const activeMembers = data.members.filter((member) => member.active)
  const activeClasses = data.classes.filter((item) => item.active)
  const records = filtered(data.registrations, (item) => [item.id, memberName(data, item.memberId), getClass(data, item.classId)?.name, item.status], searchTerm)

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Registration</p><h3>Đăng ký lớp tập</h3><p className="page-description">Chỉ hội viên có gói hiệu lực được ghi danh. Hệ thống tự kiểm tra trùng đăng ký và sức chứa.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Đăng ký lớp</button>}</div>
      <section className="panel capacity-overview">
        <h3>Tình trạng lớp</h3>
        <div className="capacity-grid">
          {activeClasses.map((item) => {
            const status = classStatus(data, item)
            const tone = status === 'Còn chỗ' ? 'success' : status === 'Sắp đầy' ? 'warning' : 'danger'
            return <article className="capacity-item" key={item.id}><div><strong>{item.name}</strong><span className={`badge ${tone}`}>{status}</span></div><p>{registrationCount(data, item.id)} / {item.capacity} chỗ · {item.day} {item.start}</p></article>
          })}
        </div>
      </section>
      <section className="panel">
        <DataTable headers={['Mã đăng ký', 'Hội viên', 'Lớp', 'Ngày đăng ký', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => <tr key={item.id}><td>{item.id}</td><td>{memberName(data, item.memberId)}</td><td>{getClass(data, item.classId)?.name || 'Lớp đã ngừng'}</td><td>{dateText(item.date)}</td><td><span className={`badge ${item.status === 'Đã đăng ký' ? 'success' : 'muted'}`}>{item.status}</span></td><td className="actions-cell">{item.status === 'Đã đăng ký' && canManage && <><button className="table-action" type="button" onClick={() => onAction({ action: 'change-registration', id: item.id })}>Đổi lớp</button><button className="table-action danger" type="button" onClick={() => onAction({ action: 'cancel-registration', id: item.id })}>Hủy</button></>}</td></tr>)}
        </DataTable>
      </section>
      <p className="page-description">{activeMembers.length} hội viên đang hoạt động · {activeClasses.length} lớp đang mở</p>
    </>
  )
}

export default RegistrationsPage