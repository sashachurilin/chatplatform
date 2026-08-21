import { apiClient } from '@/shared/api'
import type { User } from '@/entities/user'

interface RegisterRequest {
  username: string
  email: string
  password: string
}

interface LoginRequest {
  usernameOrEmail: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

interface User {
  id: string
  username: string
  userTag: string
  email: string
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
