import { canManage, memberName, packageName, state, subscriptionStatus } from './data.js';
import { actionButton, badge, escapeHtml, filtered, pageHeader, table } from './utils.js';

export function renderSubscriptions(searchTerm) {
  const records = filtered(state.subscriptions, (item) => [item.id, memberName(item.memberId), packageName(item.packageId), subscriptionStatus(item)], searchTerm);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(packageName(item.packageId))}</td><td>${new Date(`${item.startDate}T00:00:00`).toLocaleDateString('vi-VN')}</td><td>${new Date(`${item.endDate}T00:00:00`).toLocaleDateString('vi-VN')}</td><td>${badge(subscriptionStatus(item))}</td><td>${canManage('subscriptions') && !item.cancelled ? actionButton('renew', item.memberId, 'Gia hạn') : ''}</td></tr>`).join('');
  return `${pageHeader('Membership', 'Đăng ký & theo dõi gói', 'Ghi nhận đăng ký, gia hạn và theo dõi ngày hết hạn của hội viên.', canManage('subscriptions') ? '<button class="primary-btn" data-action="create">+ Đăng ký gói</button>' : '')}<section class="panel">${table(['Mã đăng ký', 'Hội viên', 'Gói', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}
