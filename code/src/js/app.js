import { canManage, classStatus, currentRole, currentSubscription, dateOffset, getClass, getMember, getPackage, getTrainer, logActivity, memberName, packageName, registrationCount, saveState, seedDemoData, setRole, state, subscriptionStatus, trainerName, today, views } from './data.js';
import { actionButton, badge, dateText, escapeHtml, field, generateId, money, notify, optionsFrom, pageHeader, roleDescription, table } from './utils.js';
import { renderClasses, renderClassRoster, renderTrainers } from './classes.js';
import { renderMembers, renderHistory } from './members.js';
import { renderPackages } from './packages.js';
import { renderRegistrations } from './registrations.js';
import { renderReports, exportReport } from './reports.js';
import { renderSubscriptions } from './subscriptions.js';

const appView = document.getElementById('appView');
const topbar = document.getElementById('topbar');
const toastRegion = document.getElementById('toastRegion');
const dialog = document.createElement('dialog');
dialog.className = 'form-dialog'; dialog.id = 'formDialog'; document.body.append(dialog);
let currentView = 'dashboard';
let searchTerm = '';
let searchTimer;

function renderDashboard() {
  const due = state.subscriptions.filter((item) => subscriptionStatus(item) === 'Sắp hết hạn');
  const popularClasses = state.classes.filter((item) => item.active).slice(0, 4);
  const stats = [['Hội viên hoạt động', state.members.filter((item) => item.active).length, '👥', 'blue'], ['Gói còn hiệu lực', state.subscriptions.filter((item) => ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item))).length, '💳', 'green'], ['Lớp đang mở', state.classes.filter((item) => item.active).length, '🏋️', 'orange'], ['Lượt đăng ký lớp', state.registrations.filter((item) => item.status === 'Đã đăng ký').length, '✓', 'purple']];
  return `${pageHeader('Vận hành', 'Tổng quan phòng tập', 'Theo dõi hội viên, lớp học và các hoạt động cần xử lý.')}<div class="stats-grid">${stats.map(([title, value, icon, tone]) => `<article class="stat-card"><div class="stat-top"><p class="mini-label">${title}</p><div class="stat-icon ${tone}">${icon}</div></div><h3>${value}</h3><p>Dữ liệu hiện tại</p></article>`).join('')}</div><div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><p class="mini-label">Cần chú ý</p><h3>Gói sắp hết hạn</h3></div><button class="secondary-btn" data-action="navigate" data-view="subscriptions">Quản lý gói</button></div>${table(['Hội viên', 'Gói', 'Hết hạn', 'Trạng thái'], due.map((item) => `<tr><td>${escapeHtml(memberName(item.memberId))}</td><td>${escapeHtml(packageName(item.packageId))}</td><td>${dateText(item.endDate)}</td><td>${badge(subscriptionStatus(item))}</td></tr>`).join(''), 'Không có gói sắp hết hạn.')}</section><section class="panel"><div class="panel-header"><div><p class="mini-label">Lịch tập</p><h3>Lớp đang mở</h3></div><button class="secondary-btn" data-action="navigate" data-view="classes">Xem danh sách</button></div>${table(['Lớp', 'Huấn luyện viên', 'Lịch', 'Sức chứa'], popularClasses.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(trainerName(item.trainerId))}</td><td>${escapeHtml(item.day)} · ${escapeHtml(item.start)}</td><td>${registrationCount(item.id)}/${item.capacity} ${badge(classStatus(item))}</td></tr>`).join(''))}</section></div><section class="panel panel-wide"><div class="panel-header"><div><p class="mini-label">Truy cập nhanh</p><h3>Nghiệp vụ</h3></div></div><div class="quick-links">${[['members', 'Hội viên', 'Hồ sơ và trạng thái'], ['subscriptions', 'Gói hội viên', 'Đăng ký, gia hạn, theo dõi'], ['classes', 'Lớp & lịch học', 'Lịch và sức chứa'], ['trainers', 'Huấn luyện viên', 'Hồ sơ và phân công'], ['registrations', 'Đăng ký lớp', 'Ghi danh và hủy lớp'], ['history', 'Lịch sử', 'Tra cứu hoạt động hội viên'], ['reports', 'Báo cáo', 'Số lượng và sức chứa'], ['users', 'Tài khoản', 'Vai trò và trạng thái']].map(([view, title, description]) => `<button class="quick-link" data-action="navigate" data-view="${view}"><strong>${title}</strong><span>${description}</span></button>`).join('')}</div></section>`;
}

function renderUsers() {
  const term = searchTerm.trim().toLocaleLowerCase('vi');
  const records = term ? state.users.filter((item) => [item.id, item.username, item.name, item.role].some((value) => String(value || '').toLocaleLowerCase('vi').includes(term))) : state.users;
  const rows = records.map((item) => `<tr><td>${escapeHtml(item.username)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.role)}</td><td>${badge(item.active ? 'Đang hoạt động' : 'Ngừng hoạt động')}</td><td>${canManage('users') && item.username !== 'admin' ? actionButton('toggle-user', item.id, item.active ? 'Khóa' : 'Mở khóa', item.active ? 'danger' : 'plain') : '—'}</td></tr>`).join('');
  return `${pageHeader('Security', 'Tài khoản & phân quyền', 'Quản lý tài khoản demo và đổi vai trò hiện tại để xem phạm vi thao tác.', canManage('users') ? '<button class="primary-btn" data-action="create">+ Tạo tài khoản</button>' : '')}<section class="panel"><div class="role-note"><strong>Quyền của vai trò ${escapeHtml(currentRole.value)}:</strong> ${escapeHtml(roleDescription(currentRole.value))}</div>${table(['Tên đăng nhập', 'Họ tên', 'Vai trò', 'Trạng thái', 'Thao tác'], rows)}</section><p class="page-description">Đây là phân quyền phía giao diện trên dữ liệu demo. Cần backend xác thực để bảo vệ hệ thống thật.</p>`;
}

function renderTopbar() {
  topbar.innerHTML = `<div><p class="eyebrow">HỆ THỐNG QUẢN LÝ PHÒNG TẬP</p><h2>${escapeHtml(views[currentView])}</h2></div><div class="topbar-actions"><label class="search-box"><span aria-hidden="true">⌕</span><input id="globalSearch" type="search" placeholder="Tìm trong mục hiện tại" value="${escapeHtml(searchTerm)}" aria-label="Tìm kiếm" /></label><label class="role-picker"><span>Vai trò</span><select id="roleSelect" aria-label="Vai trò hiện tại">${['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên'].map((role) => `<option ${role === currentRole.value ? 'selected' : ''}>${role}</option>`).join('')}</select></label><button class="primary-btn" data-action="create">+ Tạo mới</button></div>`;
  topbar.querySelector('[data-action="create"]').hidden = !['members', 'packages', 'classes', 'trainers', 'users'].includes(currentView) || !canManage(currentView);
}

function render() {
  renderTopbar(); document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === currentView));
  const renderers = { dashboard: renderDashboard, members: () => renderMembers(searchTerm), packages: () => renderPackages(searchTerm), subscriptions: () => renderSubscriptions(searchTerm), classes: () => renderClasses(searchTerm), trainers: () => renderTrainers(searchTerm), registrations: () => renderRegistrations(searchTerm), history: () => renderHistory('', searchTerm, { dateText, getClass, subscriptionStatus }), reports: renderReports, users: renderUsers };
  appView.innerHTML = (renderers[currentView] || renderDashboard)();
}

function formConfig(type, record = {}) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((value) => ({ value, label: value }));
  const configs = {
    member: { title: record.id ? 'Cập nhật hội viên' : 'Thêm hội viên', fields: [field('Mã hội viên', 'id', 'text', record.id || generateId('HV', state.members), [], true, record.id ? 'Mã định danh không thay đổi.' : 'Mã được đề xuất tự động, có thể chỉnh sửa.'), field('Họ tên', 'name', 'text', record.name, [], true), field('Số điện thoại', 'phone', 'tel', record.phone, [], true), field('Email', 'email', 'email', record.email)] },
    package: { title: record.id ? 'Cập nhật gói dịch vụ' : 'Thêm gói dịch vụ', fields: [field('Mã gói', 'id', 'text', record.id || generateId('GOI', state.packages), [], true), field('Tên gói', 'name', 'text', record.name, [], true), field('Giá (đồng)', 'price', 'number', record.price, [], true), field('Thời hạn (ngày)', 'durationDays', 'number', record.durationDays, [], true)] },
    trainer: { title: record.id ? 'Cập nhật huấn luyện viên' : 'Thêm huấn luyện viên', fields: [field('Mã HLV', 'id', 'text', record.id || generateId('HLV', state.trainers), [], true), field('Họ tên', 'name', 'text', record.name, [], true), field('Chuyên môn', 'specialty', 'text', record.specialty, [], true), field('Điện thoại', 'phone', 'tel', record.phone, [], true)] },
    class: { title: record.id ? 'Cập nhật lớp tập' : 'Tạo lớp tập', fields: [field('Mã lớp', 'id', 'text', record.id || generateId('LOP', state.classes), [], true), field('Tên lớp', 'name', 'text', record.name, [], true), field('Huấn luyện viên', 'trainerId', 'select', record.trainerId || '', optionsFrom(state.trainers.filter((item) => item.active || item.id === record.trainerId), (item) => `${item.name} · ${item.specialty}`), true), field('Ngày học', 'day', 'select', record.day || 'Thứ 2', days, true), field('Giờ bắt đầu', 'start', 'time', record.start || '18:00', [], true), field('Giờ kết thúc', 'end', 'time', record.end || '19:00', [], true), field('Sức chứa', 'capacity', 'number', record.capacity || 20, [], true)] },
    subscription: { title: 'Đăng ký gói dịch vụ', fields: [field('Hội viên', 'memberId', 'select', record.memberId || '', optionsFrom(state.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), true), field('Gói dịch vụ', 'packageId', 'select', record.packageId || '', optionsFrom(state.packages.filter((item) => item.active), (item) => `${item.name} · ${money(item.price)}`), true), field('Ngày bắt đầu', 'startDate', 'date', record.startDate || today, [], true)] },
    registration: { title: record.id ? 'Chuyển hội viên sang lớp khác' : 'Đăng ký lớp cho hội viên', fields: [field('Hội viên', 'memberId', 'select', record.memberId || '', optionsFrom(state.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), true), field('Lớp tập', 'classId', 'select', record.classId || '', optionsFrom(state.classes.filter((item) => item.active && (item.id === record.classId || registrationCount(item.id) < item.capacity)), (item) => `${item.name} · ${registrationCount(item.id)}/${item.capacity} · ${item.day} ${item.start}`), true), field('Ngày đăng ký', 'date', 'date', record.date || today, [], true)] },
    user: { title: 'Tạo tài khoản người dùng', fields: [field('Tên đăng nhập', 'username', 'text', '', [], true), field('Họ tên', 'name', 'text', '', [], true), field('Vai trò', 'role', 'select', 'Lễ tân', ['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên'].map((value) => ({ value, label: value })), true)] }
  };
  return configs[type];
}

function openForm(type, id = '') {
  const collections = { member: 'members', package: 'packages', trainer: 'trainers', class: 'classes', registration: 'registrations' };
  const record = id && collections[type] ? state[collections[type]].find((item) => item.id === id) : {};
  const section = ({ member: 'members', package: 'packages', trainer: 'trainers', class: 'classes', subscription: 'subscriptions', registration: 'registrations', user: 'users' })[type];
  if (!canManage(section)) return notify(toastRegion, 'Vai trò hiện tại không được phép thực hiện thao tác này.', 'error');
  if (type === 'subscription' && id) { const existing = currentSubscription(id); record.memberId = id; record.startDate = existing ? dateOffset(existing.endDate, 1) : today; }
  const config = formConfig(type, record); if (!config) return;
  dialog.innerHTML = `<form method="dialog" class="form-dialog-content" id="entityForm" data-type="${type}" data-edit-id="${escapeHtml(record.id || '')}"><div class="dialog-heading"><div><p class="mini-label">CoreFit</p><h3>${config.title}</h3></div><button type="button" class="icon-button" data-action="close-dialog" aria-label="Đóng">×</button></div><div class="form-grid">${config.fields.join('')}</div><div class="dialog-actions"><button type="button" class="secondary-btn" data-action="close-dialog">Hủy</button><button type="submit" class="primary-btn">Lưu</button></div></form>`;
  if (record.id) { const idField = dialog.querySelector('[name="id"]'); if (idField) idField.readOnly = true; }
  dialog.showModal();
}

function handleFormSubmit(event) {
  if (event.target.id !== 'entityForm') return; event.preventDefault();
  const form = event.target; const type = form.dataset.type; const editId = form.dataset.editId; const values = Object.fromEntries(new FormData(form).entries()); const collections = { member: 'members', package: 'packages', trainer: 'trainers', class: 'classes' };
  if (collections[type]) {
    const collection = state[collections[type]];
    if (collection.some((item) => item.id === values.id && item.id !== editId)) return notify(toastRegion, 'Mã định danh đã tồn tại.', 'error');
    if (type === 'class') {
      if (values.end <= values.start) return notify(toastRegion, 'Giờ kết thúc phải sau giờ bắt đầu.', 'error');
      const count = editId ? registrationCount(editId) : 0;
      if (Number(values.capacity) < count) return notify(toastRegion, `Sức chứa không thể nhỏ hơn ${count} hội viên đã đăng ký.`, 'error');
      if (state.classes.some((item) => item.id !== editId && item.active && item.trainerId === values.trainerId && item.day === values.day && values.start < item.end && values.end > item.start)) return notify(toastRegion, 'Huấn luyện viên đã có lớp trùng thời gian.', 'error');
    }
    const numericFields = type === 'package' ? ['price', 'durationDays'] : type === 'class' ? ['capacity'] : [];
    numericFields.forEach((key) => { values[key] = Number(values[key]); });
    if (numericFields.some((key) => values[key] <= 0)) return notify(toastRegion, 'Giá, thời hạn và sức chứa phải lớn hơn 0.', 'error');
    const normalized = { ...values, active: editId ? collection.find((item) => item.id === editId).active : true };
    if (editId) Object.assign(collection.find((item) => item.id === editId), normalized); else collection.push(normalized);
    logActivity(editId ? 'Cập nhật' : 'Tạo mới', `${type}: ${values.name}`);
  } else if (type === 'subscription') {
    const member = getMember(values.memberId); const packageItem = getPackage(values.packageId);
    if (!member?.active || !packageItem?.active) return notify(toastRegion, 'Hội viên hoặc gói dịch vụ không còn hoạt động.', 'error');
    const existing = currentSubscription(member.id); let startDate = values.startDate; if (existing && startDate <= existing.endDate) startDate = dateOffset(existing.endDate, 1);
    state.subscriptions.push({ id: generateId('DKG', state.subscriptions), memberId: member.id, packageId: packageItem.id, startDate, endDate: dateOffset(startDate, packageItem.durationDays), cancelled: false, price: packageItem.price }); logActivity(existing ? 'Gia hạn gói' : 'Đăng ký gói', `${member.name} · ${packageItem.name}`);
  } else if (type === 'registration') {
    const member = getMember(values.memberId); const classItem = getClass(values.classId);
    if (!member?.active || !classItem?.active) return notify(toastRegion, 'Hội viên hoặc lớp không còn hoạt động.', 'error');
    if (!state.subscriptions.some((item) => item.memberId === member.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)))) return notify(toastRegion, 'Hội viên cần có gói hiệu lực để đăng ký lớp.', 'error');
    if (state.registrations.some((item) => item.id !== editId && item.memberId === member.id && item.classId === classItem.id && item.status === 'Đã đăng ký')) return notify(toastRegion, 'Hội viên đã đăng ký lớp này.', 'error');
    const occupied = registrationCount(classItem.id) - (editId && state.registrations.find((item) => item.id === editId)?.classId === classItem.id ? 1 : 0);
    if (occupied >= classItem.capacity) return notify(toastRegion, 'Lớp đã đầy, không thể đăng ký thêm.', 'error');
    if (editId) { const previous = state.registrations.find((item) => item.id === editId); if (previous) previous.status = 'Đã chuyển lớp'; }
    state.registrations.push({ id: generateId('DKL', state.registrations), memberId: member.id, classId: classItem.id, date: values.date, status: 'Đã đăng ký' }); logActivity(editId ? 'Chuyển lớp' : 'Đăng ký lớp', `${member.name} · ${classItem.name}`);
  } else if (type === 'user') {
    if (state.users.some((item) => item.username.toLowerCase() === values.username.toLowerCase())) return notify(toastRegion, 'Tên đăng nhập đã tồn tại.', 'error');
    state.users.push({ id: generateId('USR', state.users), ...values, active: true }); logActivity('Tạo tài khoản', `${values.username} · ${values.role}`);
  }
  saveState(); dialog.close(); render(); notify(toastRegion, 'Đã lưu dữ liệu.');
}

function toggleRecord(collection, id, label) { const record = state[collection].find((item) => item.id === id); if (!record) return; record.active = !record.active; logActivity(record.active ? 'Kích hoạt' : 'Ngừng hoạt động', `${label}: ${record.name || record.username}`); saveState(); render(); notify(toastRegion, record.active ? 'Đã kích hoạt.' : 'Đã chuyển sang trạng thái ngừng hoạt động.'); }
function handleAction(button) {
  const { action, id, view } = button.dataset;
  if (action === 'navigate') { currentView = view; searchTerm = ''; render(); }
  else if (action === 'create') { const type = ({ members: 'member', packages: 'package', classes: 'class', trainers: 'trainer', users: 'user', subscriptions: 'subscription', registrations: 'registration' })[currentView]; if (type) openForm(type); }
  else if (action === 'edit') { const type = ({ members: 'member', packages: 'package', classes: 'class', trainers: 'trainer' })[currentView]; if (type) openForm(type, id); }
  else if (action === 'toggle-member') toggleRecord('members', id, 'Hội viên'); else if (action === 'toggle-package') toggleRecord('packages', id, 'Gói dịch vụ'); else if (action === 'toggle-class') toggleRecord('classes', id, 'Lớp tập'); else if (action === 'toggle-trainer') toggleRecord('trainers', id, 'Huấn luyện viên'); else if (action === 'toggle-user') toggleRecord('users', id, 'Tài khoản');
  else if (action === 'member-history') { currentView = 'history'; searchTerm = ''; renderTopbar(); appView.innerHTML = renderHistory(id, '', { dateText, getClass, subscriptionStatus }); }
  else if (action === 'class-roster') appView.innerHTML = renderClassRoster(id);
  else if (action === 'trainer-schedule') { currentView = 'classes'; searchTerm = getTrainer(id)?.name || ''; render(); }
  else if (action === 'renew') openForm('subscription', id); else if (action === 'change-registration') openForm('registration', id);
  else if (action === 'cancel-registration') { const registration = state.registrations.find((item) => item.id === id); if (registration) { registration.status = 'Đã hủy'; logActivity('Hủy đăng ký lớp', `${memberName(registration.memberId)} · ${getClass(registration.classId)?.name || ''}`); saveState(); render(); notify(toastRegion, 'Đã hủy đăng ký và giải phóng chỗ trong lớp.'); } }
  else if (action === 'close-dialog') dialog.close(); else if (action === 'export-report') exportReport();
}

document.querySelector('.nav-menu').addEventListener('click', (event) => { const button = event.target.closest('[data-view]'); if (!button) return; currentView = button.dataset.view; searchTerm = ''; render(); });
document.addEventListener('click', (event) => { const button = event.target.closest('[data-action]'); if (button) handleAction(button); });
document.addEventListener('submit', handleFormSubmit);
document.addEventListener('input', (event) => { if (event.target.id !== 'globalSearch') return; window.clearTimeout(searchTimer); searchTimer = window.setTimeout(() => { searchTerm = event.target.value; render(); const replacement = document.getElementById('globalSearch'); replacement?.focus(); replacement?.setSelectionRange(searchTerm.length, searchTerm.length); }, 300); });
document.addEventListener('change', (event) => { if (event.target.id === 'roleSelect') { setRole(event.target.value); render(); notify(toastRegion, `Đã chuyển sang vai trò ${currentRole.value}.`); } else if (event.target.id === 'historyMember') { renderTopbar(); appView.innerHTML = renderHistory(event.target.value, '', { dateText, getClass, subscriptionStatus }); } });
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

seedDemoData(); render();
