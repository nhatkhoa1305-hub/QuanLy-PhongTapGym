import { currentRole, state } from './data.js';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
export function money(value) { return `${Number(value || 0).toLocaleString('vi-VN')} đ`; }
export function dateText(value) { return value ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN') : '—'; }
export function generateId(prefix, records, key = 'id') {
  let suffix = records.length + 1;
  let id = `${prefix}${String(suffix).padStart(4, '0')}`;
  while (records.some((record) => record[key] === id)) id = `${prefix}${String(++suffix).padStart(4, '0')}`;
  return id;
}
export function filtered(records, values, searchTerm) {
  const term = searchTerm.trim().toLocaleLowerCase('vi');
  return term ? records.filter((record) => values(record).some((value) => String(value || '').toLocaleLowerCase('vi').includes(term))) : records;
}
export function notify(toastRegion, message, type = 'success') {
  toastRegion.innerHTML = `<div class="toast ${type}" role="status">${escapeHtml(message)}</div>`;
  window.setTimeout(() => toastRegion.replaceChildren(), 3200);
}
export function badge(label) {
  const tone = ({ 'Hiệu lực': 'success', 'Đang hoạt động': 'success', 'Còn chỗ': 'success', 'Đã đăng ký': 'success', 'Sắp hết hạn': 'warning', 'Sắp đầy': 'warning', 'Chưa bắt đầu': 'warning', 'Hết hạn': 'muted', 'Đã hủy': 'muted', 'Đã hủy lớp': 'muted', 'Ngừng mở': 'muted', 'Ngừng áp dụng': 'muted', 'Đã đầy': 'danger', 'Ngừng hoạt động': 'danger' })[label] || 'muted';
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}
export function actionButton(action, id, label, tone = 'plain', extra = '') { return `<button class="table-action ${tone}" data-action="${action}" data-id="${escapeHtml(id)}" ${extra}>${escapeHtml(label)}</button>`; }
export function table(headers, rows, emptyMessage = 'Chưa có dữ liệu') { return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td class="empty-cell" colspan="${headers.length}">${emptyMessage}</td></tr>`}</tbody></table></div>`; }
export function pageHeader(eyebrow, title, description, action = '') { return `<div class="page-heading"><div><p class="mini-label">${escapeHtml(eyebrow)}</p><h3>${escapeHtml(title)}</h3><p class="page-description">${escapeHtml(description)}</p></div>${action}</div>`; }
export function field(label, name, type, value = '', options = [], required = false, hint = '') {
  const requiredAttr = required ? 'required' : '';
  const hintHtml = hint ? `<small class="field-hint">${escapeHtml(hint)}</small>` : '';
  let control;
  if (type === 'select') control = `<select name="${name}" ${requiredAttr}>${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
  else if (type === 'textarea') control = `<textarea name="${name}" rows="3" ${requiredAttr}>${escapeHtml(value)}</textarea>`;
  else control = `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${requiredAttr} ${type === 'number' ? 'min="0"' : ''} />`;
  return `<label class="form-field"><span>${escapeHtml(label)}${required ? ' *' : ''}</span>${control}${hintHtml}</label>`;
}
export function optionsFrom(records, labelOf, valueOf = (item) => item.id) { return records.map((item) => ({ value: valueOf(item), label: labelOf(item) })); }
export function roleDescription(role) { return ({ 'Quản lý': 'Toàn quyền quản lý danh mục, tài khoản, lớp và báo cáo.', 'Lễ tân': 'Quản lý hội viên, đăng ký gói và đăng ký lớp.', 'Huấn luyện viên': 'Tra cứu lớp, lịch dạy và danh sách học viên.', 'Hội viên': 'Vai trò chỉ xem; không được thay đổi dữ liệu quản lý.' })[role]; }
export function isManager() { return currentRole.value === 'Quản lý'; }
export { state };
