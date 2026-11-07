import { useEffect, useRef } from 'react'

const titles = {
  member: ['Thêm hội viên', 'Cập nhật hội viên'],
  package: ['Thêm gói dịch vụ', 'Cập nhật gói dịch vụ'],
  trainer: ['Thêm huấn luyện viên', 'Cập nhật huấn luyện viên'],
  class: ['Tạo lớp tập', 'Cập nhật lớp tập'],
  subscription: ['Đăng ký gói dịch vụ', 'Đăng ký gói dịch vụ'],
  registration: ['Đăng ký lớp cho hội viên', 'Chuyển hội viên sang lớp khác'],
  user: ['Tạo tài khoản người dùng', 'Tạo tài khoản người dùng'],
}

function EntityDialog({ dialog, fields, onClose, onSubmit }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!dialog) return undefined
    const element = dialogRef.current
    if (element && !element.open) element.showModal()
    return () => {
      if (element?.open) element.close()
    }
  }, [dialog])

  if (!dialog) return null
  const [createTitle, editTitle] = titles[dialog.type] || ['Tạo mới', 'Cập nhật']
  const title = dialog.record.id ? editTitle : createTitle

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(Object.fromEntries(new FormData(event.currentTarget).entries()))
  }

  return (
    <dialog
      className="form-dialog"
      ref={dialogRef}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      onClose={onClose}
    >
      <form className="form-dialog-content" onSubmit={handleSubmit}>
        <div className="dialog-heading">
          <div><p className="mini-label">CoreFit</p><h3>{title}</h3></div>
          <button className="icon-button" type="button" aria-label="Đóng" onClick={onClose}>×</button>
        </div>
        <div className="form-grid">
          {fields.map((field) => (
            <label className="form-field" key={field.name}>
              <span>{field.label}{field.required ? ' *' : ''}</span>
              {field.type === 'select' ? (
                <select name={field.name} defaultValue={field.value} required={field.required}>
                  {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  defaultValue={field.value ?? ''}
                  required={field.required}
                  readOnly={field.readOnly}
                  min={field.min}
                />
              )}
              {field.hint && <small className="field-hint">{field.hint}</small>}
            </label>
          ))}
        </div>
        <div className="dialog-actions">
          <button className="secondary-btn" type="button" onClick={onClose}>Hủy</button>
          <button className="primary-btn" type="submit">Lưu</button>
        </div>
      </form>
    </dialog>
  )
}

export default EntityDialog