import { X } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

const icons = {
  success: (
    <svg className="h-5 w-5 text-green-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
}

const styles = {
  success: 'bg-green-950/85 border-green-800/40',
  error: 'bg-red-950/85 border-red-800/40',
  info: 'bg-blue-950/85 border-blue-800/40',
}

const textStyles = {
  success: 'text-green-200',
  error: 'text-red-200',
  info: 'text-blue-200',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-2xl animate-slide-in-right ${styles[t.type]}`}
        >
          {icons[t.type]}
          <p className={`text-sm flex-1 leading-relaxed ${textStyles[t.type]}`}>{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className={`shrink-0 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity ${textStyles[t.type]}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
