'use client'

import { X, Maximize2, Minimize2, Download, RefreshCw, Info, Building2, Cpu, Layers, Hash } from 'lucide-react'
import { Camera } from '@/types/cctv'
import VideoPlayer from '@/components/player/VideoPlayer'
import { useEffect, useRef, useState } from 'react'
import { cn, formatDate } from '@/lib/utils'

interface CameraFocusModalProps {
  camera: Camera & {
    building?: { name: string; code: string }
    dvr?: { name: string; brand: string; ipOrDomain: string } | null
  }
  onClose: () => void
}

export default function CameraFocusModal({ camera, onClose }: CameraFocusModalProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const isOnline = camera.status === 'ONLINE'

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSnapshot = async () => {
    setSnapping(true)
    await new Promise((r) => setTimeout(r, 800))
    // In a real system, this would call /api/snapshot?cameraId=... and return a JPEG
    const link = document.createElement('a')
    link.download = `snapshot-${camera.name.replace(/ /g, '_')}-${Date.now()}.jpg`
    link.href = '#' // would be the snapshot URL
    link.click()
    setSnapping(false)
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={cn(
          'relative flex flex-col glass-card transition-all duration-300 fade-in',
          fullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-4xl mx-4 max-h-[90vh]'
        )}
        style={{ background: 'rgba(7,10,17,0.92)', borderColor: 'rgba(6,182,212,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                <span className="text-base">📷</span>
              </div>
              {isOnline && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070A11] animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-700 truncate" style={{ color: 'var(--text-primary)' }}>
                {camera.name}
              </h2>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                {camera.building?.name?.split('(')[0].trim()} · Lantai {camera.floor} · Ch.{camera.channel}
              </p>
            </div>
            {isOnline ? (
              <span className="badge-live ml-2 flex-shrink-0">
                <span className="dot" /> LIVE
              </span>
            ) : (
              <span className="badge-offline ml-2 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> OFFLINE
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={cn('glass-btn w-8 h-8 p-0 flex items-center justify-center', showInfo && 'border-cyan-400/40 text-cyan-400')}
              title="Info Detail"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSnapshot}
              className="glass-btn w-8 h-8 p-0 flex items-center justify-center"
              title="Ambil Snapshot"
            >
              <Download className={cn('w-3.5 h-3.5', snapping && 'animate-bounce text-cyan-400')} />
            </button>
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="glass-btn w-8 h-8 p-0 flex items-center justify-center"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="glass-btn w-8 h-8 p-0 flex items-center justify-center hover:border-red-400/40 hover:text-red-400"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video */}
          <div ref={videoContainerRef} className="flex-1 relative bg-[#070A11] min-h-[280px]">
            <VideoPlayer
              streamUrl={camera.streamUrl}
              autoPlay
              muted={false}
              className="w-full h-full"
            />
          </div>

          {/* Info panel */}
          {showInfo && (
            <div className="w-64 flex-shrink-0 border-l overflow-y-auto" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(11,15,25,0.7)' }}>
              <div className="p-4 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
                  Detail Kamera
                </h3>

                <InfoRow icon={Building2} label="Gedung" value={camera.building?.name?.split('(')[0].trim() ?? '-'} />
                <InfoRow icon={Layers} label="Lantai" value={`Lantai ${camera.floor}`} />
                <InfoRow icon={Hash} label="Channel" value={`Ch. ${camera.channel}`} />

                {camera.dvr && (
                  <>
                    <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-violet)' }}>
                        DVR / NVR
                      </h3>
                      <InfoRow icon={Cpu} label="Nama" value={camera.dvr.name} />
                      <InfoRow icon={Cpu} label="Brand" value={camera.dvr.brand} />
                      <InfoRow icon={Cpu} label="Host" value={camera.dvr.ipOrDomain} />
                    </div>
                  </>
                )}

                {camera.rtspUrl && (
                  <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                      RTSP URL
                    </h3>
                    <p className="text-[9px] font-mono break-all p-2 rounded-lg" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                      {camera.rtspUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                    Ditambahkan: {formatDate(camera.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
      <div>
        <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{value}</p>
      </div>
    </div>
  )
}
