export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY'

export interface User {
  id: string
  username: string
  userTag: string
  email: string
  status: UserStatus
  createdAt: string
  updatedAt?: string
  lastLogin?: string
}
