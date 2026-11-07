import { useEffect, useState } from 'react'
import {
  canManage,
  currentSubscription,
  dateOffset,
  exportReport,
  generateId,
  getClass,
  getFormFields,
  getMember,
  getPackage,
  getTrainer,
  loadState,
  memberName,
  registrationCount,
  STORAGE_KEY,
  subscriptionStatus,
  todayText,
} from '../utils/gym.js'

const createTypes = {
  members: 'member',
  packages: 'package',
  classes: 'class',
  trainers: 'trainer',
  users: 'user',
  subscriptions: 'subscription',
  registrations: 'registration',
}

const collections = {
  member: 'members',
  package: 'packages',
  trainer: 'trainers',
  class: 'classes',
  registration: 'registrations',
}

const sections = {
  member: 'members',
  package: 'packages',
  trainer: 'trainers',
  class: 'classes',
  subscription: 'subscriptions',
  registration: 'registrations',
  user: 'users',
}

function addActivity(data, action, detail) {
  data.logs.unshift({ id: crypto.randomUUID(), action, detail, at: new Date().toISOString() })
  data.logs = data.logs.slice(0, 300)
}

function errorMessage(message) {
  return { message, type: 'error', id: Date.now() }
}

export default function useGymState() {
  const [data, setData] = useState(loadState)
  const [currentView, setCurrentView] = useState('dashboard')
  const [role, setRole] = useState(() => localStorage.getItem('corefit-role') || 'Quản lý')
  const [searchTerm, setSearchTerm] = useState('')
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)
  const [historyMemberId, setHistoryMemberId] = useState('')
  const [rosterClassId, setRosterClassId] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('corefit-role', role)
  }, [role])

  function notify(message, type = 'success') {
    setToast({ message, type, id: Date.now() })
  }

  function navigate(view) {
    setCurrentView(view)
    setSearchTerm('')
    setHistoryMemberId('')
    setRosterClassId('')
  }

  function openForm(type, id = '') {
    const section = sections[type]
    if (!canManage(section, role)) {
      notify('Vai trò hiện tại không được phép thực hiện thao tác này.', 'error')
      return
    }

    const collection = collections[type]
    const record = id && collection ? data[collection].find((item) => item.id === id) : {}
    const initialRecord = { ...(record || {}) }
    if (type === 'subscription' && id) {
      const existing = currentSubscription(data, id)
      initialRecord.memberId = id
      initialRecord.startDate = existing ? dateOffset(existing.endDate, 1) : todayText()
    }
    setDialog({ type, record: initialRecord })
  }

  function submitForm(values) {
    if (!dialog) return
    const { type, record } = dialog
    const editId = record.id || ''
    if (!canManage(sections[type], role)) {
      notify('Vai trò hiện tại không được phép thực hiện thao tác này.', 'error')
      return
    }

    const next = structuredClone(data)
    const targetCollection = collections[type]
    if (targetCollection) {
      const collection = next[targetCollection]
      if (collection.some((item) => item.id === values.id && item.id !== editId)) {
        setToast(errorMessage('Mã định danh đã tồn tại.'))
        return
      }
      if (type === 'class') {
        if (values.end <= values.start) {
          setToast(errorMessage('Giờ kết thúc phải sau giờ bắt đầu.'))
          return
        }
        const occupied = editId ? registrationCount(next, editId) : 0
        if (Number(values.capacity) < occupied) {
          setToast(errorMessage(`Sức chứa không thể nhỏ hơn ${occupied} hội viên đã đăng ký.`))
          return
        }
        const conflict = next.classes.some((item) => item.id !== editId && item.active && item.trainerId === values.trainerId && item.day === values.day && values.start < item.end && values.end > item.start)
        if (conflict) {
          setToast(errorMessage('Huấn luyện viên đã có lớp trùng thời gian.'))
          return
        }
      }
      const numericFields = type === 'package' ? ['price', 'durationDays'] : type === 'class' ? ['capacity'] : []
      numericFields.forEach((key) => { values[key] = Number(values[key]) })
      if (numericFields.some((key) => values[key] <= 0)) {
        setToast(errorMessage('Giá, thời hạn và sức chứa phải lớn hơn 0.'))
        return
      }
      const existing = editId ? collection.find((item) => item.id === editId) : null
      const normalized = { ...values, active: existing ? existing.active : true }
      if (existing) Object.assign(existing, normalized)
      else collection.push(normalized)
      addActivity(next, editId ? 'Cập nhật' : 'Tạo mới', `${type}: ${values.name}`)
    } else if (type === 'subscription') {
      const member = getMember(next, values.memberId)
      const packageItem = getPackage(next, values.packageId)
      if (!member?.active || !packageItem?.active) {
        setToast(errorMessage('Hội viên hoặc gói dịch vụ không còn hoạt động.'))
        return
      }
      const existing = currentSubscription(next, member.id)
      const startDate = existing && values.startDate <= existing.endDate ? dateOffset(existing.endDate, 1) : values.startDate
      next.subscriptions.push({ id: generateId('DKG', next.subscriptions), memberId: member.id, packageId: packageItem.id, startDate, endDate: dateOffset(startDate, packageItem.durationDays), cancelled: false, price: packageItem.price })
      addActivity(next, existing ? 'Gia hạn gói' : 'Đăng ký gói', `${member.name} · ${packageItem.name}`)
    } else if (type === 'registration') {
      const member = getMember(next, values.memberId)
      const classItem = getClass(next, values.classId)
      if (!member?.active || !classItem?.active) {
        setToast(errorMessage('Hội viên hoặc lớp không còn hoạt động.'))
        return
      }
      if (!next.subscriptions.some((item) => item.memberId === member.id && ['Hiệu lực', 'Sắp hết hạn'].includes(subscriptionStatus(item)))) {
        setToast(errorMessage('Hội viên cần có gói hiệu lực để đăng ký lớp.'))
        return
      }
      if (next.registrations.some((item) => item.id !== editId && item.memberId === member.id && item.classId === classItem.id && item.status === 'Đã đăng ký')) {
        setToast(errorMessage('Hội viên đã đăng ký lớp này.'))
        return
      }
      const occupied = registrationCount(next, classItem.id) - (editId && next.registrations.find((item) => item.id === editId)?.classId === classItem.id ? 1 : 0)
      if (occupied >= classItem.capacity) {
        setToast(errorMessage('Lớp đã đầy, không thể đăng ký thêm.'))
        return
      }
      if (editId) {
        const previous = next.registrations.find((item) => item.id === editId)
        if (previous) previous.status = 'Đã chuyển lớp'
      }
      next.registrations.push({ id: generateId('DKL', next.registrations), memberId: member.id, classId: classItem.id, date: values.date, status: 'Đã đăng ký' })
      addActivity(next, editId ? 'Chuyển lớp' : 'Đăng ký lớp', `${member.name} · ${classItem.name}`)
    } else if (type === 'user') {
      if (next.users.some((item) => item.username.toLowerCase() === values.username.toLowerCase())) {
        setToast(errorMessage('Tên đăng nhập đã tồn tại.'))
        return
      }
      next.users.push({ id: generateId('USR', next.users), ...values, active: true })
      addActivity(next, 'Tạo tài khoản', `${values.username} · ${values.role}`)
    }

    setData(next)
    setDialog(null)
    notify('Đã lưu dữ liệu.')
  }

  function toggleRecord(collection, id, label) {
    if (!canManage(currentView, role)) return
    const next = structuredClone(data)
    const record = next[collection].find((item) => item.id === id)
    if (!record) return
    record.active = !record.active
    addActivity(next, record.active ? 'Kích hoạt' : 'Ngừng hoạt động', `${label}: ${record.name || record.username}`)
    setData(next)
    notify(record.active ? 'Đã kích hoạt.' : 'Đã chuyển sang trạng thái ngừng hoạt động.')
  }

  function handleAction({ action, id, view }) {
    if (action === 'navigate') navigate(view)
    else if (action === 'create') openForm(createTypes[currentView])
    else if (action === 'edit') openForm(({ members: 'member', packages: 'package', classes: 'class', trainers: 'trainer' })[currentView], id)
    else if (action === 'toggle-member') toggleRecord('members', id, 'Hội viên')
    else if (action === 'toggle-package') toggleRecord('packages', id, 'Gói dịch vụ')
    else if (action === 'toggle-class') toggleRecord('classes', id, 'Lớp tập')
    else if (action === 'toggle-trainer') toggleRecord('trainers', id, 'Huấn luyện viên')
    else if (action === 'toggle-user') toggleRecord('users', id, 'Tài khoản')
    else if (action === 'member-history') {
      setCurrentView('history')
      setSearchTerm('')
      setHistoryMemberId(id)
    } else if (action === 'class-roster') setRosterClassId(id)
    else if (action === 'trainer-schedule') {
      setCurrentView('classes')
      setRosterClassId('')
      setSearchTerm(getTrainer(data, id)?.name || '')
    } else if (action === 'renew') openForm('subscription', id)
    else if (action === 'change-registration') openForm('registration', id)
    else if (action === 'cancel-registration') {
      const next = structuredClone(data)
      const registration = next.registrations.find((item) => item.id === id)
      if (!registration) return
      registration.status = 'Đã hủy'
      addActivity(next, 'Hủy đăng ký lớp', `${memberName(next, registration.memberId)} · ${getClass(next, registration.classId)?.name || ''}`)
      setData(next)
      notify('Đã hủy đăng ký và giải phóng chỗ trong lớp.')
    } else if (action === 'export-report') exportReport(data)
    else if (action === 'back-to-classes') setRosterClassId('')
  }

  function changeRole(nextRole) {
    setRole(nextRole)
    notify(`Đã chuyển sang vai trò ${nextRole}.`)
  }

  const formFields = dialog ? getFormFields(dialog.type, dialog.record, data) : []

  return {
    data,
    currentView,
    role,
    roles: ['Quản lý', 'Lễ tân', 'Huấn luyện viên', 'Hội viên'],
    searchTerm,
    setSearchTerm,
    dialog,
    formFields,
    toast,
    setToast,
    historyMemberId,
    rosterClassId,
    selectHistoryMember: setHistoryMemberId,
    navigate,
    changeRole,
    handleAction,
    openForm,
    closeDialog: () => setDialog(null),
    submitForm,
    canManage: (section = currentView) => canManage(section, role),
  }
}