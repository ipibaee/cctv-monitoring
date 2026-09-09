import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_STATS } from '@/lib/mockData'

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
    console.warn('[API] Database not connected. Falling back to Demo Mode stats.')
    return NextResponse.json(MOCK_STATS, {
      headers: { 'X-Demo-Mode': 'true' }
    })
  }
}
