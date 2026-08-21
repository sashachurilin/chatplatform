export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | ''

export interface User {
  id: string
  username: string
  userTag: string
  email: string
  avatar?: string
  bio?: string
  status?: UserStatus
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}
