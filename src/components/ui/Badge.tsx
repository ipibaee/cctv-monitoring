'use client'

import { cn, getStatusBg } from '@/lib/utils'

interface BadgeProps {
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  className?: string
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide',
        getStatusBg(status),
        className
      )}
    >
      {status === 'ONLINE' ? 'Online' : status === 'MAINTENANCE' ? 'Maintenance' : 'Offline'}
    </span>
  )
}

interface GenericBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'red'
  className?: string
}

export function Badge({ children, variant = 'default', className }: GenericBadgeProps) {
  const variantStyles = {
    default: 'bg-white/5 border-white/10 text-[var(--text-secondary)]',
    cyan: 'bg-cyan-400/10 border-cyan-400/25 text-cyan-300',
    violet: 'bg-violet-400/10 border-violet-400/25 text-violet-300',
    emerald: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-300',
    amber: 'bg-amber-400/10 border-amber-400/25 text-amber-300',
    red: 'bg-red-400/10 border-red-400/25 text-red-300',
  }
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', variantStyles[variant], className)}>
      {children}
    </span>
  )
}
