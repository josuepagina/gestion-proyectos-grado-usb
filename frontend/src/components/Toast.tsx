import { useEffect } from 'react'
import { Toast as ToastType, useToastStore } from '../store/toastStore'
import './Toast.css'

interface ToastProps {
  toast: ToastType
}

export default function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, removeToast])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  const handleClose = () => {
    removeToast(toast.id)
  }

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
        type="button"
      >
        ×
      </button>
    </div>
  )
}

