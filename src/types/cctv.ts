export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
export type UserRole = 'SUPER_ADMIN' | 'OPERATOR' | 'VIEWER'
export type GridLayout = 1 | 2 | 3 | 4

export interface Building {
  id: string
  code: string
  name: string
  floors: number
  cameras?: Camera[]
  createdAt: Date
  updatedAt: Date
}

export interface DVR {
  id: string
  name: string
  brand: string
  ipOrDomain: string
  rtspPort: number
  httpPort: number
  channels: number
  username: string
  password: string
  cameras?: Camera[]
  createdAt: Date
  updatedAt: Date
}

export interface Camera {
  id: string
  name: string
  buildingId: string
  building?: Building
  dvrId?: string | null
  dvr?: DVR | null
  floor: number
  channel: number
  streamUrl: string
  rtspUrl?: string | null
  status: CameraStatus
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  username: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface CameraWithRelations extends Camera {
  building: Building
  dvr?: DVR | null
}

export interface DashboardStats {
  total: number
  online: number
  offline: number
  maintenance: number
  favorites: number
}

export interface CameraGroupedByBuilding {
  building: Building
  cameras: Camera[]
}
