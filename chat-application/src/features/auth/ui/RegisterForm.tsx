'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { ApiError } from '@/shared/types/api'
import { registerUser } from '../api/authApi'
import { registerSchema, type RegisterFormData } from '../model/schemas'

type MessageType = 'success' | 'error' | ''

function getPasswordStrength(password: string) {
  if (!password) return { label: '', level: 0, color: '' }

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Слабый', level: 1, color: 'bg-error-text' }
  if (score <= 2) return { label: 'Средний', level: 2, color: 'bg-warning' }
  if (score <= 3) return { label: 'Хороший', level: 3, color: 'bg-warning' }
  return { label: 'Сильный', level: 4, color: 'bg-success-text' }
}

export function RegisterForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue])

  const onSubmit = async (data: RegisterFormData) => {
    setMessage('')
    setMessageType('')

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      setMessage('Регистрация прошла успешно!')
      setMessageType('success')
      reset()
      router.push('/chat')
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.data.message
          : 'Ошибка регистрации'
      setMessage(errorMessage)
      setMessageType('error')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white px-10 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.10)]">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Привет!
          </h1>
          <p className="mt-1.5 text-lg text-muted">
            Создайте бесплатный аккаунт
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Имя пользователя"
            type="text"
            placeholder="Ваше имя"
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Password strength indicator */}
          {passwordValue && (
            <div className="-mt-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Надёжность:</span>
                <span
                  className={`text-xs font-medium ${strength.level <= 1
                      ? 'text-error-text'
                      : strength.level <= 3
                        ? 'text-warning'
                        : 'text-success-text'
                    }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.level ? strength.color : 'bg-border'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}

          <Input
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" loading={isSubmitting} className="mt-2">
            Создать аккаунт
          </Button>
        </form>

        {/* Feedback message */}
        {message && (
          <div
            className={`mt-5 flex items-center gap-2.5 rounded-lg p-3.5 text-sm ${messageType === 'success'
                ? 'bg-success-bg text-success-text'
                : 'bg-error-bg text-error-text'
              }`}
          >
            <span>{messageType === 'success' ? '✓' : '✕'}</span>
            <span>{message}</span>
          </div>
        )}


        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted">
          <p>
            <span className="font-semibold text-foreground">
              Уже есть аккаунт?
            </span>{' '}
            <a href="/login" className="text-primary hover:underline">
              Войти
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
