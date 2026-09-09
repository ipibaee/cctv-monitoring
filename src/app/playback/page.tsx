'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Calendar, Clock, PlayCircle, SkipBack, SkipForward, Pause, Play, Building2, Camera, ChevronDown } from 'lucide-react'
import VideoPlayer from '@/components/player/VideoPlayer'

export default function PlaybackPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [selectedHour, setSelectedHour] = useState('08')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cameraId, setCameraId] = useState<string>('')
  const [cameraList] = useState([
    { id: 'cam1', name: 'Ruang Kelas X-IPA 1', building: 'Gedung A', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 'cam2', name: 'Lab Komputer 1', building: 'Gedung B', streamUrl: 'https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8' },
    { id: 'cam3', name: 'Lobi Utama', building: 'Gedung C', streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    { id: 'cam4', name: 'Lapangan Utama', building: 'Gedung D', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  ])

  const selectedCam = cameraList.find((c) => c.id === cameraId)

  // Simulate timeline progress
  const handlePlay = () => {
    setIsPlaying(true)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setIsPlaying(false); clearInterval(interval); return 100 }
        return p + 0.5
      })
    }, 200)
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

  // Calculate "recording period" from selected datetime
  const startTime = `${selectedDate} ${selectedHour}:${selectedMinute}:00`
  const endTime = `${selectedDate} ${String(parseInt(selectedHour) + 1).padStart(2, '0')}:${selectedMinute}:00`

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-xl font-700" style={{ color: 'var(--text-primary)' }}>
            🎬 Playback Rekaman
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Pilih kamera, tanggal, dan jam untuk memutar ulang rekaman dari DVR.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="glass-card p-5 space-y-5">
            <h2 className="text-sm font-600 flex items-center gap-2" style={{ color: 'var(--accent-cyan)' }}>
              <Camera className="w-4 h-4" /> Pengaturan Playback
            </h2>

            {/* Camera selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Pilih Kamera
              </label>
              <div className="relative">
                <select
                  value={cameraId}
                  onChange={(e) => setCameraId(e.target.value)}
                  className="glass-input appearance-none pr-8"
                  style={{ color: cameraId ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  <option value="">-- Pilih Kamera --</option>
                  {cameraList.map((cam) => (
                    <option key={cam.id} value={cam.id} style={{ background: '#0B0F19' }}>
                      {cam.name} ({cam.building})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Date picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="w-3.5 h-3.5" /> Tanggal Rekaman
              </label>
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-input"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Time pickers */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3.5 h-3.5" /> Waktu Mulai
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="glass-input appearance-none pr-6 text-center font-mono">
                    {hours.map((h) => <option key={h} value={h} style={{ background: '#0B0F19' }}>{h}</option>)}
                  </select>
                </div>
                <span className="flex items-center font-mono font-700 text-lg" style={{ color: 'var(--accent-cyan)' }}>:</span>
                <div className="relative flex-1">
                  <select value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)} className="glass-input appearance-none pr-6 text-center font-mono">
                    {minutes.map((m) => <option key={m} value={m} style={{ background: '#0B0F19' }}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Period info */}
            <div className="p-3 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Periode Rekaman</p>
              <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{startTime}</p>
              <p className="text-[10px] my-0.5" style={{ color: 'var(--text-muted)' }}>sampai</p>
              <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{endTime}</p>
            </div>

            {/* Load Button */}
            <button
              onClick={() => { setProgress(0); setIsPlaying(false); if (cameraId) setTimeout(handlePlay, 500) }}
              disabled={!cameraId}
              className="glass-btn glass-btn-primary w-full justify-center py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PlayCircle className="w-4 h-4" />
              Muat & Putar Rekaman
            </button>
          </div>

          {/* Video Playback */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card overflow-hidden">
              <div className="relative bg-[#070A11]" style={{ aspectRatio: '16/9' }}>
                {selectedCam ? (
                  <VideoPlayer streamUrl={selectedCam.streamUrl} autoPlay muted={false} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl border flex items-center justify-center" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                      <PlayCircle className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pilih kamera dan atur waktu untuk memulai playback</p>
                  </div>
                )}
                {/* Playback mode badge */}
                {selectedCam && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-700 uppercase tracking-widest" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa' }}>
                      ⏪ PLAYBACK
                    </span>
                  </div>
                )}
              </div>

              {/* Playback controls */}
              <div className="p-4 space-y-3">
                {/* Timeline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    <span>{selectedHour}:{selectedMinute}:00</span>
                    <span>{Math.round(progress)}%</span>
                    <span>{String(parseInt(selectedHour) + 1).padStart(2, '0')}:{selectedMinute}:00</span>
                  </div>
                  <div className="timeline-track cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pct = ((e.clientX - rect.left) / rect.width) * 100
                    setProgress(Math.max(0, Math.min(100, pct)))
                  }}>
                    <div className="timeline-fill" style={{ width: `${progress}%` }} />
                    {/* Thumb */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 shadow-lg transition-all" style={{ left: `calc(${progress}% - 7px)` }} />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setProgress(Math.max(0, progress - 10))} className="glass-btn w-9 h-9 p-0 flex items-center justify-center">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => isPlaying ? setIsPlaying(false) : handlePlay()}
                    className="glass-btn glass-btn-primary w-12 h-12 p-0 flex items-center justify-center rounded-full"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setProgress(Math.min(100, progress + 10))} className="glass-btn w-9 h-9 p-0 flex items-center justify-center">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="glass-card p-4">
              <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent-violet)' }}>
                <Building2 className="w-3.5 h-3.5" /> Catatan Arsitektur Playback
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Fitur playback memerlukan dukungan dari DVR/NVR. Sistem mengirim request ke relay server (go2rtc/MediaMTX) dengan parameter waktu mulai & durasi. DVR Hikvision mendukung via <code className="text-cyan-400 text-[10px]">RTSP?starttime=&endtime=</code>, sementara Dahua via API HTTP-nya.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
