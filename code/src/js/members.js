import { canManage, currentSubscription, memberName, packageName, state } from './data.js';
import { actionButton, badge, escapeHtml, filtered, pageHeader, table } from './utils.js';

export function renderMembers(searchTerm) {
  const records = filtered(state.members, (item) => [item.id, item.name, item.phone, item.email], searchTerm);
  const rows = records.map((item) => {
    const subscription = currentSubscription(item.id);
    return `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email || '')}</small></td><td>${escapeHtml(item.phone)}</td><td>${subscription ? escapeHtml(packageName(subscription.packageId)) : 'Chưa có gói'}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td class="actions-cell">${canManage('members') ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('member-history', item.id, 'Lịch sử')}${canManage('members') ? actionButton('toggle-member', item.id, item.active ? 'Ngừng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`;
  }).join('');
  return `${pageHeader('Master data', 'Danh sách hội viên', 'Tạo, cập nhật và tra cứu hồ sơ hội viên theo mã, tên hoặc số điện thoại.', canManage('members') ? '<button class="primary-btn" data-action="create">+ Thêm hội viên</button>' : '')}<section class="panel">${table(['Mã hội viên', 'Họ tên', 'Điện thoại', 'Gói hiện tại', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

export function renderHistory(memberFilter, searchTerm, helpers) {
  const selectedMember = memberFilter || searchTerm;
  const members = filtered(state.members, (member) => [member.id, member.name, member.phone], searchTerm);
  const selected = selectedMember ? state.members.find((member) => member.id === selectedMember) : null;
  const relevantMembers = selected ? [selected] : members;
  const subscriptions = state.subscriptions.filter((item) => relevantMembers.some((member) => member.id === item.memberId)).map((item) => ({ at: item.startDate, type: 'Gói dịch vụ', detail: `${memberName(item.memberId)} đăng ký ${packageName(item.packageId)} (${helpers.dateText(item.startDate)} – ${helpers.dateText(item.endDate)})`, status: helpers.subscriptionStatus(item) }));
  const registrations = state.registrations.filter((item) => relevantMembers.some((member) => member.id === item.memberId)).map((item) => ({ at: item.date, type: 'Lớp tập', detail: `${memberName(item.memberId)} · ${helpers.getClass(item.classId)?.name || 'Lớp đã ngừng'}`, status: item.status }));
  const activity = state.logs.filter((item) => !selected || item.detail.includes(selected.name) || item.detail.includes(selected.id)).map((item) => ({ at: item.at.slice(0, 10), type: item.action, detail: item.detail, status: 'Đã ghi nhận' }));
  const rows = [...subscriptions, ...registrations, ...activity].sort((a, b) => b.at.localeCompare(a.at)).map((item) => `<tr><td>${helpers.dateText(item.at)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.detail)}</td><td>${badge(item.status)}</td></tr>`).join('');
  return `${pageHeader('Tra cứu', 'Lịch sử hội viên', 'Tra cứu lịch sử đăng ký gói và lớp theo mã, tên hoặc số điện thoại.')}<section class="panel"><label class="filter-control"><span>Hội viên</span><select id="historyMember"><option value="">Tất cả hội viên</option>${state.members.map((member) => `<option value="${escapeHtml(member.id)}" ${memberFilter === member.id ? 'selected' : ''}>${escapeHtml(member.name)} · ${escapeHtml(member.id)}</option>`).join('')}</select></label>${selected ? `<div class="member-summary"><strong>${escapeHtml(selected.name)}</strong><span>${escapeHtml(selected.phone)}</span>${badge(selected.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</div>` : ''}${table(['Ngày', 'Nghiệp vụ', 'Nội dung', 'Trạng thái'], rows, 'Chưa có lịch sử giao dịch.')}</section>`;
}
