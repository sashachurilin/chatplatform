import { apiClient } from '@/shared/api'
import type { User } from '@/entities/user'

interface RegisterRequest {
  username: string
  userTag: string
  email: string
  password: string
}

interface AuthResponse {
  message?: string
  token: string
  user: User
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

interface LoginRequest {
  email: string
  password: string
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
