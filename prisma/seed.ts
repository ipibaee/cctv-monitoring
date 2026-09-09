import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SAMPLE_HLS_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://cdn.jwplayer.com/manifests/pvh9mflV.m3u8',
]

async function main() {
  console.log('🌱 Seeding database CCTV Sekolah...')

  // Clean existing
  await prisma.camera.deleteMany()
  await prisma.dVR.deleteMany()
  await prisma.building.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin & Operator Users
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: 'adminpassword123', // In production use bcrypt
        name: 'Administrator CCTV',
        role: 'SUPER_ADMIN',
      },
      {
        username: 'operator_guru',
        password: 'gurupassword123',
        name: 'Pak Budi (Tim Kesiswaan)',
        role: 'OPERATOR',
      },
    ],
  })

  // 2. Create Buildings
  const bldgA = await prisma.building.create({
    data: { code: 'GD-A', name: 'Gedung A (Pembelajaran & Kelas)', floors: 3 },
  })
  const bldgB = await prisma.building.create({
    data: { code: 'GD-B', name: 'Gedung B (Laboratorium & Komputer)', floors: 2 },
  })
  const bldgC = await prisma.building.create({
    data: { code: 'GD-C', name: 'Gedung C (Administrasi & Ruang Guru)', floors: 2 },
  })
  const bldgD = await prisma.building.create({
    data: { code: 'GD-D', name: 'Gedung D (Olahraga, Kantin & Lapangan)', floors: 1 },
  })

  // 3. Create DVRs
  const dvr1 = await prisma.dVR.create({
    data: {
      name: 'DVR Utama Gedung A',
      brand: 'Hikvision DS-7216HQHI',
      ipOrDomain: 'cctv-gda.sekolah.sch.id',
      rtspPort: 554,
      httpPort: 8000,
      channels: 16,
      username: 'admin',
      password: 'dvrpassword123',
    },
  })

  const dvr2 = await prisma.dVR.create({
    data: {
      name: 'DVR Lab & Admin Gedung B-C',
      brand: 'Dahua XVR5108HS-X',
      ipOrDomain: '180.250.12.88', // Public IP
      rtspPort: 554,
      httpPort: 37777,
      channels: 16,
      username: 'admin',
      password: 'dvrpassword456',
    },
  })

  const dvr3 = await prisma.dVR.create({
    data: {
      name: 'NVR Area Terbuka Gedung D',
      brand: 'HiLook NVR-108MH-C',
      ipOrDomain: 'cctv-gdd.ddns.net',
      rtspPort: 554,
      httpPort: 80,
      channels: 8,
      username: 'admin',
      password: 'dvrpassword789',
    },
  })

  // 4. Create Cameras
  const cameraData = [
    // Gedung A
    {
      name: 'Ruang Kelas X-IPA 1',
      buildingId: bldgA.id,
      dvrId: dvr1.id,
      floor: 1,
      channel: 1,
      streamUrl: SAMPLE_HLS_STREAMS[0],
      rtspUrl: 'rtsp://admin:dvrpassword123@cctv-gda.sekolah.sch.id:554/Streaming/Channels/101',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Ruang Kelas X-IPA 2',
      buildingId: bldgA.id,
      dvrId: dvr1.id,
      floor: 1,
      channel: 2,
      streamUrl: SAMPLE_HLS_STREAMS[1],
      rtspUrl: 'rtsp://admin:dvrpassword123@cctv-gda.sekolah.sch.id:554/Streaming/Channels/201',
      isFavorite: false,
      status: 'ONLINE' as const,
    },
    {
      name: 'Koridor Lantai 2 Gedung A',
      buildingId: bldgA.id,
      dvrId: dvr1.id,
      floor: 2,
      channel: 3,
      streamUrl: SAMPLE_HLS_STREAMS[2],
      rtspUrl: 'rtsp://admin:dvrpassword123@cctv-gda.sekolah.sch.id:554/Streaming/Channels/301',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Ruang Kelas XII-IPS 3',
      buildingId: bldgA.id,
      dvrId: dvr1.id,
      floor: 3,
      channel: 4,
      streamUrl: SAMPLE_HLS_STREAMS[3],
      rtspUrl: 'rtsp://admin:dvrpassword123@cctv-gda.sekolah.sch.id:554/Streaming/Channels/401',
      isFavorite: false,
      status: 'OFFLINE' as const,
    },

    // Gedung B
    {
      name: 'Laboratorium Komputer 1',
      buildingId: bldgB.id,
      dvrId: dvr2.id,
      floor: 1,
      channel: 1,
      streamUrl: SAMPLE_HLS_STREAMS[1],
      rtspUrl: 'rtsp://admin:dvrpassword456@180.250.12.88:554/cam/realmonitor?channel=1&subtype=0',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Laboratorium Fisika & Kimia',
      buildingId: bldgB.id,
      dvrId: dvr2.id,
      floor: 2,
      channel: 2,
      streamUrl: SAMPLE_HLS_STREAMS[2],
      rtspUrl: 'rtsp://admin:dvrpassword456@180.250.12.88:554/cam/realmonitor?channel=2&subtype=0',
      isFavorite: false,
      status: 'ONLINE' as const,
    },

    // Gedung C
    {
      name: 'Lobi Utama & Resepsionis',
      buildingId: bldgC.id,
      dvrId: dvr2.id,
      floor: 1,
      channel: 5,
      streamUrl: SAMPLE_HLS_STREAMS[0],
      rtspUrl: 'rtsp://admin:dvrpassword456@180.250.12.88:554/cam/realmonitor?channel=5&subtype=0',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Ruang Guru Utama',
      buildingId: bldgC.id,
      dvrId: dvr2.id,
      floor: 1,
      channel: 6,
      streamUrl: SAMPLE_HLS_STREAMS[3],
      rtspUrl: 'rtsp://admin:dvrpassword456@180.250.12.88:554/cam/realmonitor?channel=6&subtype=0',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Ruang Kepala Sekolah',
      buildingId: bldgC.id,
      dvrId: dvr2.id,
      floor: 2,
      channel: 7,
      streamUrl: SAMPLE_HLS_STREAMS[1],
      rtspUrl: 'rtsp://admin:dvrpassword456@180.250.12.88:554/cam/realmonitor?channel=7&subtype=0',
      isFavorite: false,
      status: 'ONLINE' as const,
    },

    // Gedung D
    {
      name: 'Lapangan Utama & Upacara',
      buildingId: bldgD.id,
      dvrId: dvr3.id,
      floor: 1,
      channel: 1,
      streamUrl: SAMPLE_HLS_STREAMS[2],
      rtspUrl: 'rtsp://admin:dvrpassword789@cctv-gdd.ddns.net:554/ch1/main/av_stream',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
    {
      name: 'Kantin Sekolah & Area Parkir',
      buildingId: bldgD.id,
      dvrId: dvr3.id,
      floor: 1,
      channel: 2,
      streamUrl: SAMPLE_HLS_STREAMS[0],
      rtspUrl: 'rtsp://admin:dvrpassword789@cctv-gdd.ddns.net:554/ch2/main/av_stream',
      isFavorite: false,
      status: 'ONLINE' as const,
    },
    {
      name: 'Gerbang Utama & Pos Satpam',
      buildingId: bldgD.id,
      dvrId: dvr3.id,
      floor: 1,
      channel: 3,
      streamUrl: SAMPLE_HLS_STREAMS[3],
      rtspUrl: 'rtsp://admin:dvrpassword789@cctv-gdd.ddns.net:554/ch3/main/av_stream',
      isFavorite: true,
      status: 'ONLINE' as const,
    },
  ]

  for (const cam of cameraData) {
    await prisma.camera.create({ data: cam })
  }

  console.log('✅ Seeding selesai! Database siap digunakan.')
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
