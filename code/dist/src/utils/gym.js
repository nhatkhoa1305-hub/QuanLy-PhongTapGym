export const STORAGE_KEY = 'corefit-gym-v1'

export const views = {
  dashboard: 'Tổng quan',
  members: 'Hội viên',
  packages: 'Gói dịch vụ',
  subscriptions: 'Đăng ký & gia hạn gói',
  classes: 'Lớp tập & lịch học',
  trainers: 'Huấn luyện viên',
  registrations: 'Đăng ký lớp',
  history: 'Lịch sử hội viên',
  reports: 'Báo cáo',
  users: 'Phân quyền',
}

export const roles = ['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên']

export const initialState = {
  members: [
    { id: 'HV0001', name: 'Nguyễn Minh Anh', phone: '0912345678', email: 'minhanh@example.com', active: true },
    { id: 'HV0002', name: 'Trần Quốc Bảo', phone: '0987654321', email: 'quocbao@example.com', active: true },
    { id: 'HV0003', name: 'Lê Thu Hà', phone: '0905123456', email: 'thuha@example.com', active: true },
    { id: 'HV0004', name: 'Phạm Hoàng Nam', phone: '0938123456', email: 'hoangnam@example.com', active: false },
  ],
  packages: [
    { id: 'GOI01', name: 'Premium 12 tháng', price: 7900000, durationDays: 365, active: true },
    { id: 'GOI02', name: 'Gold 6 tháng', price: 4200000, durationDays: 180, active: true },
    { id: 'GOI03', name: 'Basic 1 tháng', price: 850000, durationDays: 30, active: true },
  ],
  trainers: [
    { id: 'HLV01', name: 'Nguyễn Lan Anh', specialty: 'Yoga', phone: '0909000001', active: true },
    { id: 'HLV02', name: 'Trần Minh', specialty: 'HIIT, Cardio', phone: '0909000002', active: true },
    { id: 'HLV03', name: 'Lê Hoàng Hùng', specialty: 'Boxing', phone: '0909000003', active: true },
  ],
  classes: [
    { id: 'LOP01', name: 'Yoga buổi tối', trainerId: 'HLV01', day: 'Thứ 2', start: '18:00', end: '19:00', capacity: 20, active: true },
    { id: 'LOP02', name: 'HIIT Burn', trainerId: 'HLV02', day: 'Thứ 4', start: '19:30', end: '20:30', capacity: 15, active: true },
    { id: 'LOP03', name: 'Boxing cơ bản', trainerId: 'HLV03', day: 'Thứ 6', start: '18:30', end: '19:30', capacity: 20, active: true },
  ],
  subscriptions: [],
  registrations: [],
  users: [
    { id: 'USR01', username: 'admin', name: 'Quản lý CoreFit', role: 'Quản lý', active: true },
    { id: 'USR02', username: 'le.tan', name: 'Nhân viên lễ tân', role: 'Lễ tân', active: true },
    { id: 'USR03', username: 'huan.luyen', name: 'Huấn luyện viên', role: 'Huấn luyện viên', active: true },
  ],
  logs: [],
}

