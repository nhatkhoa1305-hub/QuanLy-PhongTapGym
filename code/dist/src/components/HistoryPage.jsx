import { dateText, filtered, getClass, memberName, packageName, subscriptionStatus } from '../utils/gym.js'

function DataTable({ headers, children }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children.length ? children : <tr><td className="empty-cell" colSpan={headers.length}>Chưa có lịch sử giao dịch.</td></tr>}</tbody></table></div>
}

function HistoryPage({ data, searchTerm, selectedMemberId, onSelectMember }) {
  const members = filtered(data.members, (member) => [member.id, member.name, member.phone], searchTerm)
  const selectedMember = selectedMemberId
    ? data.members.find((member) => member.id === selectedMemberId)
    : data.members.find((member) => member.id === searchTerm)
  const relevantMembers = selectedMember ? [selectedMember] : members
  const subscriptions = data.subscriptions
    .filter((item) => relevantMembers.some((member) => member.id === item.memberId))
    .map((item) => ({ at: item.startDate, type: 'Gói dịch vụ', detail: `${memberName(data, item.memberId)} đăng ký ${packageName(data, item.packageId)} (${dateText(item.startDate)} – ${dateText(item.endDate)})`, status: subscriptionStatus(item) }))
  const registrations = data.registrations
    .filter((item) => relevantMembers.some((member) => member.id === item.memberId))
    .map((item) => ({ at: item.date, type: 'Lớp tập', detail: `${memberName(data, item.memberId)} · ${getClass(data, item.classId)?.name || 'Lớp đã ngừng'}`, status: item.status }))
  const logs = data.logs
    .filter((item) => !selectedMember || item.detail.includes(selectedMember.name) || item.detail.includes(selectedMember.id))
    .map((item) => ({ at: item.at.slice(0, 10), type: item.action, detail: item.detail, status: 'Đã ghi nhận' }))
  const activity = [...subscriptions, ...registrations, ...logs].sort((first, second) => second.at.localeCompare(first.at))

  return (
    <>
      <div className="page-heading"><div><p className="mini-label">Tra cứu</p><h3>Lịch sử hội viên</h3><p className="page-description">Tra cứu lịch sử đăng ký gói và lớp theo mã, tên hoặc số điện thoại.</p></div></div>
      <section className="panel">
        <label className="filter-control"><span>Hội viên</span><select value={selectedMemberId} onChange={(event) => onSelectMember(event.target.value)}><option value="">Tất cả hội viên</option>{data.members.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.id}</option>)}</select></label>
        {selectedMember && <div className="member-summary"><strong>{selectedMember.name}</strong><span>{selectedMember.phone}</span><span className={`badge ${selectedMember.active ? 'success' : 'danger'}`}>{selectedMember.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></div>}
        <DataTable headers={['Ngày', 'Nghiệp vụ', 'Nội dung', 'Trạng thái']}>
          {activity.map((item, index) => <tr key={`${item.at}-${item.type}-${index}`}><td>{dateText(item.at)}</td><td>{item.type}</td><td>{item.detail}</td><td><span className="badge muted">{item.status}</span></td></tr>)}
        </DataTable>
      </section>
    </>
  )
}

export default HistoryPage