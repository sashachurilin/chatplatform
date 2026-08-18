import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Заполните имя пользователя'),
    email: z
      .string()
      .min(1, 'Заполните email')
      .email('Некорректный email'),
    password: z
      .string()
      .min(1, 'Заполните пароль'),
    confirmPassword: z
      .string()
      .min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Заполните email')
    .email('Некорректный email'),
  password: z
    .string()
    .min(1, 'Заполните пароль'),
})

export type LoginFormData = z.infer<typeof loginSchema>
