import { currentSubscription, filtered, packageName } from '../utils/gym.js'

function Badge({ children }) {
  return <span className={`badge ${children === 'Đang hoạt động' ? 'success' : 'danger'}`}>{children}</span>
}

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function MembersPage({ data, searchTerm, canManage, onAction }) {
  const records = filtered(data.members, (item) => [item.id, item.name, item.phone, item.email], searchTerm)

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Master data</p><h3>Danh sách hội viên</h3><p className="page-description">Tạo, cập nhật và tra cứu hồ sơ hội viên theo mã, tên hoặc số điện thoại.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Thêm hội viên</button>}</div>
      <section className="panel">
        <DataTable headers={['Mã hội viên', 'Họ tên', 'Điện thoại', 'Gói hiện tại', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => {
            const subscription = currentSubscription(data, item.id)
            return (
              <tr key={item.id}>
                <td>{item.id}</td><td><strong>{item.name}</strong><small>{item.email || ''}</small></td><td>{item.phone}</td>
                <td>{subscription ? packageName(data, subscription.packageId) : 'Chưa có gói'}</td>
                <td><Badge>{item.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Badge></td>
                <td className="actions-cell">
                  {canManage && <button className="table-action" type="button" onClick={() => onAction({ action: 'edit', id: item.id })}>Sửa</button>}
                  <button className="table-action" type="button" onClick={() => onAction({ action: 'member-history', id: item.id })}>Lịch sử</button>
                  {canManage && <button className={`table-action ${item.active ? 'danger' : ''}`} type="button" onClick={() => onAction({ action: 'toggle-member', id: item.id })}>{item.active ? 'Ngừng' : 'Kích hoạt'}</button>}
                </td>
              </tr>
            )
          })}
        </DataTable>
      </section>
    </>
  )
}

export default MembersPage