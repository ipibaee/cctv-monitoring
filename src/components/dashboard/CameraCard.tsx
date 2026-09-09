'use client'

import { Camera } from '@/types/cctv'
import { Star, StarOff, Maximize2, Building2, Layers } from 'lucide-react'
import VideoPlayer from '@/components/player/VideoPlayer'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CameraCardProps {
  camera: Camera & { building?: { name: string } }
  onClick?: () => void
  onToggleFavorite?: (id: string, current: boolean) => void
  compact?: boolean
}

export default function CameraCard({ camera, onClick, onToggleFavorite, compact = false }: CameraCardProps) {
  const [isFav, setIsFav] = useState(camera.isFavorite)
  const isOnline = camera.status === 'ONLINE'
  const isMaintenance = camera.status === 'MAINTENANCE'

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !isFav
    setIsFav(next)
    onToggleFavorite?.(camera.id, !next)
  }

  return (
    <div
      className="camera-card group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Kamera: ${camera.name}`}
    >
      {/* Video area */}
      <div className="video-wrapper">
        {isOnline ? (
          <VideoPlayer
            streamUrl={camera.streamUrl}
            autoPlay
            muted
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#070A11]">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center border',
                isMaintenance
                  ? 'bg-amber-500/10 border-amber-500/25'
                  : 'bg-red-500/10 border-red-500/20'
              )}
            >
              <span className={cn('text-xl', isMaintenance ? 'text-amber-400' : 'text-red-400')}>
                {isMaintenance ? '🔧' : '📵'}
              </span>
            </div>
            <p className={cn('text-[10px] font-semibold', isMaintenance ? 'text-amber-300' : 'text-red-300')}>
              {isMaintenance ? 'Maintenance' : 'Offline'}
            </p>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="overlay" />

        {/* Status badge – top right */}
        <div className="absolute top-2 right-2">
          {isOnline ? (
            <span className="badge-live">
              <span className="dot" />
              LIVE
            </span>
          ) : isMaintenance ? (
            <span className="badge-offline" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              MAINT
            </span>
          ) : (
            <span className="badge-offline">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              OFFLINE
            </span>
          )}
        </div>

        {/* Favorite + expand buttons - bottom right */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFav}
            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
            title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            {isFav ? (
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            ) : (
              <StarOff className="w-3 h-3 text-gray-400" />
            )}
          </button>
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          >
            <Maximize2 className="w-3 h-3 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Camera info */}
      <div className={cn('px-3 py-2.5', compact ? 'py-2' : 'py-2.5')}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
              {camera.name}
            </p>
            {!compact && (
              <div className="flex items-center gap-2 mt-0.5">
                {camera.building && (
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <Building2 className="w-2.5 h-2.5" />
                    {camera.building.name.split('(')[0].trim()}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <Layers className="w-2.5 h-2.5" />
                  Lt. {camera.floor} · Ch. {camera.channel}
                </span>
              </div>
            )}
          </div>
          {isFav && !compact && (
            <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
      </div>
    </div>
  )
}
