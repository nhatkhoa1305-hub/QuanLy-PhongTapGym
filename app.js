const STORAGE_KEY = 'corefit-gym-v1';
const localNow = new Date();
const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
const initialState = {
  members: [
    { id: 'HV0001', name: 'Nguyễn Minh Anh', phone: '0912345678', email: 'minhanh@example.com', active: true },
    { id: 'HV0002', name: 'Trần Quốc Bảo', phone: '0987654321', email: 'quocbao@example.com', active: true },
    { id: 'HV0003', name: 'Lê Thu Hà', phone: '0905123456', email: 'thuha@example.com', active: true },
    { id: 'HV0004', name: 'Phạm Hoàng Nam', phone: '0938123456', email: 'hoangnam@example.com', active: false }
  ],
  packages: [
    { id: 'GOI01', name: 'Premium 12 tháng', price: 7900000, durationDays: 365, active: true },
    { id: 'GOI02', name: 'Gold 6 tháng', price: 4200000, durationDays: 180, active: true },
    { id: 'GOI03', name: 'Basic 1 tháng', price: 850000, durationDays: 30, active: true }
  ],
  trainers: [
    { id: 'HLV01', name: 'Nguyễn Lan Anh', specialty: 'Yoga', phone: '0909000001', active: true },
    { id: 'HLV02', name: 'Trần Minh', specialty: 'HIIT, Cardio', phone: '0909000002', active: true },
    { id: 'HLV03', name: 'Lê Hoàng Hùng', specialty: 'Boxing', phone: '0909000003', active: true }
  ],
  classes: [
    { id: 'LOP01', name: 'Yoga buổi tối', trainerId: 'HLV01', day: 'Thứ 2', start: '18:00', end: '19:00', capacity: 20, active: true },
    { id: 'LOP02', name: 'HIIT Burn', trainerId: 'HLV02', day: 'Thứ 4', start: '19:30', end: '20:30', capacity: 15, active: true },
    { id: 'LOP03', name: 'Boxing cơ bản', trainerId: 'HLV03', day: 'Thứ 6', start: '18:30', end: '19:30', capacity: 20, active: true }
  ],
  subscriptions: [],
  registrations: [],
  users: [
    { id: 'USR01', username: 'admin', name: 'Quản lý CoreFit', role: 'Quản lý', active: true },
    { id: 'USR02', username: 'le.tan', name: 'Nhân viên lễ tân', role: 'Lễ tân', active: true },
    { id: 'USR03', username: 'huan.luyen', name: 'Huấn luyện viên', role: 'Huấn luyện viên', active: true }
  ],
  logs: []
};

const views = {
  dashboard: 'Tổng quan',
  members: 'Hội viên',
  packages: 'Gói dịch vụ',
  subscriptions: 'Đăng ký & gia hạn gói',
  classes: 'Lớp tập & lịch học',
  trainers: 'Huấn luyện viên',
  registrations: 'Đăng ký lớp',
  history: 'Lịch sử hội viên',
  reports: 'Báo cáo',
  users: 'Tài khoản & phân quyền'
};

const state = loadState();
let currentView = 'dashboard';
let currentRole = localStorage.getItem('corefit-role') || 'Quản lý';
let searchTerm = '';
let searchTimer;

const appView = document.getElementById('appView');
const topbar = document.getElementById('topbar');
const toastRegion = document.getElementById('toastRegion');
const dialog = document.createElement('dialog');
dialog.className = 'form-dialog';
dialog.id = 'formDialog';
document.body.append(dialog);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...structuredClone(initialState), ...saved } : structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function money(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`;
}

function dateText(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN');
}

function dateOffset(start, days) {
  const date = new Date(`${start}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(days));
  return date.toISOString().slice(0, 10);
}

function generateId(prefix, records, key = 'id') {
  let suffix = records.length + 1;
  let id = `${prefix}${String(suffix).padStart(4, '0')}`;
  while (records.some((record) => record[key] === id)) {
    suffix += 1;
    id = `${prefix}${String(suffix).padStart(4, '0')}`;
  }
  return id;
}

function logActivity(action, detail) {
  state.logs.unshift({ id: crypto.randomUUID(), action, detail, at: new Date().toISOString() });
  state.logs = state.logs.slice(0, 300);
}

function notify(message, type = 'success') {
  toastRegion.innerHTML = `<div class="toast ${type}" role="status">${escapeHtml(message)}</div>`;
  window.setTimeout(() => { toastRegion.replaceChildren(); }, 3200);
}

