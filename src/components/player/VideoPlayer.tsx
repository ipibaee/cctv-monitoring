'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { WifiOff, RefreshCw, Play } from 'lucide-react'

interface VideoPlayerProps {
  streamUrl: string
  autoPlay?: boolean
  muted?: boolean
  className?: string
  onError?: () => void
  onPlay?: () => void
}

// Deteksi tipe stream dari URL
function detectStreamType(url: string): 'hls' | 'mjpeg' | 'webrtc-iframe' | 'mp4' {
  if (!url) return 'hls'
  const u = url.toLowerCase()
  if (u.includes('stream.mjpeg') || u.includes('.mjpeg') || u.includes('snapshot.cgi') || u.includes('/video.cgi')) return 'mjpeg'
  if (u.includes('webrtc.html') || u.includes('webrtc=1') || u.includes('/webrtc')) return 'webrtc-iframe'
  if (u.includes('.mp4')) return 'mp4'
  // Default: HLS (m3u8, /stream, /live, go2rtc /api/stream)
  return 'hls'
}

function ErrorOverlay({ onRetry, retrying, retryCount }: { onRetry: () => void; retrying: boolean; retryCount: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
      <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <WifiOff className="w-5 h-5 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold text-red-300 mb-0.5">Stream Tidak Tersedia</p>
        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
          {retryCount === 0 ? 'Pastikan go2rtc aktif di PC sekolah' : `Gagal setelah ${retryCount}x percobaan`}
        </p>
      </div>
      <button onClick={onRetry} className="glass-btn text-[11px] py-1 px-3 flex items-center gap-1.5 text-cyan-400">
        <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
        Coba Lagi
      </button>
    </div>
  )
}

export default function VideoPlayer({
  streamUrl,
  autoPlay = true,
  muted = true,
  className = '',
  onError,
  onPlay,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const streamType = detectStreamType(streamUrl)

  const loadStream = (url: string) => {
    const video = videoRef.current
    if (!video) return

    setError(false)
    setLoading(true)

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
      })

      hls.loadSource(url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        if (autoPlay) video.play().catch(() => {})
        onPlay?.()
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setLoading(false)
          setError(true)
          onError?.()
        }
      })

      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS — Safari / iOS
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        setLoading(false)
        if (autoPlay) video.play().catch(() => {})
        onPlay?.()
      }, { once: true })
      video.addEventListener('error', () => {
        setLoading(false)
        setError(true)
        onError?.()
      }, { once: true })
    } else if (streamType === 'mp4') {
      video.src = url
      video.addEventListener('canplay', () => {
        setLoading(false)
        onPlay?.()
      }, { once: true })
      video.addEventListener('error', () => {
        setLoading(false)
        setError(true)
        onError?.()
      }, { once: true })
      if (autoPlay) video.play().catch(() => {})
    } else {
      setLoading(false)
      setError(true)
    }
  }

  useEffect(() => {
    if (streamType === 'hls' || streamType === 'mp4') {
      loadStream(streamUrl)
    } else {
      setLoading(false)
    }
    return () => {
      if (hlsRef.current) hlsRef.current.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl])

  const handleRetry = () => {
    setRetrying(true)
    setRetryCount(c => c + 1)
    setTimeout(() => {
      setRetrying(false)
      loadStream(streamUrl)
    }, 1500)
  }

  // ─── MJPEG mode (selalu works, latency ~1-2s, bagus untuk Hikvision/Dahua via HTTP port) ───
  if (streamType === 'mjpeg') {
    return (
      <div className={`relative bg-[#070A11] w-full h-full flex items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${streamUrl}${streamUrl.includes('?') ? '&' : '?'}t=${retryCount}`}
          alt="CCTV MJPEG Stream"
          className="w-full h-full object-cover"
          onLoad={() => { setLoading(false); onPlay?.() }}
          onError={() => { setLoading(false); setError(true); onError?.() }}
        />
        {!error && (
          <div className="absolute top-2 left-2 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] text-amber-300 font-mono">MJPEG</span>
            </div>
          </div>
        )}
        {error && <ErrorOverlay onRetry={handleRetry} retrying={retrying} retryCount={retryCount} />}
      </div>
    )
  }

  // ─── WebRTC Iframe mode via go2rtc (latency <1s) ───
  if (streamType === 'webrtc-iframe') {
    return (
      <div className={`relative bg-[#070A11] w-full h-full ${className}`}>
        <iframe
          src={streamUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          title="CCTV WebRTC Stream"
          onLoad={() => { setLoading(false); onPlay?.() }}
        />
        <div className="absolute top-2 left-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-300 font-mono">WebRTC</span>
          </div>
        </div>
      </div>
    )
  }

  // ─── HLS / MP4 mode ───
  return (
    <div className={`relative bg-[#070A11] w-full h-full flex items-center justify-center ${className}`}>
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        autoPlay={autoPlay}
        loop={false}
        className="w-full h-full object-cover"
        style={{ display: error ? 'none' : 'block' }}
      />

      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Menghubungkan…</span>
        </div>
      )}

      {error && <ErrorOverlay onRetry={handleRetry} retrying={retrying} retryCount={retryCount} />}

      {!error && !loading && (
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Play className="w-2.5 h-2.5 text-emerald-400" />
          </div>
        </div>
      )}
    </div>
  )
}
