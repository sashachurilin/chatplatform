import { findMockRoute } from './routes/auth'

const MOCK_DELAY = 300

/**
 * Intercepts a fetch request if a mock route matches.
 * Returns a Response if mocked, or null to let real fetch proceed.
 */
export async function handleMockRequest(
  url: string,
  options: RequestInit,
): Promise<Response | null> {
  const method = options.method ?? 'GET'
  const route = findMockRoute(method, url)

  if (!route) return null

  await new Promise((r) => setTimeout(r, MOCK_DELAY))

  const body = options.body ? JSON.parse(options.body as string) : {}
  const { status, body: responseBody } = route.handler(body as never)

  return new Response(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
