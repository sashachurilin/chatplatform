import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth'
import { HeyChatLogo } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Регистрация — HeyChat!',
  description: 'Создайте бесплатный аккаунт в HeyChat!',
}

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Logo — top-left corner */}
      <div className="absolute left-6 top-5">
        <HeyChatLogo size="md" />
      </div>

      {/* Form — centered */}
      <div className="flex min-h-screen items-center justify-center px-6 py-20">
        <RegisterForm />
      </div>
    </main>
  )
}
