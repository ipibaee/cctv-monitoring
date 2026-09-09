'use client'

import { ShieldCheck, Cctv, Menu, X, LayoutGrid, PlaySquare, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Live Monitor', icon: LayoutGrid },
  { href: '/playback', label: 'Playback', icon: PlaySquare },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname()
  const [time, setTime] = useState(new Date())

  // Update time every second
  if (typeof window !== 'undefined') {
    setTimeout(() => setTime(new Date()), 1000)
  }

  return (
    <header className="glass-header sticky top-0 z-30 h-16 flex items-center px-4 gap-4">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onMenuToggle}
        className="glass-btn w-9 h-9 p-0 flex items-center justify-center md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-400/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-all">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-bg-primary animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-700 tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            VisiGuard
          </div>
          <div className="text-[10px] tracking-wider font-medium uppercase" style={{ color: 'var(--accent-cyan)' }}>
            CCTV Monitor
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1 ml-6">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              pathname === href
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Clock */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-bg)' }}>
        <Cctv className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          {time.toLocaleTimeString('id-ID', { hour12: false })}
        </span>
      </div>

      <ThemeToggle />
    </header>
  )
}