function subscriptionStatus(subscription) {
  if (subscription.cancelled) return 'Đã hủy';
  if (subscription.startDate > today) return 'Chưa bắt đầu';
  if (subscription.endDate < today) return 'Hết hạn';
  const remaining = Math.ceil((Date.parse(`${subscription.endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  return remaining <= 7 ? 'Sắp hết hạn' : 'Hiệu lực';
}

function currentSubscription(memberId) {
  return state.subscriptions.find((subscription) => subscription.memberId === memberId && subscriptionStatus(subscription) === 'Hiệu lực')
    || state.subscriptions.find((subscription) => subscription.memberId === memberId && subscriptionStatus(subscription) === 'Sắp hết hạn');
}

function getMember(id) { return state.members.find((member) => member.id === id); }
function getPackage(id) { return state.packages.find((item) => item.id === id); }
function getTrainer(id) { return state.trainers.find((trainer) => trainer.id === id); }
function getClass(id) { return state.classes.find((item) => item.id === id); }
function memberName(id) { return getMember(id)?.name || 'Hội viên không tồn tại'; }
function trainerName(id) { return getTrainer(id)?.name || 'Chưa phân công'; }
function packageName(id) { return getPackage(id)?.name || 'Gói đã ngừng'; }

function registrationCount(classId) {
  return state.registrations.filter((item) => item.classId === classId && item.status === 'Đã đăng ký').length;
}

function classStatus(item) {
  const count = registrationCount(item.id);
  if (!item.active) return 'Ngừng mở';
  if (count >= item.capacity) return 'Đã đầy';
  if (count / item.capacity >= 0.8) return 'Sắp đầy';
  return 'Còn chỗ';
}

function canManage(section = currentView) {
  if (currentRole === 'Quản lý') return true;
  if (currentRole === 'Lễ tân') return ['members', 'subscriptions', 'registrations', 'history'].includes(section);
  return false;
}

function badge(label) {
  const tone = ({
    'Hiệu lực': 'success', 'Đang hoạt động': 'success', 'Còn chỗ': 'success', 'Đã đăng ký': 'success',
    'Sắp hết hạn': 'warning', 'Sắp đầy': 'warning', 'Chưa bắt đầu': 'warning',
    'Hết hạn': 'muted', 'Đã hủy': 'muted', 'Đã hủy lớp': 'muted', 'Ngừng mở': 'muted', 'Ngừng áp dụng': 'muted',
    'Đã đầy': 'danger', 'Ngừng hoạt động': 'danger'
  })[label] || 'muted';
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}

function actionButton(action, id, label, tone = 'plain', extra = '') {
  return `<button class="table-action ${tone}" data-action="${action}" data-id="${escapeHtml(id)}" ${extra}>${escapeHtml(label)}</button>`;
}

function table(headers, rows, emptyMessage = 'Chưa có dữ liệu') {
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td class="empty-cell" colspan="${headers.length}">${emptyMessage}</td></tr>`}</tbody></table></div>`;
}

function pageHeader(eyebrow, title, description, action = '') {
  return `<div class="page-heading"><div><p class="mini-label">${escapeHtml(eyebrow)}</p><h3>${escapeHtml(title)}</h3><p class="page-description">${escapeHtml(description)}</p></div>${action}</div>`;
}

function renderTopbar() {
  topbar.innerHTML = `
    <div><p class="eyebrow">HỆ THỐNG QUẢN LÝ PHÒNG TẬP</p><h2>${escapeHtml(views[currentView])}</h2></div>
    <div class="topbar-actions">
      <label class="search-box"><span aria-hidden="true">⌕</span><input id="globalSearch" type="search" placeholder="Tìm trong mục hiện tại" value="${escapeHtml(searchTerm)}" aria-label="Tìm kiếm" /></label>
      <label class="role-picker"><span>Vai trò</span><select id="roleSelect" aria-label="Vai trò hiện tại">${['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên'].map((role) => `<option ${role === currentRole ? 'selected' : ''}>${role}</option>`).join('')}</select></label>
      <button class="primary-btn" data-action="create">+ Tạo mới</button>
    </div>`;
  topbar.querySelector('[data-action="create"]').hidden = !['members', 'packages', 'classes', 'trainers', 'users'].includes(currentView) || !canManage();
}

function renderStats() {
  const activeMembers = state.members.filter((member) => member.active).length;
  const activeSubscriptions = state.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item))).length;
  const activeClasses = state.classes.filter((item) => item.active).length;
  const activeRegistrations = state.registrations.filter((item) => item.status === 'Đã đăng ký').length;
  return [
    { title: 'Hội viên hoạt động', value: activeMembers, icon: '👥', tone: 'blue' },
    { title: 'Gói còn hiệu lực', value: activeSubscriptions, icon: '💳', tone: 'green' },
    { title: 'Lớp đang mở', value: activeClasses, icon: '🏋️', tone: 'orange' },
    { title: 'Lượt đăng ký lớp', value: activeRegistrations, icon: '✓', tone: 'purple' }
  ].map((item) => `<article class="stat-card"><div class="stat-top"><p class="mini-label">${item.title}</p><div class="stat-icon ${item.tone}">${item.icon}</div></div><h3>${item.value}</h3><p>Dữ liệu hiện tại</p></article>`).join('');
}

function renderDashboard() {
  const due = state.subscriptions.filter((item) => subscriptionStatus(item) === 'Sắp hết hạn');
  const popularClasses = state.classes.filter((item) => item.active).slice(0, 4);
  return `${pageHeader('Vận hành', 'Tổng quan phòng tập', 'Theo dõi hội viên, lớp học và các hoạt động cần xử lý.')}
    <div class="stats-grid">${renderStats()}</div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><div><p class="mini-label">Cần chú ý</p><h3>Gói sắp hết hạn</h3></div><button class="secondary-btn" data-action="navigate" data-view="subscriptions">Quản lý gói</button></div>
        ${table(['Hội viên', 'Gói', 'Hết hạn', 'Trạng thái'], due.map((item) => `<tr><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(packageName(item.packageId))}</td><td>${dateText(item.endDate)}</td><td>${badge(subscriptionStatus(item))}</td></tr>`).join(''), 'Không có gói sắp hết hạn.')}</section>
      <section class="panel"><div class="panel-header"><div><p class="mini-label">Lịch tập</p><h3>Lớp đang mở</h3></div><button class="secondary-btn" data-action="navigate" data-view="classes">Xem danh sách</button></div>
        ${table(['Lớp', 'Huấn luyện viên', 'Lịch', 'Sức chứa'], popularClasses.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(trainerName(item.trainerId))}</td><td>${escapeHtml(item.day)} · ${escapeHtml(item.start)}</td><td>${registrationCount(item.id)}/${item.capacity} ${badge(classStatus(item))}</td></tr>`).join(''))}</section>
    </div>
    <section class="panel panel-wide"><div class="panel-header"><div><p class="mini-label">Truy cập nhanh</p><h3>Nghiệp vụ</h3></div></div><div class="quick-links">${[
      ['members', 'Hội viên', 'Hồ sơ và trạng thái'], ['subscriptions', 'Gói hội viên', 'Đăng ký, gia hạn, theo dõi'], ['classes', 'Lớp & lịch học', 'Lịch và sức chứa'], ['trainers', 'Huấn luyện viên', 'Hồ sơ và phân công'], ['registrations', 'Đăng ký lớp', 'Ghi danh và hủy lớp'], ['history', 'Lịch sử', 'Tra cứu hoạt động hội viên'], ['reports', 'Báo cáo', 'Số lượng và sức chứa'], ['users', 'Tài khoản', 'Vai trò và trạng thái']
    ].map(([view, title, description]) => `<button class="quick-link" data-action="navigate" data-view="${view}"><strong>${title}</strong><span>${description}</span></button>`).join('')}</div></section>`;
}

function filtered(records, values) {
  const term = searchTerm.trim().toLocaleLowerCase('vi');
  if (!term) return records;
  return records.filter((record) => values(record).some((value) => String(value || '').toLocaleLowerCase('vi').includes(term)));
}

function renderMembers() {
  const records = filtered(state.members, (item) => [item.id, item.name, item.phone, item.email]);
  const rows = records.map((item) => {
    const subscription = currentSubscription(item.id);
    return `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email || '')}</small></td><td>${escapeHtml(item.phone)}</td><td>${subscription ? escapeHtml(packageName(subscription.packageId)) : 'Chưa có gói'}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td class="actions-cell">${canManage() ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('member-history', item.id, 'Lịch sử')}${canManage() ? actionButton('toggle-member', item.id, item.active ? 'Ngừng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`;
  }).join('');
  return `${pageHeader('Master data', 'Danh sách hội viên', 'Tạo, cập nhật và tra cứu hồ sơ hội viên theo mã, tên hoặc số điện thoại.', canManage() ? '<button class="primary-btn" data-action="create">+ Thêm hội viên</button>' : '')}
    <section class="panel">${table(['Mã hội viên', 'Họ tên', 'Điện thoại', 'Gói hiện tại', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

function renderPackages() {
  const records = filtered(state.packages, (item) => [item.id, item.name, item.durationDays, item.price]);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${money(item.price)}</td><td>${item.durationDays} ngày</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng áp dụng')}</td><td class="actions-cell">${canManage() ? actionButton('edit', item.id, 'Sửa') : ''}${canManage() ? actionButton('toggle-package', item.id, item.active ? 'Ngừng áp dụng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Master data', 'Danh mục gói dịch vụ', 'Quản lý giá, thời hạn và trạng thái gói. Gói đã phát sinh đăng ký chỉ có thể ngừng áp dụng.', canManage() ? '<button class="primary-btn" data-action="create">+ Thêm gói</button>' : '')}<section class="panel">${table(['Mã gói', 'Tên gói', 'Giá', 'Thời hạn', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

function renderSubscriptions() {
  const records = filtered(state.subscriptions, (item) => [item.id, memberName(item.memberId), packageName(item.packageId), subscriptionStatus(item)]);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(packageName(item.packageId))}</td><td>${dateText(item.startDate)}</td><td>${dateText(item.endDate)}</td><td>${badge(subscriptionStatus(item))}</td><td>${canManage() && !item.cancelled ? actionButton('renew', item.memberId, 'Gia hạn') : ''}</td></tr>`).join('');
  return `${pageHeader('Membership', 'Đăng ký & theo dõi gói', 'Ghi nhận đăng ký, gia hạn và theo dõi ngày hết hạn của hội viên.', canManage() ? '<button class="primary-btn" data-action="create">+ Đăng ký gói</button>' : '')}<section class="panel">${table(['Mã đăng ký', 'Hội viên', 'Gói', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

function renderClasses() {
  const records = filtered(state.classes, (item) => [item.id, item.name, trainerName(item.trainerId), item.day, item.start]);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(trainerName(item.trainerId))}</td><td>${escapeHtml(item.day)} · ${escapeHtml(item.start)}–${escapeHtml(item.end)}</td><td>${registrationCount(item.id)}/${item.capacity}</td><td>${badge(classStatus(item))}</td><td class="actions-cell">${canManage() ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('class-roster', item.id, 'Học viên')}${canManage() ? actionButton('toggle-class', item.id, item.active ? 'Ngừng mở' : 'Mở lớp', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Classes', 'Lớp tập & lịch học', 'Quản lý huấn luyện viên, lịch học và sức chứa. Lớp đang có người đăng ký không bị xóa cứng.', canManage() ? '<button class="primary-btn" data-action="create">+ Tạo lớp</button>' : '')}<section class="panel">${table(['Mã lớp', 'Lớp', 'Huấn luyện viên', 'Lịch học', 'Đăng ký', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

function renderTrainers() {
  const records = filtered(state.trainers, (item) => [item.id, item.name, item.specialty, item.phone]);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.specialty)}</td><td>${escapeHtml(item.phone)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td class="actions-cell">${canManage() ? actionButton('edit', item.id, 'Sửa') : ''}${actionButton('trainer-schedule', item.id, 'Lịch dạy')}${canManage() ? actionButton('toggle-trainer', item.id, item.active ? 'Ngừng' : 'Kích hoạt', item.active ? 'danger' : 'plain') : ''}</td></tr>`).join('');
  return `${pageHeader('Team', 'Huấn luyện viên', 'Quản lý hồ sơ chuyên môn và theo dõi lịch phân công.', canManage() ? '<button class="primary-btn" data-action="create">+ Thêm HLV</button>' : '')}<section class="panel">${table(['Mã HLV', 'Họ tên', 'Chuyên môn', 'Điện thoại', 'Trạng thái', 'Thao tác'], rows)}</section>`;
}

function renderRegistrations() {
  const activeMembers = state.members.filter((member) => member.active);
  const activeClasses = state.classes.filter((item) => item.active);
  const records = filtered(state.registrations, (item) => [item.id, memberName(item.memberId), getClass(item.classId)?.name, item.status]);
  const rows = records.map((item) => {
    const classItem = getClass(item.classId);
    return `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(classItem?.name || 'Lớp đã ngừng')}</td><td>${dateText(item.date)}</td><td>${badge(item.status)}</td><td class="actions-cell">${item.status === 'Đã đăng ký' && canManage() ? `${actionButton('change-registration', item.id, 'Đổi lớp')}${actionButton('cancel-registration', item.id, 'Hủy', 'danger')}` : ''}</td></tr>`;
  }).join('');
  return `${pageHeader('Registration', 'Đăng ký lớp tập', 'Chỉ hội viên có gói hiệu lực được ghi danh. Hệ thống tự kiểm tra trùng đăng ký và sức chứa.', canManage() ? '<button class="primary-btn" data-action="create">+ Đăng ký lớp</button>' : '')}
    <section class="panel capacity-overview"><h3>Tình trạng lớp</h3><div class="capacity-grid">${activeClasses.map((item) => `<article class="capacity-item"><div><strong>${escapeHtml(item.name)}</strong>${badge(classStatus(item))}</div><p>${registrationCount(item.id)} / ${item.capacity} chỗ · ${escapeHtml(item.day)} ${escapeHtml(item.start)}</p></article>`).join('')}</div></section>
    <section class="panel">${table(['Mã đăng ký', 'Hội viên', 'Lớp', 'Ngày đăng ký', 'Trạng thái', 'Thao tác'], rows)}</section>
    <p class="page-description">${activeMembers.length} hội viên đang hoạt động · ${activeClasses.length} lớp đang mở</p>`;
}

function renderHistory(memberFilter = '') {
  const selectedMember = memberFilter || searchTerm;
  const members = filtered(state.members, (member) => [member.id, member.name, member.phone]);
  const selected = selectedMember ? state.members.find((member) => member.id === selectedMember) : null;
  const relevantMembers = selected ? [selected] : members;
  const subscriptions = state.subscriptions.filter((item) => relevantMembers.some((member) => member.id === item.memberId)).map((item) => ({ at: item.startDate, type: 'Gói dịch vụ', detail: `${memberName(item.memberId)} đăng ký ${packageName(item.packageId)} (${dateText(item.startDate)} – ${dateText(item.endDate)})`, status: subscriptionStatus(item) }));
  const registrations = state.registrations.filter((item) => relevantMembers.some((member) => member.id === item.memberId)).map((item) => ({ at: item.date, type: 'Lớp tập', detail: `${memberName(item.memberId)} · ${getClass(item.classId)?.name || 'Lớp đã ngừng'}`, status: item.status }));
  const activity = state.logs.filter((item) => !selected || item.detail.includes(selected.name) || item.detail.includes(selected.id)).map((item) => ({ at: item.at.slice(0, 10), type: item.action, detail: item.detail, status: 'Đã ghi nhận' }));
  const rows = [...subscriptions, ...registrations, ...activity].sort((a, b) => b.at.localeCompare(a.at)).map((item) => `<tr><td>${dateText(item.at)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.detail)}</td><td>${badge(item.status)}</td></tr>`).join('');
  return `${pageHeader('Tra cứu', 'Lịch sử hội viên', 'Tra cứu lịch sử đăng ký gói và lớp theo mã, tên hoặc số điện thoại.')}
    <section class="panel"><label class="filter-control"><span>Hội viên</span><select id="historyMember"><option value="">Tất cả hội viên</option>${state.members.map((member) => `<option value="${escapeHtml(member.id)}" ${memberFilter === member.id ? 'selected' : ''}>${escapeHtml(member.name)} · ${escapeHtml(member.id)}</option>`).join('')}</select></label>
    ${selected ? `<div class="member-summary"><strong>${escapeHtml(selected.name)}</strong><span>${escapeHtml(selected.phone)}</span>${badge(selected.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</div>` : ''}
    ${table(['Ngày', 'Nghiệp vụ', 'Nội dung', 'Trạng thái'], rows, 'Chưa có lịch sử giao dịch.')}</section>`;
}

function renderReports() {
  const activeSubscriptions = state.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)));
  const packageRows = state.packages.map((item) => {
    const count = activeSubscriptions.filter((subscription) => subscription.packageId === item.id).length;
    return `<tr><td>${escapeHtml(item.name)}</td><td>${count}</td><td>${money(item.price)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng áp dụng')}</td></tr>`;
  }).join('');
  const classRows = state.classes.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${registrationCount(item.id)}</td><td>${item.capacity}</td><td>${Math.max(item.capacity - registrationCount(item.id), 0)}</td><td>${badge(classStatus(item))}</td></tr>`).join('');
  return `${pageHeader('Analytics', 'Báo cáo vận hành', 'Thống kê số hội viên theo gói và sức chứa thực tế của từng lớp.', '<button class="secondary-btn" data-action="export-report">Tải CSV</button>')}
    <div class="stats-grid">${[
      ['Tổng hội viên', state.members.filter((item) => item.active).length, 'blue'],
      ['Gói hiệu lực', activeSubscriptions.length, 'green'],
      ['Tổng lượt đăng ký lớp', state.registrations.filter((item) => item.status === 'Đã đăng ký').length, 'orange'],
      ['Lớp đã đầy', state.classes.filter((item) => classStatus(item) === 'Đã đầy').length, 'purple']
    ].map(([label, value, tone]) => `<article class="stat-card"><p class="mini-label">${label}</p><h3>${value}</h3><div class="report-meter ${tone}"><span style="width:${Math.min(Number(value) * 10, 100)}%"></span></div></article>`).join('')}</div>
    <div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><p class="mini-label">US11</p><h3>Hội viên theo gói</h3></div></div>${table(['Gói dịch vụ', 'Hội viên hiệu lực', 'Giá tham khảo', 'Trạng thái'], packageRows)}</section>
    <section class="panel"><div class="panel-header"><div><p class="mini-label">US12</p><h3>Sức chứa lớp</h3></div></div>${table(['Lớp', 'Đã đăng ký', 'Sức chứa', 'Còn chỗ', 'Trạng thái'], classRows)}</section></div>`;
}

function renderUsers() {
  const records = filtered(state.users, (item) => [item.id, item.username, item.name, item.role]);
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.username)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.role)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td>${canManage() && item.username !== 'admin' ? actionButton('toggle-user', item.id, item.active ? 'Khóa' : 'Mở khóa', item.active ? 'danger' : 'plain') : '—'}</td></tr>`).join('');
  return `${pageHeader('Security', 'Tài khoản & phân quyền', 'Quản lý tài khoản demo và đổi vai trò hiện tại để xem phạm vi thao tác.', canManage() ? '<button class="primary-btn" data-action="create">+ Tạo tài khoản</button>' : '')}
    <section class="panel"><div class="role-note"><strong>Quyền của vai trò ${escapeHtml(currentRole)}:</strong> ${escapeHtml(roleDescription(currentRole))}</div>${table(['Tên đăng nhập', 'Họ tên', 'Vai trò', 'Trạng thái', 'Thao tác'], rows)}</section>
    <p class="page-description">Đây là phân quyền phía giao diện trên dữ liệu demo. Cần backend xác thực để bảo vệ hệ thống thật.</p>`;
}

