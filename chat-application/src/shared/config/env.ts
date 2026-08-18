export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  mockEnabled: process.env.NEXT_PUBLIC_MOCK_API === 'true',
} as const
