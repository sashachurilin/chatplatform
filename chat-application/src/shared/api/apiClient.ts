import { config } from '@/shared/config/env'
import { ApiError } from '@/shared/types/api'
import { handleMockRequest } from './mock'

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? 'Произошла ошибка',
    )
  }

  return data as T
}