function roleDescription(role) {
  return ({
    'Quản lý': 'Toàn quyền quản lý danh mục, tài khoản, lớp và báo cáo.',
    'Lễ tân': 'Quản lý hội viên, đăng ký gói và đăng ký lớp.',
    'Huấn luyện viên': 'Tra cứu lớp, lịch dạy và danh sách học viên.',
    'Hội viên': 'Vai trò chỉ xem; không được thay đổi dữ liệu quản lý.'
  })[role];
}

function render() {
  renderTopbar();
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === currentView));
  const renderers = {
    dashboard: renderDashboard,
    members: renderMembers,
    packages: renderPackages,
    subscriptions: renderSubscriptions,
    classes: renderClasses,
    trainers: renderTrainers,
    registrations: renderRegistrations,
    history: () => renderHistory(),
    reports: renderReports,
    users: renderUsers
  };
  appView.innerHTML = (renderers[currentView] || renderDashboard)();
}

function field(label, name, type, value = '', options = [], required = false, hint = '') {
  const requiredAttr = required ? 'required' : '';
  const hintHtml = hint ? `<small class="field-hint">${escapeHtml(hint)}</small>` : '';
  let control;
  if (type === 'select') {
    control = `<select name="${name}" ${requiredAttr}>${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
  } else if (type === 'textarea') {
    control = `<textarea name="${name}" rows="3" ${requiredAttr}>${escapeHtml(value)}</textarea>`;
  } else {
    control = `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${requiredAttr} ${type === 'number' ? 'min="0"' : ''} />`;
  }
  return `<label class="form-field"><span>${escapeHtml(label)}${required ? ' *' : ''}</span>${control}${hintHtml}</label>`;
}

function optionsFrom(records, labelOf, valueOf = (item) => item.id) {
  return records.map((item) => ({ value: valueOf(item), label: labelOf(item) }));
}

function formConfig(type, record = {}) {
  const configs = {
    member: {
      title: record.id ? 'Cập nhật hội viên' : 'Thêm hội viên',
      fields: [
        field('Mã hội viên', 'id', 'text', record.id || generateId('HV', state.members), [], true, record.id ? 'Mã định danh không thay đổi.' : 'Mã được đề xuất tự động, có thể chỉnh sửa.'),
        field('Họ tên', 'name', 'text', record.name, [], true),
        field('Số điện thoại', 'phone', 'tel', record.phone, [], true),
        field('Email', 'email', 'email', record.email)
      ]
    },
    package: {
      title: record.id ? 'Cập nhật gói dịch vụ' : 'Thêm gói dịch vụ',
      fields: [field('Mã gói', 'id', 'text', record.id || generateId('GOI', state.packages), [], true), field('Tên gói', 'name', 'text', record.name, [], true), field('Giá (đồng)', 'price', 'number', record.price, [], true), field('Thời hạn (ngày)', 'durationDays', 'number', record.durationDays, [], true)]
    },
    trainer: {
      title: record.id ? 'Cập nhật huấn luyện viên' : 'Thêm huấn luyện viên',
      fields: [field('Mã HLV', 'id', 'text', record.id || generateId('HLV', state.trainers), [], true), field('Họ tên', 'name', 'text', record.name, [], true), field('Chuyên môn', 'specialty', 'text', record.specialty, [], true), field('Điện thoại', 'phone', 'tel', record.phone, [], true)]
    },
    class: {
      title: record.id ? 'Cập nhật lớp tập' : 'Tạo lớp tập',
      fields: [field('Mã lớp', 'id', 'text', record.id || generateId('LOP', state.classes), [], true), field('Tên lớp', 'name', 'text', record.name, [], true), field('Huấn luyện viên', 'trainerId', 'select', record.trainerId || '', optionsFrom(state.trainers.filter((item) => item.active || item.id === record.trainerId), (item) => `${item.name} · ${item.specialty}`), true), field('Ngày học', 'day', 'select', record.day || 'Thứ 2', ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((value) => ({ value, label: value })), true), field('Giờ bắt đầu', 'start', 'time', record.start || '18:00', [], true), field('Giờ kết thúc', 'end', 'time', record.end || '19:00', [], true), field('Sức chứa', 'capacity', 'number', record.capacity || 20, [], true)]
    },
    subscription: {
      title: 'Đăng ký gói dịch vụ',
      fields: [field('Hội viên', 'memberId', 'select', record.memberId || '', optionsFrom(state.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), true), field('Gói dịch vụ', 'packageId', 'select', record.packageId || '', optionsFrom(state.packages.filter((item) => item.active), (item) => `${item.name} · ${money(item.price)}`), true), field('Ngày bắt đầu', 'startDate', 'date', record.startDate || today, [], true)]
    },
    registration: {
      title: record.id ? 'Chuyển hội viên sang lớp khác' : 'Đăng ký lớp cho hội viên',
      fields: [field('Hội viên', 'memberId', 'select', record.memberId || '', optionsFrom(state.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), true), field('Lớp tập', 'classId', 'select', record.classId || '', optionsFrom(state.classes.filter((item) => item.active && (item.id === record.classId || registrationCount(item.id) < item.capacity)), (item) => `${item.name} · ${registrationCount(item.id)}/${item.capacity} · ${item.day} ${item.start}`), true), field('Ngày đăng ký', 'date', 'date', today, [], true)]
    },
    user: {
      title: 'Tạo tài khoản người dùng',
      fields: [field('Tên đăng nhập', 'username', 'text', '', [], true), field('Họ tên', 'name', 'text', '', [], true), field('Vai trò', 'role', 'select', 'Lễ tân', ['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên'].map((value) => ({ value, label: value })), true)]
    }
  };
  return configs[type];
}

function openForm(type, id = '') {
  const collections = { member: 'members', package: 'packages', trainer: 'trainers', class: 'classes', registration: 'registrations' };
  const record = id && collections[type] ? state[collections[type]].find((item) => item.id === id) : {};
  if (!canManage(type === 'member' ? 'members' : type === 'package' ? 'packages' : type === 'trainer' ? 'trainers' : type === 'class' ? 'classes' : type === 'subscription' ? 'subscriptions' : type === 'registration' ? 'registrations' : 'users')) {
    notify('Vai trò hiện tại không được phép thực hiện thao tác này.', 'error');
    return;
  }
  if (type === 'subscription' && id) {
    const existing = currentSubscription(id);
    record.memberId = id;
    record.startDate = existing ? dateOffset(existing.endDate, 1) : today;
  }
  const config = formConfig(type, record);
  if (!config) return;
  dialog.innerHTML = `<form method="dialog" class="form-dialog-content" id="entityForm" data-type="${type}" data-edit-id="${escapeHtml(record.id || '')}"><div class="dialog-heading"><div><p class="mini-label">CoreFit</p><h3>${config.title}</h3></div><button type="button" class="icon-button" data-action="close-dialog" aria-label="Đóng">×</button></div><div class="form-grid">${config.fields.join('')}</div><div class="dialog-actions"><button type="button" class="secondary-btn" data-action="close-dialog">Hủy</button><button type="submit" class="primary-btn">Lưu</button></div></form>`;
  if (record.id) {
    const idField = dialog.querySelector('[name="id"]');
    if (idField) idField.readOnly = true;
  }
  dialog.showModal();
}

function handleFormSubmit(event) {
  if (event.target.id !== 'entityForm') return;
  event.preventDefault();
  const form = event.target;
  const type = form.dataset.type;
  const editId = form.dataset.editId;
  const values = Object.fromEntries(new FormData(form).entries());
  const collections = { member: 'members', package: 'packages', trainer: 'trainers', class: 'classes' };

  if (collections[type]) {
    const collection = state[collections[type]];
    if (collection.some((item) => item.id === values.id && item.id !== editId)) return notify('Mã định danh đã tồn tại.', 'error');
    if (type === 'class') {
      if (values.end <= values.start) return notify('Giờ kết thúc phải sau giờ bắt đầu.', 'error');
      const count = editId ? registrationCount(editId) : 0;
      if (Number(values.capacity) < count) return notify(`Sức chứa không thể nhỏ hơn ${count} hội viên đã đăng ký.`, 'error');
      const conflict = state.classes.some((item) => item.id !== editId && item.active && item.trainerId === values.trainerId && item.day === values.day && values.start < item.end && values.end > item.start);
      if (conflict) return notify('Huấn luyện viên đã có lớp trùng thời gian.', 'error');
    }
    const numericFields = type === 'package' ? ['price', 'durationDays'] : type === 'class' ? ['capacity'] : [];
    numericFields.forEach((key) => { values[key] = Number(values[key]); });
    if (numericFields.some((key) => values[key] <= 0)) return notify('Giá, thời hạn và sức chứa phải lớn hơn 0.', 'error');
    const normalized = { ...values, active: editId ? collection.find((item) => item.id === editId).active : true };
    if (editId) Object.assign(collection.find((item) => item.id === editId), normalized);
    else collection.push(normalized);
    logActivity(editId ? 'Cập nhật' : 'Tạo mới', `${type}: ${values.name}`);
  } else if (type === 'subscription') {
    const member = getMember(values.memberId);
    const packageItem = getPackage(values.packageId);
    if (!member?.active || !packageItem?.active) return notify('Hội viên hoặc gói dịch vụ không còn hoạt động.', 'error');
    const existing = currentSubscription(member.id);
    let startDate = values.startDate;
    if (existing && startDate <= existing.endDate) startDate = dateOffset(existing.endDate, 1);
    state.subscriptions.push({ id: generateId('DKG', state.subscriptions), memberId: member.id, packageId: packageItem.id, startDate, endDate: dateOffset(startDate, packageItem.durationDays), cancelled: false, price: packageItem.price });
    logActivity(existing ? 'Gia hạn gói' : 'Đăng ký gói', `${member.name} · ${packageItem.name}`);
  } else if (type === 'registration') {
    const member = getMember(values.memberId);
    const classItem = getClass(values.classId);
    if (!member?.active || !classItem?.active) return notify('Hội viên hoặc lớp không còn hoạt động.', 'error');
    const hasSubscription = state.subscriptions.some((item) => item.memberId === member.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)));
    if (!hasSubscription) return notify('Hội viên cần có gói hiệu lực để đăng ký lớp.', 'error');
    if (state.registrations.some((item) => item.id !== editId && item.memberId === member.id && item.classId === classItem.id && item.status === 'Đã đăng ký')) return notify('Hội viên đã đăng ký lớp này.', 'error');
    const occupied = registrationCount(classItem.id) - (editId && state.registrations.find((item) => item.id === editId)?.classId === classItem.id ? 1 : 0);
    if (occupied >= classItem.capacity) return notify('Lớp đã đầy, không thể đăng ký thêm.', 'error');
    if (editId) {
      const previous = state.registrations.find((item) => item.id === editId);
      if (previous) previous.status = 'Đã chuyển lớp';
    }
    state.registrations.push({ id: generateId('DKL', state.registrations), memberId: member.id, classId: classItem.id, date: values.date, status: 'Đã đăng ký' });
    logActivity(editId ? 'Chuyển lớp' : 'Đăng ký lớp', `${member.name} · ${classItem.name}`);
  } else if (type === 'user') {
    if (state.users.some((item) => item.username.toLowerCase() === values.username.toLowerCase())) return notify('Tên đăng nhập đã tồn tại.', 'error');
    state.users.push({ id: generateId('USR', state.users), ...values, active: true });
    logActivity('Tạo tài khoản', `${values.username} · ${values.role}`);
  }

  saveState();
  dialog.close();
  render();
  notify('Đã lưu dữ liệu.');
}

function showHistory(memberId) {
  currentView = 'history';
  searchTerm = '';
  renderTopbar();
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === currentView));
  appView.innerHTML = renderHistory(memberId);
}

function showClassRoster(classId) {
  const classItem = getClass(classId);
  const registrations = state.registrations.filter((item) => item.classId === classId && item.status === 'Đã đăng ký');
  const rows = registrations.map((item) => `<tr><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(getMember(item.memberId)?.phone || '')}</td><td>${dateText(item.date)}</td><td>${badge(item.status)}</td></tr>`).join('');
  appView.innerHTML = `<section class="panel"><div class="panel-header"><div><p class="mini-label">Danh sách lớp</p><h3>${escapeHtml(classItem?.name || 'Lớp tập')}</h3></div><button class="secondary-btn" data-action="navigate" data-view="classes">Quay lại</button></div>${table(['Hội viên', 'Điện thoại', 'Ngày đăng ký', 'Trạng thái'], rows, 'Lớp chưa có hội viên.')}</section>`;
}

function toggleRecord(collection, id, label) {
  const record = state[collection].find((item) => item.id === id);
  if (!record) return;
  record.active = !record.active;
  logActivity(record.active ? 'Kích hoạt' : 'Ngừng hoạt động', `${label}: ${record.name || record.username}`);
  saveState();
  render();
  notify(record.active ? 'Đã kích hoạt.' : 'Đã chuyển sang trạng thái ngừng hoạt động.');
}

function handleAction(button) {
  const { action, id, view } = button.dataset;
  if (action === 'navigate') {
    currentView = view;
    searchTerm = '';
    render();
  } else if (action === 'create') {
    const type = ({ members: 'member', packages: 'package', classes: 'class', trainers: 'trainer', users: 'user', subscriptions: 'subscription', registrations: 'registration' })[currentView];
    if (type) openForm(type);
  } else if (action === 'edit') {
    const type = ({ members: 'member', packages: 'package', classes: 'class', trainers: 'trainer' })[currentView];
    if (type) openForm(type, id);
  } else if (action === 'toggle-member') toggleRecord('members', id, 'Hội viên');
  else if (action === 'toggle-package') toggleRecord('packages', id, 'Gói dịch vụ');
  else if (action === 'toggle-class') toggleRecord('classes', id, 'Lớp tập');
  else if (action === 'toggle-trainer') toggleRecord('trainers', id, 'Huấn luyện viên');
  else if (action === 'toggle-user') toggleRecord('users', id, 'Tài khoản');
  else if (action === 'member-history') showHistory(id);
  else if (action === 'class-roster') showClassRoster(id);
  else if (action === 'trainer-schedule') {
    currentView = 'classes';
    searchTerm = getTrainer(id)?.name || '';
    render();
  } else if (action === 'renew') openForm('subscription', id);
  else if (action === 'change-registration') openForm('registration', id);
  else if (action === 'cancel-registration') {
    const registration = state.registrations.find((item) => item.id === id);
    if (registration) {
      registration.status = 'Đã hủy';
      logActivity('Hủy đăng ký lớp', `${memberName(registration.memberId)} · ${getClass(registration.classId)?.name || ''}`);
      saveState();
      render();
      notify('Đã hủy đăng ký và giải phóng chỗ trong lớp.');
    }
  } else if (action === 'close-dialog') dialog.close();
  else if (action === 'export-report') exportReport();
}

function exportReport() {
  const rows = [['Loại', 'Tên', 'Số lượng', 'Sức chứa', 'Còn chỗ']];
  state.packages.forEach((item) => rows.push(['Gói', item.name, state.subscriptions.filter((sub) => sub.packageId === item.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(sub))).length, '', '']));
  state.classes.forEach((item) => rows.push(['Lớp', item.name, registrationCount(item.id), item.capacity, Math.max(item.capacity - registrationCount(item.id), 0)]));
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')}`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = 'corefit-bao-cao.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelector('.nav-menu').addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  currentView = button.dataset.view;
  searchTerm = '';
  render();
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) handleAction(button);
});

