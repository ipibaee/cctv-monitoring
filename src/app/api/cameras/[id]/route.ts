import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const camera = await prisma.camera.findUnique({
      where: { id: params.id },
      include: { building: true, dvr: true },
    })
    if (!camera) return NextResponse.json({ error: 'Kamera tidak ditemukan' }, { status: 404 })
    return NextResponse.json(camera)
  } catch (error) {
    console.error('[API] GET /cameras/[id] error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data kamera' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const camera = await prisma.camera.update({
      where: { id: params.id },
      data: body,
      include: { building: true, dvr: true },
    })
    return NextResponse.json(camera)
  } catch (error) {
    console.error('[API] PATCH /cameras/[id] error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui data kamera' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.camera.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'Kamera berhasil dihapus' })
  } catch (error) {
    console.error('[API] DELETE /cameras/[id] error:', error)
    return NextResponse.json({ error: 'Gagal menghapus kamera' }, { status: 500 })
  }
}
