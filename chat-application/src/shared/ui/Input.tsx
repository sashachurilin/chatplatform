import { Label } from '@radix-ui/react-label'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="mb-5">
        {label && (
          <Label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border border-border
            bg-white px-4 py-3 text-base text-foreground
            transition-all duration-200
            placeholder:text-muted/60
            focus:border-border-focus focus:outline-none
            focus:ring-2 focus:ring-border-focus/20
            ${error ? 'border-error-text focus:border-error-text focus:ring-error-text/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error-text">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