document.addEventListener('submit', handleFormSubmit);

document.addEventListener('input', (event) => {
  if (event.target.id !== 'globalSearch') return;
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    searchTerm = event.target.value;
    render();
    const replacement = document.getElementById('globalSearch');
    replacement?.focus();
    replacement?.setSelectionRange(searchTerm.length, searchTerm.length);
  }, 300);
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'roleSelect') {
    currentRole = event.target.value;
    localStorage.setItem('corefit-role', currentRole);
    render();
    notify(`Đã chuyển sang vai trò ${currentRole}.`);
  } else if (event.target.id === 'historyMember') {
    renderTopbar();
    appView.innerHTML = renderHistory(event.target.value);
  }
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

if (!state.subscriptions.length) {
  const premium = getPackage('GOI01');
  const gold = getPackage('GOI02');
  const basic = getPackage('GOI03');
  state.subscriptions.push(
    { id: 'DKG0001', memberId: 'HV0001', packageId: premium.id, startDate: dateOffset(today, -90), endDate: dateOffset(today, 275), cancelled: false, price: premium.price },
    { id: 'DKG0002', memberId: 'HV0002', packageId: gold.id, startDate: dateOffset(today, -175), endDate: dateOffset(today, 5), cancelled: false, price: gold.price },
    { id: 'DKG0003', memberId: 'HV0003', packageId: basic.id, startDate: dateOffset(today, -60), endDate: dateOffset(today, -30), cancelled: false, price: basic.price }
  );
}

if (!state.registrations.length) {
  state.registrations.push(
    { id: 'DKL0001', memberId: 'HV0001', classId: 'LOP01', date: today, status: 'Đã đăng ký' },
    { id: 'DKL0002', memberId: 'HV0002', classId: 'LOP02', date: today, status: 'Đã đăng ký' },
    { id: 'DKL0003', memberId: 'HV0003', classId: 'LOP03', date: today, status: 'Đã đăng ký' }
  );
}

saveState();
render();
