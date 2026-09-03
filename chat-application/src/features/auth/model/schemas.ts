import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Имя пользователя должно содержать минимум 2 символа'),
    email: z
      .string()
      .min(1, 'Заполните email')
      .email('Некорректный email'),
    password: z
      .string()
      .min(6, 'Пароль должен содержать минимум 6 символов'),
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
  usernameOrEmail: z
    .string()
    .min(1, 'Заполните имя пользователя или email'),
  password: z
    .string()
    .min(1, 'Заполните пароль'),
})

export type LoginFormData = z.infer<typeof loginSchema>
