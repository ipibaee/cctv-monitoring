'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface QuickSearchProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export default function QuickSearch({ value, onChange, placeholder = 'Cari kamera, gedung, lantai…', className }: QuickSearchProps) {
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('quick-search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div
      className={cn(
        'relative flex items-center gap-2 transition-all duration-200',
        className
      )}
    >
      <Search
        className={cn(
          'absolute left-3 w-4 h-4 transition-colors duration-200 pointer-events-none',
          focused ? 'text-cyan-400' : 'text-[var(--text-muted)]'
        )}
      />
      <input
        id="quick-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="glass-input pl-9 pr-20"
        style={focused ? { borderColor: 'rgba(6,182,212,0.5)', boxShadow: '0 0 0 3px rgba(6,182,212,0.08)' } : {}}
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {value && (
          <button onClick={() => onChange('')} className="w-4 h-4 rounded flex items-center justify-center hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="w-3 h-3" />
          </button>
        )}
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          ⌘K
        </span>
      </div>
    </div>
  )
}
