import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function buildRtspUrl(
  ipOrDomain: string,
  rtspPort: number,
  channel: number,
  username: string,
  password: string,
  brand: string
): string {
  const encodedUser = encodeURIComponent(username)
  const encodedPass = encodeURIComponent(password)
  const base = `rtsp://${encodedUser}:${encodedPass}@${ipOrDomain}:${rtspPort}`
  
  const brandLower = brand.toLowerCase()
  if (brandLower.includes('hikvision') || brandLower.includes('hilook')) {
    return `${base}/Streaming/Channels/${channel}01`
  } else if (brandLower.includes('dahua')) {
    return `${base}/cam/realmonitor?channel=${channel}&subtype=0`
  } else {
    return `${base}/ch${channel}/main/av_stream`
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'ONLINE':
      return 'text-emerald-400'
    case 'OFFLINE':
      return 'text-red-400'
    case 'MAINTENANCE':
      return 'text-amber-400'
    default:
      return 'text-gray-400'
  }
}

export function getStatusBg(status: string) {
  switch (status) {
    case 'ONLINE':
      return 'bg-emerald-400/15 border-emerald-400/30 text-emerald-300'
    case 'OFFLINE':
      return 'bg-red-400/15 border-red-400/30 text-red-300'
    case 'MAINTENANCE':
      return 'bg-amber-400/15 border-amber-400/30 text-amber-300'
    default:
      return 'bg-gray-400/15 border-gray-400/30 text-gray-300'
  }
}

export function gridColsClass(layout: number): string {
  switch (layout) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-1 sm:grid-cols-2'
    case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    case 4: return 'grid-cols-2 lg:grid-cols-4'
    default: return 'grid-cols-1 sm:grid-cols-2'
  }
}
