'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Building2, Camera, Cpu, Plus, Pencil, Trash2, RefreshCw, ChevronRight, LayoutDashboard } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

type Tab = 'buildings' | 'dvrs' | 'cameras'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('cameras')
  const [cameras, setCameras] = useState<any[]>([])
  const [buildings, setBuildings] = useState<any[]>([])
  const [dvrs, setDvrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [c, b, d] = await Promise.all([
        fetch('/api/cameras').then(r => r.json()),
        fetch('/api/buildings').then(r => r.json()),
        fetch('/api/dvrs').then(r => r.json()),
      ])
      setCameras(c)
      setBuildings(b)
      setDvrs(d)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const deleteCamera = async (id: string) => {
    if (!confirm('Hapus kamera ini?')) return
    await fetch(`/api/cameras/${id}`, { method: 'DELETE' })
    setCameras(prev => prev.filter(c => c.id !== id))
  }

  const TABS = [
    { key: 'cameras', label: 'Kamera', icon: Camera, count: cameras.length },
    { key: 'buildings', label: 'Gedung', icon: Building2, count: buildings.length },
    { key: 'dvrs', label: 'DVR / NVR', icon: Cpu, count: dvrs.length },
  ] as const

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Link href="/" className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <LayoutDashboard className="w-3 h-3" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: 'var(--text-primary)' }}>Admin Panel</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-700" style={{ color: 'var(--text-primary)' }}>🛠️ Panel Admin</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Kelola data gedung, DVR, dan kamera CCTV</p>
          </div>
          <button onClick={fetchAll} className="glass-btn flex items-center gap-1.5 text-xs">
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === key
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-mono', activeTab === key ? 'bg-cyan-400/20' : 'bg-white/5')}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="glass-card p-0 overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeTab === 'cameras' ? 'Daftar Kamera CCTV' : activeTab === 'buildings' ? 'Daftar Gedung' : 'Daftar DVR / NVR'}
            </h2>
            <button className="glass-btn glass-btn-primary text-xs flex items-center gap-1.5 py-1.5">
              <Plus className="w-3.5 h-3.5" />
              Tambah {activeTab === 'cameras' ? 'Kamera' : activeTab === 'buildings' ? 'Gedung' : 'DVR'}
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Memuat data…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Camera Tab */}
              {activeTab === 'cameras' && (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Nama Kamera</th>
                      <th>Gedung</th>
                      <th>Lantai / Ch</th>
                      <th>DVR</th>
                      <th>Status</th>
                      <th>Dibuat</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cameras.map((cam) => (
                      <tr key={cam.id}>
                        <td>
                          <div className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{cam.name}</div>
                          <div className="text-[10px] font-mono truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{cam.streamUrl}</div>
                        </td>
                        <td className="text-xs">{cam.building?.name?.split('(')[0].trim()}</td>
                        <td className="text-xs font-mono">Lt.{cam.floor} / Ch.{cam.channel}</td>
                        <td className="text-xs">{cam.dvr?.brand ?? <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                        <td>
                          <span className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            cam.status === 'ONLINE' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' :
                            cam.status === 'MAINTENANCE' ? 'bg-amber-400/10 border-amber-400/25 text-amber-400' :
                            'bg-red-400/10 border-red-400/25 text-red-400'
                          )}>
                            {cam.status}
                          </span>
                        </td>
                        <td className="text-xs">{formatDate(cam.createdAt)}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => deleteCamera(cam.id)} className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-red-400/40 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Buildings Tab */}
              {activeTab === 'buildings' && (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama Gedung</th>
                      <th>Jumlah Lantai</th>
                      <th>Jumlah Kamera</th>
                      <th>Dibuat</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildings.map((b) => (
                      <tr key={b.id}>
                        <td className="font-mono text-xs text-cyan-400">{b.code}</td>
                        <td className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</td>
                        <td className="text-xs">{b.floors} lantai</td>
                        <td className="text-xs">{b._count?.cameras ?? b.cameras?.length ?? 0} kamera</td>
                        <td className="text-xs">{formatDate(b.createdAt)}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-red-400/40 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* DVRs Tab */}
              {activeTab === 'dvrs' && (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Nama DVR</th>
                      <th>Brand / Model</th>
                      <th>IP / Domain</th>
                      <th>Port RTSP</th>
                      <th>Channel</th>
                      <th>Kamera Terdaftar</th>
                      <th className="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dvrs.map((d) => (
                      <tr key={d.id}>
                        <td className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{d.name}</td>
                        <td className="text-xs">{d.brand}</td>
                        <td className="text-xs font-mono text-cyan-400">{d.ipOrDomain}</td>
                        <td className="text-xs font-mono">{d.rtspPort}</td>
                        <td className="text-xs">{d.channels} ch</td>
                        <td className="text-xs">{d._count?.cameras ?? 0}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-cyan-400/40 hover:text-cyan-400">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button className="glass-btn w-7 h-7 p-0 flex items-center justify-center hover:border-red-400/40 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
