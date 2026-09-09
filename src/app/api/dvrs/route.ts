import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const dvrs = await prisma.dVR.findMany({
      include: {
        _count: { select: { cameras: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(dvrs)
  } catch (error) {
    console.error('[API] GET /dvrs error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data DVR' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, brand, ipOrDomain, rtspPort, httpPort, channels, username, password } = body
    if (!name || !brand || !ipOrDomain || !username || !password) {
      return NextResponse.json({ error: 'Semua field DVR wajib diisi' }, { status: 400 })
    }

    const dvr = await prisma.dVR.create({
      data: {
        name,
        brand,
        ipOrDomain,
        rtspPort: rtspPort ?? 554,
        httpPort: httpPort ?? 80,
        channels: channels ?? 16,
        username,
        password,
      },
    })
    return NextResponse.json(dvr, { status: 201 })
  } catch (error) {
    console.error('[API] POST /dvrs error:', error)
    return NextResponse.json({ error: 'Gagal menambah DVR' }, { status: 500 })
  }
}
