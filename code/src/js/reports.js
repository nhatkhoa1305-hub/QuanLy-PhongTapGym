import { classStatus, registrationCount, state, subscriptionStatus } from './data.js';
import { badge, escapeHtml, money, pageHeader, table } from './utils.js';

export function renderReports() {
  const activeSubscriptions = state.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)));
  const packageRows = state.packages.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${activeSubscriptions.filter((subscription) => subscription.packageId === item.id).length}</td><td>${money(item.price)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng áp dụng')}</td></tr>`).join('');
  const classRows = state.classes.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${registrationCount(item.id)}</td><td>${item.capacity}</td><td>${Math.max(item.capacity - registrationCount(item.id), 0)}</td><td>${badge(classStatus(item))}</td></tr>`).join('');
  return `${pageHeader('Analytics', 'Báo cáo vận hành', 'Thống kê số hội viên theo gói và sức chứa thực tế của từng lớp.', '<button class="secondary-btn" data-action="export-report">Tải CSV</button>')}<div class="stats-grid">${[['Tổng hội viên', state.members.filter((item) => item.active).length, 'blue'], ['Gói hiệu lực', activeSubscriptions.length, 'green'], ['Tổng lượt đăng ký lớp', state.registrations.filter((item) => item.status === 'Đã đăng ký').length, 'orange'], ['Lớp đã đầy', state.classes.filter((item) => classStatus(item) === 'Đã đầy').length, 'purple']].map(([label, value, tone]) => `<article class="stat-card"><p class="mini-label">${label}</p><h3>${value}</h3><div class="report-meter ${tone}"><span style="width:${Math.min(Number(value) * 10, 100)}%"></span></div></article>`).join('')}</div><div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><p class="mini-label">US11</p><h3>Hội viên theo gói</h3></div></div>${table(['Gói dịch vụ', 'Hội viên hiệu lực', 'Giá tham khảo', 'Trạng thái'], packageRows)}</section><section class="panel"><div class="panel-header"><div><p class="mini-label">US12</p><h3>Sức chứa lớp</h3></div></div>${table(['Lớp', 'Đã đăng ký', 'Sức chứa', 'Còn chỗ', 'Trạng thái'], classRows)}</section></div>`;
}
export function exportReport() {
  const rows = [['Loại', 'Tên', 'Số lượng', 'Sức chứa', 'Còn chỗ']];
  state.packages.forEach((item) => rows.push(['Gói', item.name, state.subscriptions.filter((sub) => sub.packageId === item.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(sub))).length, '', '']));
  state.classes.forEach((item) => rows.push(['Lớp', item.name, registrationCount(item.id), item.capacity, Math.max(item.capacity - registrationCount(item.id), 0)]));
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')}`;
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); link.download = 'corefit-bao-cao.csv'; link.click(); URL.revokeObjectURL(link.href);
}
