# 🔒 VisiGuard – Monitoring CCTV Sekolah (Multi-DVR/NVR)

Aplikasi web modern untuk monitoring CCTV multi-gedung sekolah secara terpusat. Dibangun dengan **Next.js 14 App Router**, **Neon Tech PostgreSQL + Prisma ORM**, dan desain **Liquid Glass Glassmorphism** ultra-modern.

---

## 📐 Arsitektur Sistem

```
[ DVR/NVR CCTV ]
   (Hikvision, Dahua, dll.)
        |
        | RTSP (Port 554)
        ▼
[ go2rtc / MediaMTX ]   ← Di-host di server lokal/VPS sekolah
   (Media Relay Server)
        |
        | HLS / WebRTC Stream
        ▼
[ Vercel (Next.js) ]    ← Dashboard Web Monitoring
        |
        | Prisma ORM
        ▼
[ Neon Tech PostgreSQL ] ← Database konfigurasi kamera
```

---

## 🚀 Instalasi & Setup

### 1. Clone & Install Dependensi

```bash
cd cctv-monitoring
npm install
```

### 2. Setup Database Neon Tech

1. Daftar & buat project di [neon.tech](https://neon.tech)
2. Copy **connection string** dari Neon Console
3. Edit file `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="ganti-dengan-secret-aman-di-production"
NEXT_PUBLIC_RELAY_SERVER_URL="https://stream.sekolah.sch.id"
```

### 3. Jalankan Migrasi & Seed

```bash
# Push schema ke Neon
npm run prisma:push

# Isi data demo (4 Gedung, 3 DVR, 12 Kamera)
npm run prisma:seed
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📡 Setup Relay Server (go2rtc/MediaMTX)

Karena Vercel adalah platform serverless, RTSP tidak dapat diproses langsung. Gunakan relay server terpisah:

### Opsi A: go2rtc (Direkomendasikan)

```yaml
# go2rtc.yaml di server lokal/VPS sekolah
streams:
  cam_gda_1: rtsp://admin:password@cctv-gda.sekolah.sch.id:554/Streaming/Channels/101
  cam_gda_2: rtsp://admin:password@cctv-gda.sekolah.sch.id:554/Streaming/Channels/201
  cam_gdb_1: rtsp://admin:password@180.250.12.88:554/cam/realmonitor?channel=1&subtype=0
  cam_gdd_1: rtsp://admin:password@cctv-gdd.ddns.net:554/ch1/main/av_stream

api:
  listen: :1984

webrtc:
  listen: :8555

# Akses HLS stream: https://relay.sekolah.sch.id/stream.m3u8?src=cam_gda_1
```

### Opsi B: MediaMTX

```yaml
# mediamtx.yml
paths:
  cam_gda_1:
    source: rtsp://admin:password@cctv-gda.sekolah.sch.id:554/Streaming/Channels/101
  cam_gdb_1:
    source: rtsp://admin:password@180.250.12.88:554/cam/realmonitor?channel=1
```

URL stream dari MediaMTX: `http://relay.sekolah.sch.id:8888/cam_gda_1/index.m3u8`

---

## 🌐 Deploy ke Vercel

### 1. Siapkan Environment Variables di Vercel

Di Vercel Dashboard > Project Settings > Environment Variables, tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Connection string pooled Neon Tech |
| `JWT_SECRET` | Random secret string |
| `NEXT_PUBLIC_RELAY_SERVER_URL` | URL relay server (https://stream.sekolah.sch.id) |

### 2. Deploy

```bash
npx vercel --prod
```

Atau hubungkan repository GitHub ke Vercel untuk auto-deploy.

---

## 🛠️ Merek DVR yang Didukung

| Brand | Format RTSP | Default Port |
|-------|------------|-------------|
| **Hikvision** | `rtsp://user:pass@IP/Streaming/Channels/[ch]01` | 554 |
| **Dahua** | `rtsp://user:pass@IP/cam/realmonitor?channel=[ch]&subtype=0` | 554 |
| **HiLook** | `rtsp://user:pass@IP/Streaming/Channels/[ch]01` | 554 |
| **Uniview** | `rtsp://user:pass@IP/media/video[ch]` | 554 |
| **Generic** | `rtsp://user:pass@IP/ch[ch]/main/av_stream` | 554 |

---

## 🗂️ Struktur Proyek

```
cctv-monitoring/
├── prisma/
│   ├── schema.prisma         ← Schema database (Building, DVR, Camera, User)
│   └── seed.ts               ← Data demo 4 gedung + 12 kamera
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Dashboard Live Monitor
│   │   ├── playback/         ← Interface Playback rekaman
│   │   ├── admin/            ← Panel Admin CRUD
│   │   ├── api/              ← API Routes (cameras, buildings, dvrs, stats)
│   │   └── globals.css       ← Liquid Glass CSS system
│   ├── components/
│   │   ├── layout/           ← Header, Sidebar, ThemeToggle
│   │   ├── dashboard/        ← CameraCard, CameraGrid, StatsOverview, QuickSearch
│   │   ├── player/           ← VideoPlayer (HLS.js)
│   │   └── ui/               ← Reusable UI primitives
│   ├── lib/
│   │   ├── prisma.ts         ← Singleton Prisma client
│   │   └── utils.ts          ← Utility functions
│   └── types/
│       └── cctv.ts           ← TypeScript interfaces
├── .env.local                ← Environment variables (jangan di-commit!)
├── vercel.json               ← Konfigurasi deploy Vercel
└── README.md
```

---

## ✨ Fitur Utama

- **Multi-Camera Grid View** – Layout 1×1, 2×2, 3×3, 4×4 dengan toggle interaktif
- **Live Status Badge** – Indikator LIVE/OFFLINE yang berdenyut realtime
- **Quick Search** – Cari kamera dengan Ctrl+K keyboard shortcut
- **Filter per Gedung** – Sidebar navigasi dengan grouping gedung & kamera
- **Favorit** – Tandai kamera terpenting untuk akses cepat
- **Camera Focus Modal** – Tampilan besar + info detail DVR + snapshot
- **Playback Mode** – Timeline scrubber + pemilihan tanggal/jam rekaman
- **Admin Panel** – CRUD Gedung, DVR, dan Kamera dengan tabel glass
- **Dark/Light Mode** – Toggle tema dengan transisi halus tanpa flash
- **Responsive** – Desktop sidebar + Mobile drawer yang smooth
- **HLS.js Player** – Streaming HLS dengan auto-reconnect & error handling

---

## 📝 License

MIT – Bebas digunakan untuk kepentingan sekolah dan institusi pendidikan.
