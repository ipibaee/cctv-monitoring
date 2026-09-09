import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, online, offline, maintenance, favorites] = await Promise.all([
      prisma.camera.count(),
      prisma.camera.count({ where: { status: 'ONLINE' } }),
      prisma.camera.count({ where: { status: 'OFFLINE' } }),
      prisma.camera.count({ where: { status: 'MAINTENANCE' } }),
      prisma.camera.count({ where: { isFavorite: true } }),
    ])
    return NextResponse.json({ total, online, offline, maintenance, favorites })
  } catch (error) {
    console.error('[API] GET /stats error:', error)
    return NextResponse.json({ error: 'Gagal mengambil statistik' }, { status: 500 })
  }
}