export function todayText() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function dateOffset(start, days) {
  const date = new Date(`${start}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + Number(days))
  return date.toISOString().slice(0, 10)
}

export function loadState() {
  let saved
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    saved = null
  }

  const data = { ...structuredClone(initialState), ...(saved || {}) }
  for (const key of Object.keys(initialState)) {
    if (!Array.isArray(data[key])) data[key] = structuredClone(initialState[key])
  }

  const today = todayText()
  if (!data.subscriptions.length) {
    const [premium, gold, basic] = data.packages
    if (premium && gold && basic) {
      data.subscriptions.push(
        { id: 'DKG0001', memberId: 'HV0001', packageId: premium.id, startDate: dateOffset(today, -90), endDate: dateOffset(today, 275), cancelled: false, price: premium.price },
        { id: 'DKG0002', memberId: 'HV0002', packageId: gold.id, startDate: dateOffset(today, -175), endDate: dateOffset(today, 5), cancelled: false, price: gold.price },
        { id: 'DKG0003', memberId: 'HV0003', packageId: basic.id, startDate: dateOffset(today, -60), endDate: dateOffset(today, -30), cancelled: false, price: basic.price },
      )
    }
  }
  if (!data.registrations.length) {
    data.registrations.push(
      { id: 'DKL0001', memberId: 'HV0001', classId: 'LOP01', date: today, status: 'Đã đăng ký' },
      { id: 'DKL0002', memberId: 'HV0002', classId: 'LOP02', date: today, status: 'Đã đăng ký' },
      { id: 'DKL0003', memberId: 'HV0003', classId: 'LOP03', date: today, status: 'Đã đăng ký' },
    )
  }
  return data
}

export function money(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export function dateText(value) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN') : '—'
}

export function generateId(prefix, records, key = 'id') {
  let suffix = records.length + 1
  let id = `${prefix}${String(suffix).padStart(4, '0')}`
  while (records.some((record) => record[key] === id)) {
    suffix += 1
    id = `${prefix}${String(suffix).padStart(4, '0')}`
  }
  return id
}

export function filtered(records, values, searchTerm = '') {
  const term = searchTerm.trim().toLocaleLowerCase('vi')
  return term
    ? records.filter((record) => values(record).some((value) => String(value || '').toLocaleLowerCase('vi').includes(term)))
    : records
}

export function getMember(data, id) { return data.members.find((member) => member.id === id) }
export function getPackage(data, id) { return data.packages.find((item) => item.id === id) }
export function getTrainer(data, id) { return data.trainers.find((trainer) => trainer.id === id) }
export function getClass(data, id) { return data.classes.find((item) => item.id === id) }
export function memberName(data, id) { return getMember(data, id)?.name || 'Hội viên không tồn tại' }
export function trainerName(data, id) { return getTrainer(data, id)?.name || 'Chưa phân công' }
export function packageName(data, id) { return getPackage(data, id)?.name || 'Gói đã ngừng' }

export function subscriptionStatus(subscription, today = todayText()) {
  if (subscription.cancelled) return 'Đã hủy'
  if (subscription.startDate > today) return 'Chưa bắt đầu'
  if (subscription.endDate < today) return 'Hết hạn'
  const remaining = Math.ceil((Date.parse(`${subscription.endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000)
  return remaining <= 7 ? 'Sắp hết hạn' : 'Hiệu lực'
}

export function currentSubscription(data, memberId) {
  return data.subscriptions.find((item) => item.memberId === memberId && subscriptionStatus(item) === 'Hiệu lực')
    || data.subscriptions.find((item) => item.memberId === memberId && subscriptionStatus(item) === 'Sắp hết hạn')
}

export function registrationCount(data, classId) {
  return data.registrations.filter((item) => item.classId === classId && item.status === 'Đã đăng ký').length
}

export function classStatus(data, item) {
  const count = registrationCount(data, item.id)
  if (!item.active) return 'Ngừng mở'
  if (count >= item.capacity) return 'Đã đầy'
  if (count / item.capacity >= 0.8) return 'Sắp đầy'
  return 'Còn chỗ'
}

export function canManage(section, role) {
  if (role === 'Quản lý') return true
  if (role === 'Lễ tân') return ['members', 'subscriptions', 'registrations', 'history'].includes(section)
  return false
}

export function roleDescription(role) {
  return ({
    'Quản lý': 'Toàn quyền quản lý danh mục, tài khoản, lớp và báo cáo.',
    'Lễ tân': 'Quản lý hội viên, đăng ký gói và đăng ký lớp.',
    'Huấn luyện viên': 'Tra cứu lớp, lịch dạy và danh sách học viên.',
    'Hội viên': 'Vai trò chỉ xem; không được thay đổi dữ liệu quản lý.',
  })[role]
}

export function getFormFields(type, record, data) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((value) => ({ value, label: value }))
  const optionList = (items, labelOf) => items.map((item) => ({ value: item.id, label: labelOf(item) }))
  const schemas = {
    member: [
      { label: 'Mã hội viên', name: 'id', type: 'text', value: record.id || generateId('HV', data.members), required: true, readOnly: Boolean(record.id), hint: record.id ? 'Mã định danh không thay đổi.' : 'Mã được đề xuất tự động, có thể chỉnh sửa.' },
      { label: 'Họ tên', name: 'name', type: 'text', value: record.name, required: true },
      { label: 'Số điện thoại', name: 'phone', type: 'tel', value: record.phone, required: true },
      { label: 'Email', name: 'email', type: 'email', value: record.email },
    ],
    package: [
      { label: 'Mã gói', name: 'id', type: 'text', value: record.id || generateId('GOI', data.packages), required: true, readOnly: Boolean(record.id) },
      { label: 'Tên gói', name: 'name', type: 'text', value: record.name, required: true },
      { label: 'Giá (đồng)', name: 'price', type: 'number', value: record.price, required: true, min: 1 },
      { label: 'Thời hạn (ngày)', name: 'durationDays', type: 'number', value: record.durationDays, required: true, min: 1 },
    ],
    trainer: [
      { label: 'Mã HLV', name: 'id', type: 'text', value: record.id || generateId('HLV', data.trainers), required: true, readOnly: Boolean(record.id) },
      { label: 'Họ tên', name: 'name', type: 'text', value: record.name, required: true },
      { label: 'Chuyên môn', name: 'specialty', type: 'text', value: record.specialty, required: true },
      { label: 'Điện thoại', name: 'phone', type: 'tel', value: record.phone, required: true },
    ],
    class: [
      { label: 'Mã lớp', name: 'id', type: 'text', value: record.id || generateId('LOP', data.classes), required: true, readOnly: Boolean(record.id) },
      { label: 'Tên lớp', name: 'name', type: 'text', value: record.name, required: true },
      { label: 'Huấn luyện viên', name: 'trainerId', type: 'select', value: record.trainerId || '', options: optionList(data.trainers.filter((item) => item.active || item.id === record.trainerId), (item) => `${item.name} · ${item.specialty}`), required: true },
      { label: 'Ngày học', name: 'day', type: 'select', value: record.day || 'Thứ 2', options: days, required: true },
      { label: 'Giờ bắt đầu', name: 'start', type: 'time', value: record.start || '18:00', required: true },
      { label: 'Giờ kết thúc', name: 'end', type: 'time', value: record.end || '19:00', required: true },
      { label: 'Sức chứa', name: 'capacity', type: 'number', value: record.capacity || 20, required: true, min: 1 },
    ],
    subscription: [
      { label: 'Hội viên', name: 'memberId', type: 'select', value: record.memberId || '', options: optionList(data.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), required: true },
      { label: 'Gói dịch vụ', name: 'packageId', type: 'select', value: record.packageId || '', options: optionList(data.packages.filter((item) => item.active), (item) => `${item.name} · ${money(item.price)}`), required: true },
      { label: 'Ngày bắt đầu', name: 'startDate', type: 'date', value: record.startDate || todayText(), required: true },
    ],
    registration: [
      { label: 'Hội viên', name: 'memberId', type: 'select', value: record.memberId || '', options: optionList(data.members.filter((item) => item.active), (item) => `${item.name} · ${item.id}`), required: true },
      { label: 'Lớp tập', name: 'classId', type: 'select', value: record.classId || '', options: optionList(data.classes.filter((item) => item.active && (item.id === record.classId || registrationCount(data, item.id) < item.capacity)), (item) => `${item.name} · ${registrationCount(data, item.id)}/${item.capacity} · ${item.day} ${item.start}`), required: true },
      { label: 'Ngày đăng ký', name: 'date', type: 'date', value: record.date || todayText(), required: true },
    ],
    user: [
      { label: 'Tên đăng nhập', name: 'username', type: 'text', value: '', required: true },
      { label: 'Họ tên', name: 'name', type: 'text', value: '', required: true },
      { label: 'Vai trò', name: 'role', type: 'select', value: 'Lễ tân', options: roles.map((value) => ({ value, label: value })), required: true },
    ],
  }
  return schemas[type] || []
}

export function exportReport(data) {
  const rows = [['Loại', 'Tên', 'Số lượng', 'Sức chứa', 'Còn chỗ']]
  data.packages.forEach((item) => rows.push(['Gói', item.name, data.subscriptions.filter((subscription) => subscription.packageId === item.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(subscription))).length, '', '']))
  data.classes.forEach((item) => rows.push(['Lớp', item.name, registrationCount(data, item.id), item.capacity, Math.max(item.capacity - registrationCount(data, item.id), 0)]))
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')}`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  link.download = 'corefit-bao-cao.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}