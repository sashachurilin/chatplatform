import { apiClient } from '@/shared/api'
import type { User } from '@/entities/user'

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (res.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('heychat_token', res.accessToken)
  }
  if (res.user && typeof window !== 'undefined') {
    localStorage.setItem('heychat_user', JSON.stringify(res.user))
  }
  return res
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (res.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('heychat_token', res.accessToken)
  }
  if (res.user && typeof window !== 'undefined') {
    localStorage.setItem('heychat_user', JSON.stringify(res.user))
  }
  return res
}

export async function getMe(): Promise<User> {
  return apiClient<User>('/api/auth/me', {
    method: 'GET',
  })
}

export async function updateUserProfile(data: { username?: string; userTag?: string }): Promise<User> {
  return apiClient<User>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function searchUsers(query: string): Promise<User[]> {
  return apiClient<User[]>(`/api/auth/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
  })
}

export async function logoutUser(): Promise<void> {
  try {
    await apiClient('/api/auth/logout', {
      method: 'POST',
    })
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('heychat_token')
    }
  }
}
