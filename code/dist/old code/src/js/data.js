export const STORAGE_KEY = 'corefit-gym-v1';

const localNow = new Date();
export const today = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;

export const initialState = {
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

export const views = {
  dashboard: 'Tổng quan', members: 'Hội viên', packages: 'Gói dịch vụ', subscriptions: 'Đăng ký & gia hạn gói',
  classes: 'Lớp tập & lịch học', trainers: 'Huấn luyện viên', registrations: 'Đăng ký lớp', history: 'Lịch sử hội viên',
  reports: 'Báo cáo', users: 'Tài khoản & phân quyền'
};

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...structuredClone(initialState), ...saved } : structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

export const state = loadState();
export const currentRole = { value: localStorage.getItem('corefit-role') || 'Quản lý' };

export function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
export function setRole(role) { currentRole.value = role; localStorage.setItem('corefit-role', role); }
export function logActivity(action, detail) {
  state.logs.unshift({ id: crypto.randomUUID(), action, detail, at: new Date().toISOString() });
  state.logs = state.logs.slice(0, 300);
}
export function getMember(id) { return state.members.find((member) => member.id === id); }
export function getPackage(id) { return state.packages.find((item) => item.id === id); }
export function getTrainer(id) { return state.trainers.find((trainer) => trainer.id === id); }
export function getClass(id) { return state.classes.find((item) => item.id === id); }
export function memberName(id) { return getMember(id)?.name || 'Hội viên không tồn tại'; }
export function trainerName(id) { return getTrainer(id)?.name || 'Chưa phân công'; }
export function packageName(id) { return getPackage(id)?.name || 'Gói đã ngừng'; }
export function subscriptionStatus(subscription) {
  if (subscription.cancelled) return 'Đã hủy';
  if (subscription.startDate > today) return 'Chưa bắt đầu';
  if (subscription.endDate < today) return 'Hết hạn';
  const remaining = Math.ceil((Date.parse(`${subscription.endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  return remaining <= 7 ? 'Sắp hết hạn' : 'Hiệu lực';
}
export function currentSubscription(memberId) {
  return state.subscriptions.find((item) => item.memberId === memberId && subscriptionStatus(item) === 'Hiệu lực')
    || state.subscriptions.find((item) => item.memberId === memberId && subscriptionStatus(item) === 'Sắp hết hạn');
}
export function registrationCount(classId) { return state.registrations.filter((item) => item.classId === classId && item.status === 'Đã đăng ký').length; }
export function classStatus(item) {
  const count = registrationCount(item.id);
  if (!item.active) return 'Ngừng mở';
  if (count >= item.capacity) return 'Đã đầy';
  if (count / item.capacity >= 0.8) return 'Sắp đầy';
  return 'Còn chỗ';
}
export function canManage(section, role = currentRole.value) {
  if (role === 'Quản lý') return true;
  if (role === 'Lễ tân') return ['members', 'subscriptions', 'registrations', 'history'].includes(section);
  return false;
}

export function seedDemoData() {
  if (!state.subscriptions.length) {
    const premium = getPackage('GOI01'); const gold = getPackage('GOI02'); const basic = getPackage('GOI03');
    state.subscriptions.push(
      { id: 'DKG0001', memberId: 'HV0001', packageId: premium.id, startDate: dateOffset(today, -90), endDate: dateOffset(today, 275), cancelled: false, price: premium.price },
      { id: 'DKG0002', memberId: 'HV0002', packageId: gold.id, startDate: dateOffset(today, -175), endDate: dateOffset(today, 5), cancelled: false, price: gold.price },
      { id: 'DKG0003', memberId: 'HV0003', packageId: basic.id, startDate: dateOffset(today, -60), endDate: dateOffset(today, -30), cancelled: false, price: basic.price }
    );
  }
  if (!state.registrations.length) state.registrations.push(
    { id: 'DKL0001', memberId: 'HV0001', classId: 'LOP01', date: today, status: 'Đã đăng ký' },
    { id: 'DKL0002', memberId: 'HV0002', classId: 'LOP02', date: today, status: 'Đã đăng ký' },
    { id: 'DKL0003', memberId: 'HV0003', classId: 'LOP03', date: today, status: 'Đã đăng ký' }
  );
  saveState();
}

export function dateOffset(start, days) {
  const date = new Date(`${start}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(days));
  return date.toISOString().slice(0, 10);
}
