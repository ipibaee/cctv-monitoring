'use client'

import { Camera, Wifi, WifiOff, Star, Wrench } from 'lucide-react'
import { DashboardStats } from '@/types/cctv'

interface StatsOverviewProps {
  stats: DashboardStats
}

const STAT_ITEMS = [
  {
    key: 'total' as const,
    label: 'Total Kamera',
    icon: Camera,
    color: 'text-cyan-400',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.15)',
  },
  {
    key: 'online' as const,
    label: 'Online',
    icon: Wifi,
    color: 'text-emerald-400',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.15)',
  },
  {
    key: 'offline' as const,
    label: 'Offline',
    icon: WifiOff,
    color: 'text-red-400',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.15)',
  },
  {
    key: 'maintenance' as const,
    label: 'Maintenance',
    icon: Wrench,
    color: 'text-amber-400',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    key: 'favorites' as const,
    label: 'Favorit',
    icon: Star,
    color: 'text-amber-400',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.15)',
  },
]

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg, border }) => (
        <div
          key={key}
          className="stat-card flex flex-col gap-2"
          style={{ background: bg, borderColor: border }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {label}
            </span>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className={`text-2xl font-700 ${color}`}>
            {stats[key]}
          </div>
        </div>
      ))}
    </div>
  )
}
