import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth'
import { HeyChatLogo } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Вход — HeyChat!',
  description: 'Войдите в свой аккаунт HeyChat!',
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Logo — top-left corner */}
      <div className="absolute left-6 top-5">
        <HeyChatLogo size="md" />
      </div>

      {/* Form — centered */}
      <div className="flex min-h-screen items-center justify-center px-6 py-20">
        <LoginForm />
      </div>
    </main>
  )
}
