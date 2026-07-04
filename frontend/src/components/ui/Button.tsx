import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:
    'bg-zinc-100 text-zinc-900 hover:bg-zinc-300 focus:ring-zinc-500',
  secondary:
    'border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 focus:ring-zinc-500',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
  ghost:
    'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 focus:ring-zinc-500',
}

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
