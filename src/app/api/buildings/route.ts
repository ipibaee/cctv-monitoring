import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    console.error('[API] GET /buildings error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data gedung' }, { status: 500 })
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
