import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_BUILDINGS, MOCK_CAMERAS } from '@/lib/mockData'

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        cameras: {
          select: { id: true, name: true, status: true, isFavorite: true, floor: true },
          orderBy: { floor: 'asc' },
        },
        _count: { select: { cameras: true } },
      },
      orderBy: { code: 'asc' },
    })
    return NextResponse.json(buildings)
  } catch (error) {
    console.warn('[API] Database not connected. Falling back to Demo Mode mock buildings.')
    const buildingsWithCams = MOCK_BUILDINGS.map(b => ({
      ...b,
      cameras: MOCK_CAMERAS.filter(c => c.buildingId === b.id),
      _count: { cameras: MOCK_CAMERAS.filter(c => c.buildingId === b.id).length }
    }))
    return NextResponse.json(buildingsWithCams, {
      headers: { 'X-Demo-Mode': 'true' }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, floors } = body
    if (!code || !name) return NextResponse.json({ error: 'Kode dan nama gedung wajib diisi' }, { status: 400 })

    const building = await prisma.building.create({
      data: { code, name, floors: floors ?? 3 },
    })
    return NextResponse.json(building, { status: 201 })
  } catch (error) {
    console.error('[API] POST /buildings error:', error)
    return NextResponse.json({ error: 'Gagal menambah gedung' }, { status: 500 })
  }
}
