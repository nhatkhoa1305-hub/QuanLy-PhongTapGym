import { filtered } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function TrainersPage({ data, searchTerm, canManage, onAction }) {
  const records = filtered(data.trainers, (item) => [item.id, item.name, item.specialty, item.phone], searchTerm)
  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Team</p><h3>Huấn luyện viên</h3><p className="page-description">Quản lý hồ sơ chuyên môn và theo dõi lịch phân công.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Thêm HLV</button>}</div>
      <section className="panel">
        <DataTable headers={['Mã HLV', 'Họ tên', 'Chuyên môn', 'Điện thoại', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => <tr key={item.id}><td>{item.id}</td><td><strong>{item.name}</strong></td><td>{item.specialty}</td><td>{item.phone}</td><td><span className={`badge ${item.active ? 'success' : 'danger'}`}>{item.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td><td className="actions-cell">{canManage && <button className="table-action" type="button" onClick={() => onAction({ action: 'edit', id: item.id })}>Sửa</button>}<button className="table-action" type="button" onClick={() => onAction({ action: 'trainer-schedule', id: item.id })}>Lịch dạy</button>{canManage && <button className={`table-action ${item.active ? 'danger' : ''}`} type="button" onClick={() => onAction({ action: 'toggle-trainer', id: item.id })}>{item.active ? 'Ngừng' : 'Kích hoạt'}</button>}</td></tr>)}
        </DataTable>
      </section>
    </>
  )
}

export default TrainersPage