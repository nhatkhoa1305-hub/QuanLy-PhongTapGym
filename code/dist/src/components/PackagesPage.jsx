import { filtered, money } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function PackagesPage({ data, searchTerm, canManage, onAction }) {
  const records = filtered(data.packages, (item) => [item.id, item.name, item.durationDays, item.price], searchTerm)

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Master data</p><h3>Danh mục gói dịch vụ</h3><p className="page-description">Quản lý giá, thời hạn và trạng thái gói. Gói đã phát sinh đăng ký chỉ có thể ngừng áp dụng.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Thêm gói</button>}</div>
      <section className="panel">
        <DataTable headers={['Mã gói', 'Tên gói', 'Giá', 'Thời hạn', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td><td><strong>{item.name}</strong></td><td>{money(item.price)}</td><td>{item.durationDays} ngày</td>
              <td><span className={`badge ${item.active ? 'success' : 'muted'}`}>{item.active ? 'Đang hoạt động' : 'Ngừng áp dụng'}</span></td>
              <td className="actions-cell">{canManage && <><button className="table-action" type="button" onClick={() => onAction({ action: 'edit', id: item.id })}>Sửa</button><button className={`table-action ${item.active ? 'danger' : ''}`} type="button" onClick={() => onAction({ action: 'toggle-package', id: item.id })}>{item.active ? 'Ngừng áp dụng' : 'Kích hoạt'}</button></>}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </>
  )
}

export default PackagesPage