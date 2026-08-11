'use client'

import { User as UserIcon, ChatCircleText } from '@phosphor-icons/react'

interface UserAvatarProps {
  avatar?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  colorIndex?: number
  className?: string
}

const AVATAR_BG_PALETTES = [
  'bg-blue-100 text-blue-700 ring-1 ring-blue-200/60',
  'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/60',
  'bg-purple-100 text-purple-700 ring-1 ring-purple-200/60',
  'bg-amber-100 text-amber-700 ring-1 ring-amber-200/60',
  'bg-rose-100 text-rose-700 ring-1 ring-rose-200/60',
  'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200/60',
  'bg-orange-100 text-orange-700 ring-1 ring-orange-200/60',
  'bg-violet-100 text-violet-700 ring-1 ring-violet-200/60',
]

function getPaletteClass(name?: string, colorIndex?: number): string {
  if (colorIndex !== undefined) {
    return AVATAR_BG_PALETTES[colorIndex % AVATAR_BG_PALETTES.length]
  }
  if (!name) return AVATAR_BG_PALETTES[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_BG_PALETTES.length
  return AVATAR_BG_PALETTES[index]
}

export function UserAvatar({ avatar, name, size = 'md', colorIndex, className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-xl',
    xl: 'h-20 w-20 text-3xl',
  }[size]

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 26,
    xl: 38,
  }[size]

  if (avatar === 'brand' || avatar === 'heychat') {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#2069D4] to-[#3B8EFA] text-white shadow-md shadow-blue-500/20 font-medium select-none ${sizeClasses} ${className}`}
      >
        <ChatCircleText size={iconSizes} weight="fill" />
      </div>
    )
  }

  const isImage =
    avatar &&
    (avatar.startsWith('data:') || avatar.startsWith('http:') || avatar.startsWith('https:') || avatar.startsWith('/'))

  if (isImage) {
    return (
      <img
        src={avatar}
        alt={name ?? 'Аватар'}
        className={`shrink-0 rounded-full object-cover shadow-sm ${sizeClasses} ${className}`}
      />
    )
  }

  const isEmoji = avatar && avatar !== 'user' && avatar !== 'default' && avatar.trim() !== ''
  const paletteClass = getPaletteClass(name, colorIndex)

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full shadow-xs font-medium select-none ${paletteClass} ${sizeClasses} ${className}`}
    >
      {isEmoji ? avatar : <UserIcon size={iconSizes} weight="bold" className="currentColor opacity-80" />}
    </div>
  )
}
