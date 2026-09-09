import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VisiGuard – Monitoring CCTV Sekolah',
  description: 'Sistem monitoring CCTV multi-gedung terpusat. Pantau kamera keamanan seluruh gedung sekolah secara realtime dari satu dashboard modern.',
  keywords: ['CCTV', 'monitoring', 'sekolah', 'keamanan', 'DVR', 'NVR', 'live stream'],
  authors: [{ name: 'Tim IT Sekolah' }],
  openGraph: {
    title: 'VisiGuard – Monitoring CCTV Sekolah',
    description: 'Dashboard Monitoring CCTV Multi-Gedung Sekolah',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cctv-theme') || 'dark';
                if (theme === 'light') document.documentElement.classList.add('light');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-animated-mesh min-h-screen">{children}</body>
    </html>
  )
}
