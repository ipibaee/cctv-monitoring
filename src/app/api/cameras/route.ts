import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buildingId = searchParams.get('buildingId')
    const status = searchParams.get('status')
    const isFavorite = searchParams.get('isFavorite')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (buildingId) where.buildingId = buildingId
    if (status) where.status = status
    if (isFavorite === 'true') where.isFavorite = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    const cameras = await prisma.camera.findMany({
      where,
      include: {
        building: true,
        dvr: {
          select: {
            id: true,
            name: true,
            brand: true,
            ipOrDomain: true,
          },
        },
      },
      orderBy: [{ buildingId: 'asc' }, { floor: 'asc' }, { channel: 'asc' }],
    })

    return NextResponse.json(cameras)
  } catch (error) {
    console.error('[API] GET /cameras error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data kamera' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, buildingId, dvrId, floor, channel, streamUrl, rtspUrl, status, isFavorite } = body

    if (!name || !buildingId || !streamUrl) {
      return NextResponse.json({ error: 'Nama, buildingId, dan streamUrl wajib diisi' }, { status: 400 })
    }

    const camera = await prisma.camera.create({
      data: {
        name,
        buildingId,
        dvrId: dvrId || null,
        floor: floor ?? 1,
        channel: channel ?? 1,
        streamUrl,
        rtspUrl: rtspUrl || null,
        status: status ?? 'ONLINE',
        isFavorite: isFavorite ?? false,
      },
      include: { building: true, dvr: true },
    })

    return NextResponse.json(camera, { status: 201 })
  } catch (error) {
    console.error('[API] POST /cameras error:', error)
    return NextResponse.json({ error: 'Gagal menambah kamera' }, { status: 500 })
  }
}
