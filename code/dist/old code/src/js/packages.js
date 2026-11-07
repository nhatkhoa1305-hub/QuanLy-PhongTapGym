import { canManage, state } from './data.js';
import { actionButton, badge, escapeHtml, filtered, money, pageHeader, table } from './utils.js';

export function renderPackages(searchTerm) {
  const records = filtered(state.packages, (item) => [item.id, item.name, item.durationDays, item.price], searchTerm);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${money(item.price)}</td><td>${item.durationDays} ngày</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng áp dụng')}</td><td class="actions-cell">${canManage('packages') ? actionButton('edit', item.id, 'Sửa') : ''}${canManage('packages') ? actionButton('toggle-package', item.id, item.active ? 'Ngừng áp dụng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Master data', 'Danh mục gói dịch vụ', 'Quản lý giá, thời hạn và trạng thái gói. Gói đã phát sinh đăng ký chỉ có thể ngừng áp dụng.', canManage('packages') ? '<button class="primary-btn" data-action="create">+ Thêm gói</button>' : '')}<section class="panel">${table(['Mã gói', 'Tên gói', 'Giá', 'Thời hạn', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}
