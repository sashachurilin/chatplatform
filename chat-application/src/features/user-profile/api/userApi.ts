import { apiClient } from '@/shared/api'
import type { User } from '@/entities/user'

export interface UpdateProfileRequest {
  username?: string
  userTag?: string
  bio?: string
  avatarUrl?: string
}

export interface SearchRequest {
  userTag: string
}

export async function getProfile(): Promise<User> {
  return apiClient<User>('/api/users/me', {
    method: 'GET',
  })
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  return apiClient<User>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function searchUsers(userTag: string): Promise<User[]> {
  return apiClient<User[]>('/api/users/search', {
    method: 'POST',
    body: JSON.stringify({ userTag }),
  })
}
