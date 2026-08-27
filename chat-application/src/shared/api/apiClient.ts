import { config } from '@/shared/config/env'
import { ApiError } from '@/shared/types/api'
import { handleMockRequest } from './mock'

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // If body is FormData, let browser set Content-Type
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  // Attach JWT Bearer token if present
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('heychat_token')
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
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
    let message = data.message ?? data.error
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      message = data.errors[0]?.defaultMessage || data.errors[0]?.message || message
    } else if (typeof data.errors === 'object' && data.errors !== null) {
      const firstVal = Object.values(data.errors)[0]
      if (typeof firstVal === 'string') message = firstVal
    }
    if (!message) {
      message = response.status === 401 ? 'Требуется авторизация' : (response.status === 400 ? 'Некорректные данные' : 'Произошла ошибка')
    }
    throw new ApiError(response.status, message)
  }

  return data as T
}
