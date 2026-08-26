'use client'

import { useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  PencilSimple,
  Camera,
  QrCode,
  Gift,
  MusicNotes,
  User as UserIcon,
} from '@phosphor-icons/react'
import { UserAvatar } from '@/shared/ui'
import type { User } from '@/entities/user'
import { updateProfile as apiUpdateProfile } from '@/features/user-profile/api/userApi'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: User) => void
}

const AVATAR_PRESETS = ['user', '👩‍💻', '👨‍💻', '🚀', '🐱', '🦊', '⚡', '😎']

export function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [userTag, setUserTag] = useState(user.userTag)
  const email = user.email
  const [phone, setPhone] = useState('+7 965 627 6435')
  const [birthday, setBirthday] = useState('Feb 19, 2005 (21 years old)')
  const [bio, setBio] = useState(user.bio ?? 'Разработчик HeyChat!')
  const [avatar, setAvatar] = useState(user.avatar ?? 'user')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatar(event.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const finalUser: User = {
      ...user,
      username,
      userTag: userTag.startsWith('@') ? userTag : `@${userTag}`,
      email,
      bio,
      avatar,
      updatedAt: new Date().toISOString(),
    }
    try {
      await apiUpdateProfile({
        username: username !== user.username ? username : undefined,
        userTag: finalUser.userTag?.replace('@', '') !== user.userTag?.replace('@', '') ? finalUser.userTag?.replace('@', '') : undefined,
        bio: bio !== user.bio ? bio : undefined,
        avatarUrl: avatar !== user.avatar ? avatar : undefined,
      })
    } catch (err) {
      console.error('Ошибка обновления профиля:', err)
    }
    onSave(finalUser)
    setIsEditing(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#17212B] text-slate-100 shadow-2xl border border-slate-700/60 duration-200 overflow-hidden select-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-end gap-3 px-4 pt-3.5 pb-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`rounded-full p-2 transition-colors ${
                isEditing
                  ? 'bg-[#3390EC] text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={isEditing ? 'Просмотр' : 'Редактировать'}
            >
              <PencilSimple size={20} weight="bold" />
            </button>

            <Dialog.Close className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <X size={20} weight="bold" />
            </Dialog.Close>
          </div>

          <div className="flex flex-col items-center justify-center pb-4 px-6">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UserAvatar
                avatar={avatar}
                name={username}
                size="xl"
                className="!h-24 !w-24 text-3xl ring-4 ring-[#242F3D] shadow-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={26} weight="bold" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <h2 className="mt-3 text-lg font-bold text-white flex items-center gap-1.5">
              <span>{username}</span>
              <span className="text-sm">🐈</span>
            </h2>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#2B82C9]/20 px-2 py-0.5 text-xs font-semibold text-[#38A5F8]">
                <span className="h-2 w-2 rounded-full bg-[#38A5F8] animate-pulse" />
                <span>1 online</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 bg-[#0E1621] py-2 px-4 text-xs font-medium text-slate-300 hover:text-white cursor-pointer border-t border-b border-slate-800/80 transition-colors">
            <MusicNotes size={16} className="text-[#38A5F8]" weight="fill" />
            <span className="truncate">Neck Deep – In Bloom</span>
            <span className="text-slate-500 font-bold">&gt;</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="p-4 space-y-3 bg-[#17212B]">
              <div className="text-xs font-bold text-[#38A5F8] uppercase tracking-wider mb-2">
                Редактирование профиля
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Имя</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0E1621] px-3 py-2 text-sm text-white focus:border-[#3390EC] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Имя пользователя (тег)</label>
                <input
                  type="text"
                  value={userTag}
                  onChange={(e) => setUserTag(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0E1621] px-3 py-2 text-sm font-mono text-white focus:border-[#3390EC] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Телефон</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0E1621] px-3 py-2 text-sm text-white focus:border-[#3390EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">День рождения</label>
                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0E1621] px-3 py-2 text-sm text-white focus:border-[#3390EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">О себе</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#0E1621] px-3 py-2 text-sm text-white focus:border-[#3390EC] focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Быстрый выбор аватарки:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setAvatar(opt)
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition-all ${
                        avatar === opt
                          ? 'bg-[#69a1c8] text-white font-bold ring-2 ring-[#69a1c8]'
                          : 'bg-[#242F3D] hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {opt === 'user' ? <UserIcon size={16} weight="bold" /> : opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3390EC] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2B82C9] transition-colors shadow-md"
                >
                  Сохранить
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#17212B] divide-y divide-slate-800/70">
              <div className="px-5 py-3 hover:bg-[#242F3D]/50 transition-colors cursor-pointer">
                <div className="text-sm font-medium text-white">{phone}</div>
                <div className="text-xs text-slate-400 mt-0.5">Mobile</div>
              </div>

              <div className="flex items-center justify-between px-5 py-3 hover:bg-[#242F3D]/50 transition-colors cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-[#38A5F8]">{userTag}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Username</div>
                </div>
                <button className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <QrCode size={20} />
                </button>
              </div>

              <div className="px-5 py-3 hover:bg-[#242F3D]/50 transition-colors cursor-pointer">
                <div className="text-sm font-medium text-white">{birthday}</div>
                <div className="text-xs text-slate-400 mt-0.5">Birthday</div>
              </div>

              <div className="flex items-center justify-between px-5 py-3 bg-[#17212B] hover:bg-[#242F3D]/50 transition-colors cursor-pointer border-t-4 border-[#0E1621]">
                <div className="flex items-center gap-3.5">
                  <Gift size={20} className="text-slate-400" />
                  <span className="text-sm font-medium text-white">Gifts</span>
                </div>
                <span className="text-sm font-semibold text-[#38A5F8]">4</span>
              </div>

              <div className="py-7 px-4 text-center bg-[#0E1621] text-slate-400 text-xs font-medium">
                Your stories will be here.
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
