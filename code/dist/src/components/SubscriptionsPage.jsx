import { dateText, filtered, memberName, packageName, subscriptionStatus } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có dữ liệu</td></tr>}</tbody></table></div>
}

function SubscriptionsPage({ data, searchTerm, canManage, onAction }) {
  const records = filtered(data.subscriptions, (item) => [item.id, memberName(data, item.memberId), packageName(data, item.packageId), subscriptionStatus(item)], searchTerm)

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Membership</p><h3>Đăng ký & theo dõi gói</h3><p className="page-description">Ghi nhận đăng ký, gia hạn và theo dõi ngày hết hạn của hội viên.</p></div>{canManage && <button className="primary-btn" type="button" onClick={() => onAction({ action: 'create' })}>+ Đăng ký gói</button>}</div>
      <section className="panel">
        <DataTable headers={['Mã đăng ký', 'Hội viên', 'Gói', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Thao tác']}>
          {records.map((item) => {
            const status = subscriptionStatus(item)
            const tone = status === 'Hiệu lực' ? 'success' : status === 'Sắp hết hạn' || status === 'Chưa bắt đầu' ? 'warning' : 'muted'
            return <tr key={item.id}><td>{item.id}</td><td>{memberName(data, item.memberId)}</td><td>{packageName(data, item.packageId)}</td><td>{dateText(item.startDate)}</td><td>{dateText(item.endDate)}</td><td><span className={`badge ${tone}`}>{status}</span></td><td>{canManage && !item.cancelled && <button className="table-action" type="button" onClick={() => onAction({ action: 'renew', id: item.memberId })}>Gia hạn</button>}</td></tr>
          })}
        </DataTable>
      </section>
    </>
  )
}

export default SubscriptionsPage