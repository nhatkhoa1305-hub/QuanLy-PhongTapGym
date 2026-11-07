import { canManage, classStatus, getClass, getMember, getTrainer, registrationCount, state, trainerName } from './data.js';
import { actionButton, badge, escapeHtml, filtered, pageHeader, table } from './utils.js';

export function renderClasses(searchTerm) {
  const records = filtered(state.classes, (item) => [item.id, item.name, trainerName(item.trainerId), item.day, item.start], searchTerm);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(trainerName(item.trainerId))}</td><td>${escapeHtml(item.day)} · ${escapeHtml(item.start)}–${escapeHtml(item.end)}</td><td>${registrationCount(item.id)}/${item.capacity}</td><td>${badge(classStatus(item))}</td><td class="actions-cell">${canManage('classes') ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('class-roster', item.id, 'Học viên')}${canManage('classes') ? actionButton('toggle-class', item.id, item.active ? 'Ngừng mở' : 'Mở lớp', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Classes', 'Lớp tập & lịch học', 'Quản lý huấn luyện viên, lịch học và sức chứa. Lớp đang có người đăng ký không bị xóa cứng.', canManage('classes') ? '<button class="primary-btn" data-action="create">+ Tạo lớp</button>' : '')}<section class="panel">${table(['Mã lớp', 'Lớp', 'Huấn luyện viên', 'Lịch học', 'Đăng ký', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}
export function renderTrainers(searchTerm) {
  const records = filtered(state.trainers, (item) => [item.id, item.name, item.specialty, item.phone], searchTerm);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.specialty)}</td><td>${escapeHtml(item.phone)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td class="actions-cell">${canManage('trainers') ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('trainer-schedule', item.id, 'Lịch dạy')}${canManage('trainers') ? actionButton('toggle-trainer', item.id, item.active ? 'Ngừng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Team', 'Huấn luyện viên', 'Quản lý hồ sơ chuyên môn và theo dõi lịch phân công.', canManage('trainers') ? '<button class="primary-btn" data-action="create">+ Thêm HLV</button>' : '')}<section class="panel">${table(['Mã HLV', 'Họ tên', 'Chuyên môn', 'Điện thoại', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}
export function renderClassRoster(classId) {
  const classItem = getClass(classId);
  const rows = state.registrations.filter((item) => item.classId === classId && item.status === 'Đã đăng ký').map((item) => `<tr><td>${escapeHtml(getMember(item.memberId)?.name || '')}</td><td>${escapeHtml(getMember(item.memberId)?.phone || '')}</td><td>${new Date(`${item.date}T00:00:00`).toLocaleDateString('vi-VN')}</td><td>${badge(item.status)}</td></tr>`).join('');
  return `<section class="panel"><div class="panel-header"><div><p class="mini-label">Danh sách lớp</p><h3>${escapeHtml(classItem?.name || 'Lớp tập')}</h3></div><button class="secondary-btn" data-action="navigate" data-view="classes">Quay lại</button></div>${table(['Hội viên', 'Điện thoại', 'Ngày đăng ký', 'Trạng thái'], rows, 'Lớp chưa có hội viên.')}</section>`;
}
