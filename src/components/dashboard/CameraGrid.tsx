'use client'

import { LayoutGrid, Grid2X2, Grid3X3, Maximize, Star, Camera, Wifi, WifiOff } from 'lucide-react'
import { Camera as CameraType } from '@/types/cctv'
import CameraCard from './CameraCard'
import { cn, gridColsClass } from '@/lib/utils'
import { useState } from 'react'

interface CameraGridProps {
  cameras: (CameraType & { building?: { name: string } })[]
  onCameraClick: (camera: CameraType) => void
  onToggleFavorite: (id: string, current: boolean) => void
}

const LAYOUTS = [
  { value: 1, icon: Maximize, label: '1×1' },
  { value: 2, icon: Grid2X2, label: '2×2' },
  { value: 3, icon: Grid3X3, label: '3×3' },
  { value: 4, icon: LayoutGrid, label: '4×4' },
]

type FilterType = 'all' | 'online' | 'offline' | 'favorites'

export default function CameraGrid({ cameras, onCameraClick, onToggleFavorite }: CameraGridProps) {
  const [layout, setLayout] = useState<number>(2)
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredCameras = cameras.filter((cam) => {
    if (filter === 'online') return cam.status === 'ONLINE'
    if (filter === 'offline') return cam.status !== 'ONLINE'
    if (filter === 'favorites') return cam.isFavorite
    return true
  })

  const onlineCount = cameras.filter((c) => c.status === 'ONLINE').length
  const offlineCount = cameras.filter((c) => c.status !== 'ONLINE').length
  const favCount = cameras.filter((c) => c.isFavorite).length

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all', label: 'Semua', count: cameras.length, icon: Camera },
            { key: 'online', label: 'Online', count: onlineCount, icon: Wifi },
            { key: 'offline', label: 'Offline', count: offlineCount, icon: WifiOff },
            { key: 'favorites', label: 'Favorit', count: favCount, icon: Star },
          ].map(({ key, label, count, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
                filter === key
                  ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                  : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                filter === key ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/5 text-[var(--text-muted)]'
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid layout toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          {LAYOUTS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setLayout(value)}
              title={`Grid ${label}`}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 tooltip',
                layout === value
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'
              )}
              data-tip={label}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Camera grid */}
      {filteredCameras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl border flex items-center justify-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
            <Camera className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tidak ada kamera ditemukan</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Coba ubah filter atau tambahkan kamera via Admin</p>
        </div>
      ) : (
        <div className={cn('grid gap-3', gridColsClass(layout))}>
          {filteredCameras.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onClick={() => onCameraClick(camera)}
              onToggleFavorite={onToggleFavorite}
              compact={layout === 4}
            />
          ))}
        </div>
      )}
    </div>
  )
}
