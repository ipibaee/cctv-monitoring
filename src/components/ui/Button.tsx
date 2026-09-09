'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'glass-btn',
          variant === 'primary' && 'glass-btn-primary',
          variant === 'danger' && 'hover:border-red-400/40 hover:text-red-400',
          variant === 'ghost' && 'border-transparent bg-transparent hover:bg-white/5',
          size === 'sm' && 'text-xs py-1 px-2.5',
          size === 'md' && 'text-sm py-1.5 px-3',
          size === 'lg' && 'text-base py-2.5 px-5',
          size === 'icon' && 'w-8 h-8 p-0 flex items-center justify-center',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
