'use client'

import { Building2, Camera, Star, ChevronDown, ChevronRight, X, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Building, Camera as CameraType } from '@/types/cctv'
import { useState } from 'react'

interface SidebarProps {
  buildings: (Building & { cameras: CameraType[] })[]
  selectedBuildingId: string | null
  onSelectBuilding: (id: string | null) => void
  onSelectCamera: (camera: CameraType) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  onSelectCamera,
  isOpen,
  onClose,
}: SidebarProps) {
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(
    new Set(buildings.map((b) => b.id))
  )

  const toggleBuilding = (id: string) => {
    const next = new Set(expandedBuildings)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedBuildings(next)
  }

  const totalOnline = buildings.flatMap(b => b.cameras).filter(c => c.status === 'ONLINE').length
  const totalCams = buildings.flatMap(b => b.cameras).length

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'glass-sidebar fixed md:relative top-0 left-0 bottom-0 z-40 md:z-auto',
          'w-[280px] flex flex-col overflow-hidden',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--accent-cyan)' }}>
              Lokasi Kamera
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {totalOnline}/{totalCams} Online
            </div>
          </div>
          <button onClick={onClose} className="glass-btn w-8 h-8 p-0 flex items-center justify-center md:hidden">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* All cameras shortcut */}
        <div className="px-3 pt-3">
          <button
            onClick={() => onSelectBuilding(null)}
            className={cn('sidebar-nav-item w-full', selectedBuildingId === null && 'active')}
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span>Semua Kamera</span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)' }}>
              {totalCams}
            </span>
          </button>
        </div>

        {/* Buildings list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 space-y-1">
          {buildings.map((building) => {
            const onlineCount = building.cameras.filter((c) => c.status === 'ONLINE').length
            const isExpanded = expandedBuildings.has(building.id)
            const isSelected = selectedBuildingId === building.id

            return (
              <div key={building.id}>
                {/* Building row */}
                <div
                  className={cn('sidebar-nav-item group', isSelected && !isExpanded && 'active')}
                  onClick={() => {
                    onSelectBuilding(building.id)
                    toggleBuilding(building.id)
                  }}
                >
                  <Building2 className="w-4 h-4 shrink-0 text-violet-400" />
                  <span className="flex-1 truncate">{building.name.split('(')[0].trim()}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-xs font-medium', onlineCount > 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {onlineCount}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    )}
                  </div>
                </div>

                {/* Camera list under building */}
                {isExpanded && (
                  <div className="pl-6 mt-0.5 space-y-0.5">
                    {building.cameras.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => onSelectCamera(cam)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5 group/cam"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span className="relative flex-shrink-0">
                          {cam.status === 'ONLINE' ? (
                            <Wifi className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-red-400" />
                          )}
                        </span>
                        <span className="truncate text-left flex-1">{cam.name}</span>
                        {cam.isFavorite && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 opacity-80 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            VisiGuard v1.0 · {buildings.length} Gedung
          </div>
        </div>
      </aside>
    </>
  )
}
