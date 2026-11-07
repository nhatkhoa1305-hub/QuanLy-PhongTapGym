import { useEffect } from 'react'

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => onDismiss(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && <div className={`toast ${toast.type === 'error' ? 'error' : ''}`} role="status">{toast.message}</div>}
    </div>
  )
}

export default Toast