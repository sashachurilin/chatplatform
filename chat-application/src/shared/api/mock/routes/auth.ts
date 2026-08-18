import type { User } from '@/entities/user'

// ── In-memory "DB" ──────────────────────────────────────────
interface StoredUser extends User {
  password: string
}

const registeredUsers: StoredUser[] = []

// ── Types ───────────────────────────────────────────────────
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message?: string
  token: string
  user: User
}

// ── Route handlers ──────────────────────────────────────────
function handleRegister(data: RegisterRequest): { status: number; body: unknown } {
  const { username, email, password } = data

  if (!username || !email || !password) {
    return { status: 400, body: { message: 'Заполните все поля' } }
  }

  if (registeredUsers.find((u) => u.email === email)) {
    return { status: 409, body: { message: 'Пользователь с таким email уже существует' } }
  }

  if (registeredUsers.find((u) => u.username === username)) {
    return { status: 409, body: { message: 'Имя пользователя уже занято' } }
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    username,
    userTag: '@' + username.toLowerCase().replace(/\s+/g, ''),
    email,
    password,
    status: 'ONLINE',
    createdAt: new Date().toISOString(),
  }
  registeredUsers.push(user)

  const { password: _, ...safeUser } = user
  return {
    status: 200,
    body: {
      message: 'Пользователь успешно зарегистрирован',
      token: `mock-jwt-${user.id}`,
      user: safeUser,
    },
  }
}

function handleLogin(data: LoginRequest): { status: number; body: unknown } {
  const { email, password } = data

  const user = registeredUsers.find((u) => u.email === email)
  if (!user || user.password !== password) {
    return { status: 401, body: { message: 'Неверный email или пароль' } }
  }

  const { password: _, ...safeUser } = user
  return {
    status: 200,
    body: {
      token: `mock-jwt-${user.id}`,
      user: safeUser,
    },
  }
}

// ── Route table ─────────────────────────────────────────────
interface MockRoute {
  method: string
  path: string
  handler: (data: never) => { status: number; body: unknown }
}

const routes: MockRoute[] = [
  { method: 'POST', path: '/api/auth/register', handler: handleRegister as MockRoute['handler'] },
  { method: 'POST', path: '/api/auth/login', handler: handleLogin as MockRoute['handler'] },
]

export function findMockRoute(method: string, url: string): MockRoute | undefined {
  return routes.find(
    (r) => r.method === method.toUpperCase() && url.startsWith(r.path),
  )
}
