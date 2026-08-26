import { config } from '@/shared/config/env'
import { ApiError } from '@/shared/types/api'
import { handleMockRequest } from './mock'

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`

  let token: string | null = null
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('heychat_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        token = user?.accessToken ?? user?.token ?? null
      } catch {}
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }

  let response: Response

  if (config.mockEnabled) {
    const mock = await handleMockRequest(endpoint, fetchOptions)
    response = mock ?? (await fetch(url, fetchOptions))
  } else {
    response = await fetch(url, fetchOptions)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data.message ?? data.error ?? 'Произошла ошибка'
    throw new ApiError(response.status, message)
  }

  return data as T
}
