import Image from 'next/image'
import logoSrc from '@/app/logo.png'

interface HeyChatLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const heights = { sm: 28, md: 36, lg: 48 } as const

export function HeyChatLogo({ className = '', size = 'md' }: HeyChatLogoProps) {
  return (
    <div className="select-none pointer-events-none flex items-center shrink-0">
      <Image
        src={logoSrc}
        alt="HeyChat!"
        height={heights[size]}
        className={`select-none pointer-events-none ${className}`}
        draggable={false}
        priority
      />
    </div>
  )
}

