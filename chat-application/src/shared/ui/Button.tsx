import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  loading?: boolean
  variant?: ButtonVariant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      asChild = false,
      loading = false,
      variant = 'primary',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button'

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-gradient-to-r from-cta-from via-cta-via to-cta-to
        text-white uppercase tracking-widest text-sm font-semibold
        shadow-md hover:shadow-lg hover:brightness-105
      `,
      outline: `
        border-2 border-primary bg-white
        text-primary font-semibold uppercase tracking-widest text-sm
        hover:bg-primary/5
      `,
    }

    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={`
          flex w-full items-center justify-center gap-2.5
          rounded-lg px-6 py-3.5
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {loading ? 'Загрузка...' : children}
      </Component>
    )
  },
)

Button.displayName = 'Button'
