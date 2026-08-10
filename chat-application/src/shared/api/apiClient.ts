import { config } from '@/shared/config/env'
import { ApiError } from '@/shared/types/api'
import { handleMockRequest } from './mock'

/**
 * Thin fetch wrapper with mock support.
 * When NEXT_PUBLIC_MOCK_API=true, requests are intercepted by the mock handler.
 * When the real backend is ready, simply set the env var to false.
 */
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

  // Try mock first if enabled
  if (config.mockEnabled) {
    const mockResponse = await handleMockRequest(endpoint, fetchOptions)
    if (mockResponse) {
      response = mockResponse
    } else {
      response = await fetch(url, fetchOptions)
    }
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
