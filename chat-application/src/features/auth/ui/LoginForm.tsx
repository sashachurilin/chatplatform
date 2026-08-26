'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { ApiError } from '@/shared/types/api'
import { loginUser } from '../api/authApi'
import { loginSchema, type LoginFormData } from '../model/schemas'

export function LoginForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setMessage('')
    setIsSuccess(false)

    try {
      const res = await loginUser({ usernameOrEmail: data.usernameOrEmail, password: data.password })
      if (res.user && typeof window !== 'undefined') {
        const userData = {
          ...res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }
        localStorage.setItem('heychat_user', JSON.stringify(userData))
      }
      setMessage('Вы успешно вошли!')
      setIsSuccess(true)
      router.push('/chat')
    } catch (err) {
      const msg = err instanceof ApiError ? err.data.message : 'Ошибка входа'
      setMessage(msg)
      setIsSuccess(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white px-10 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.10)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            С возвращением!
          </h1>
          <p className="mt-1.5 text-lg text-muted">
            Войдите в свой аккаунт
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email или имя пользователя"
            type="text"
            placeholder="Email или имя пользователя"
            error={errors.usernameOrEmail?.message}
            {...register('usernameOrEmail')}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="mb-5 -mt-2 text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              Забыли пароль?
            </a>
          </div>

          <Button type="submit" loading={isSubmitting}>
            Войти
          </Button>
        </form>

        {message && (
          <div
            className={`mt-5 flex items-center gap-2.5 rounded-lg p-3.5 text-sm ${
              isSuccess
                ? 'bg-success-bg text-success-text'
                : 'bg-error-bg text-error-text'
            }`}
          >
            <span>{isSuccess ? '✓' : '✕'}</span>
            <span>{message}</span>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted">
          <p>
            <span className="font-semibold text-foreground">
              Нет аккаунта?
            </span>{' '}
            <a href="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
