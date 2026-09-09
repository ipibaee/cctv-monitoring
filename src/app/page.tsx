'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import CameraGrid from '@/components/dashboard/CameraGrid'
import CameraFocusModal from '@/components/dashboard/CameraFocusModal'
import StatsOverview from '@/components/dashboard/StatsOverview'
import QuickSearch from '@/components/dashboard/QuickSearch'
import { Camera, Building, DashboardStats } from '@/types/cctv'
import { Info, Database, Radio } from 'lucide-react'

export default function DashboardPage() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [buildings, setBuildings] = useState<(Building & { cameras: Camera[] })[]>([])
  const [stats, setStats] = useState<DashboardStats>({ total: 0, online: 0, offline: 0, maintenance: 0, favorites: 0 })
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null)
  const [focusedCamera, setFocusedCamera] = useState<Camera | null>(null)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [camsRes, bldgsRes, statsRes] = await Promise.all([
        fetch('/api/cameras'),
        fetch('/api/buildings'),
        fetch('/api/stats'),
      ])

      const isDemo = camsRes.headers.get('x-demo-mode') === 'true'
      setIsDemoMode(isDemo)

      const [camsData, bldgsData, statsData] = await Promise.all([
        camsRes.json(),
        bldgsRes.json(),
        statsRes.json(),
      ])

      if (Array.isArray(camsData)) {
        setCameras(camsData)
      }
      if (Array.isArray(bldgsData)) {
        setBuildings(bldgsData)
      }
      if (statsData && typeof statsData === 'object' && !statsData.error) {
        setStats(statsData)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Poll every 30 seconds for status updates
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      // Optimistic update
      setCameras((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !currentFav } : c))
      )
      setStats((prev) => ({
        ...prev,
        favorites: Math.max(0, prev.favorites + (!currentFav ? 1 : -1)),
      }))

      if (!isDemoMode) {
        await fetch(`/api/cameras/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFavorite: !currentFav }),
        })
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  // Filter cameras safely
  const displayedCameras = (Array.isArray(cameras) ? cameras : []).filter((cam) => {
    const matchBuilding = !selectedBuildingId || cam.buildingId === selectedBuildingId
    const matchSearch =
      !search ||
      cam.name.toLowerCase().includes(search.toLowerCase()) ||
      (cam as any).building?.name?.toLowerCase().includes(search.toLowerCase())
    return matchBuilding && matchSearch
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={setSelectedBuildingId}
        onSelectCamera={setFocusedCamera}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
          {/* Demo Mode Notice Banner */}
          {isDemoMode && (
            <div className="mb-5 p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md flex items-center gap-3 text-xs text-cyan-300">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 shrink-0">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div className="flex-1 leading-relaxed">
                <span className="font-semibold text-white">Mode Demo Simulasi Aktif:</span> Database Neon Tech / Relay DVR lokal Anda belum dihubungkan. Dashboard saat ini menampilkan <strong>12 kamera simulasi (HLS test stream)</strong> dan 4 gedung demo agar Anda dapat langsung menguji fungsionalitas UI.
              </div>
            </div>
          )}

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <StatsOverview stats={stats} />
          )}

          {/* Search & title bar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div>
              <h1 className="text-lg font-700 leading-tight" style={{ color: 'var(--text-primary)' }}>
                {selectedBuildingId
                  ? buildings.find((b) => b.id === selectedBuildingId)?.name ?? 'Live Monitor'
                  : 'Live Monitor'}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {displayedCameras.length} kamera ditampilkan
              </p>
            </div>
            <QuickSearch
              value={search}
              onChange={setSearch}
              className="flex-1 max-w-sm ml-auto"
            />
          </div>

          {/* Camera Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton rounded-2xl" style={{ aspectRatio: '16/9' }} />
              ))}
            </div>
          ) : (
            <CameraGrid
              cameras={displayedCameras}
              onCameraClick={setFocusedCamera}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>
      </div>

      {/* Camera Focus Modal */}
      {focusedCamera && (
        <CameraFocusModal
          camera={focusedCamera as any}
          onClose={() => setFocusedCamera(null)}
        />
      )}
    </div>
  )
}
