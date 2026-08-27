'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X,
  ArrowLeft,
  MagnifyingGlass,
  ChatTeardropText,
  Bell,
  SignOut,
  Moon,
  Camera,
  PencilSimple,
  Check,
  ShieldCheck,
  Eye,
  Prohibit,
  Timer,
  PaintBrush,
  Trash,
  UploadSimple,
  User as UserIcon,
  Gear,
  DotsThree,
  CaretRight,
} from '@phosphor-icons/react'
import { UserAvatar } from '@/shared/ui'
import type { User } from '@/entities/user'
import type { ChatSettings } from '../model/wallpaper'

interface SidebarDrawerProps {
  user: User
  isOpen: boolean
  initialView?: DrawerView
  isNightMode?: boolean
  onToggleNightMode?: (val: boolean) => void
  onClose: () => void
  onSaveProfile?: (updatedUser: User) => void
  onLogout: () => void
  chatSettings?: ChatSettings
  onUpdateChatSettings?: (settings: ChatSettings) => void
}

type DrawerView = 'settings' | 'profile' | 'account' | 'privacy' | 'chats' | 'notifications' | 'shortcuts' | 'help'

const AVATAR_PRESETS = ['user', '👩‍💻', '👨‍💻', '🚀', '🐱', '🦊', '⚡', '😎']

export function SidebarDrawer({
  user,
  isOpen,
  initialView = 'settings',
  isNightMode = false,
  onToggleNightMode,
  onClose,
  onSaveProfile,
  onLogout,
}: SidebarDrawerProps) {
  const [currentView, setCurrentView] = useState<DrawerView>(initialView)
  const [searchQuery, setSearchQuery] = useState('')
  const [userStatus, setUserStatus] = useState('В сети')

  const [editingName, setEditingName] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [editingTag, setEditingTag] = useState(false)
  const [userTag, setUserTag] = useState(user.userTag)
  const [editingEmail, setEditingEmail] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState(user.bio ?? 'Разработчик HeyChat!')
  const [avatar, setAvatar] = useState(user.avatar ?? 'user')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUsername(user.username)
    setUserTag(user.userTag)
    setEmail(user.email)
    setBio(user.bio ?? 'Разработчик HeyChat!')
    setAvatar(user.avatar ?? 'user')
  }, [user.username, user.userTag, user.email, user.bio, user.avatar])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const newAvatar = event.target.result
        setAvatar(newAvatar)
        onSaveProfile?.({ ...user, username, userTag, bio, email, avatar: newAvatar })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveName = () => {
    setEditingName(false)
    onSaveProfile?.({ ...user, username, userTag, bio, email, avatar })
  }

  const handleSaveBio = () => {
    setEditingBio(false)
    onSaveProfile?.({ ...user, username, userTag, bio, email, avatar })
  }

  const handleSaveTag = () => {
    setEditingTag(false)
    const formattedTag = userTag.startsWith('@') ? userTag : `@${userTag}`
    setUserTag(formattedTag)
    onSaveProfile?.({ ...user, username, userTag: formattedTag, bio, email, avatar })
  }

  const handleSaveEmail = () => {
    setEditingEmail(false)
    onSaveProfile?.({ ...user, username, userTag, bio, email, avatar })
  }

  const handleSelectPresetAvatar = (opt: string) => {
    setAvatar(opt)
    onSaveProfile?.({ ...user, username, userTag, bio, email, avatar: opt })
  }

  const handleClose = () => {
    setCurrentView('settings')
    onClose()
  }

  const settingsItems = [
    {
      id: 'profile-account',
      title: 'Профиль и Аккаунт',
      subtitle: 'Имя, сведения и контакты',
      icon: Gear,
      iconBg: 'bg-blue-500/10 text-blue-600',
      action: () => setCurrentView('profile'),
    },
    {
      id: 'privacy',
      title: 'Приватность и Блокировки',
      subtitle: 'Заблокированные контакты, скрытие статуса',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      action: () => setCurrentView('privacy'),
    },
    {
      id: 'chats',
      title: 'Темы, обои, чаты',
      subtitle: 'Оформление, обои и параметры чата',
      icon: ChatTeardropText,
      iconBg: 'bg-purple-500/10 text-purple-600',
      action: () => setCurrentView('chats'),
    },
    {
      id: 'notifications',
      title: 'Уведомления',
      subtitle: 'Сообщения, группы, звуки',
      icon: Bell,
      iconBg: 'bg-amber-500/10 text-amber-600',
      action: () => setCurrentView('notifications'),
    },
    {
      id: 'more',
      title: 'Дополнительно',
      subtitle: 'Справка и информация',
      icon: DotsThree,
      iconBg: 'bg-slate-500/10 text-slate-600',
      action: () => setCurrentView('account'),
    },
  ]

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'В сети':
        return {
          container: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 hover:bg-emerald-100/80',
          dot: 'bg-emerald-500 animate-pulse',
        }
      case 'Занят(-а)':
        return {
          container: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80 hover:bg-rose-100/80',
          dot: 'bg-rose-500',
        }
      case 'На встрече':
        return {
          container: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/80 hover:bg-purple-100/80',
          dot: 'bg-purple-500',
        }
      case 'Отдыхаю':
        return {
          container: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80 hover:bg-amber-100/80',
          dot: 'bg-amber-500',
        }
      default:
        return {
          container: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80 hover:bg-slate-200/80',
          dot: 'bg-slate-400',
        }
    }
  }

  const filteredItems = searchQuery.trim()
    ? settingsItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : settingsItems

  if (!isOpen) return null

  const statusStyle = getStatusBadgeStyle(userStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div
        className={`relative z-50 flex w-full max-w-[620px] max-h-[85vh] flex-col rounded-3xl shadow-2xl overflow-hidden transition-all duration-200 ease-out ${isNightMode
            ? 'bg-[#111b21] text-slate-100 border border-slate-800'
            : 'bg-white text-slate-900 border border-slate-100'
          }`}
      >
        <div className={`flex h-16 items-center justify-between px-5 shrink-0 ${isNightMode ? 'border-b border-slate-800' : 'border-b border-slate-100/80'
          }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {currentView !== 'settings' && (
              <button
                onClick={() => setCurrentView('settings')}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${isNightMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                title="Назад к настройкам"
              >
                <ArrowLeft size={20} weight="bold" />
              </button>
            )}
            <h2 className="text-base font-bold truncate tracking-tight">
              {currentView === 'settings' && 'Настройки'}
              {currentView === 'profile' && 'Профиль'}
              {currentView === 'account' && 'Аккаунт'}
              {currentView === 'privacy' && 'Конфиденциальность'}
              {currentView === 'chats' && 'Чаты'}
              {currentView === 'notifications' && 'Уведомления'}
              {currentView === 'shortcuts' && 'Дополнительно'}
              {currentView === 'help' && 'Помощь и отзывы'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${isNightMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }`}
            title="Закрыть"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {currentView === 'settings' && (
          <>
            <div className="px-5 pt-3.5 pb-2 shrink-0">
              <div className="relative flex items-center">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск настроек..."
                  className={`w-full rounded-xl pl-10 pr-9 py-2.5 text-[13px] border border-transparent transition-all focus:outline-none ${isNightMode
                      ? 'bg-slate-900 text-white placeholder:text-slate-500 focus:border-slate-700'
                      : 'bg-slate-100/80 text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                    }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-2.5 p-1 rounded-lg text-slate-400 transition-colors ${isNightMode ? 'hover:text-white hover:bg-slate-800' : 'hover:text-slate-600 hover:bg-slate-200/60'}`}
                    aria-label="Очистить поиск"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-2">
              <div
                onClick={() => setCurrentView('profile')}
                className={`group relative flex items-center justify-between p-4 my-2 rounded-2xl border transition-all cursor-pointer shadow-xs ${isNightMode
                    ? 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800'
                    : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/60'
                  }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <UserAvatar avatar={avatar} name={username} size="lg" className={`!h-16 !w-16 ring-4 shadow-sm ${isNightMode ? 'ring-slate-800' : 'ring-white'}`} />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={20} weight="bold" />
                    </div>
                  </div>

                  <div className="flex flex-col items-start min-w-0 space-y-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        const statuses = ['В сети', 'Занят(-а)', 'На встрече', 'Отдыхаю', 'Не в сети']
                        const nextIdx = (statuses.indexOf(userStatus) + 1) % statuses.length
                        setUserStatus(statuses[nextIdx])
                      }}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${statusStyle.container}`}
                      title="Нажмите для смены статуса"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                      <span>{userStatus}</span>
                    </button>

                    <h3 className={`text-base font-bold tracking-tight truncate group-hover:text-blue-600 transition-colors ${isNightMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {username}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium truncate leading-none">
                      {userTag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold group-hover:border-blue-300 group-hover:text-blue-600 shadow-2xs transition-all ${isNightMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                    <PencilSimple size={14} weight="bold" />
                    <span>Профиль</span>
                  </span>
                  <CaretRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              <div className="px-2.5 py-1 flex flex-col gap-1">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                    <p className="text-xs">Настройки не найдены</p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className={`group flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-150 ${isNightMode
                            ? 'hover:bg-slate-800/60 text-slate-200'
                            : 'hover:bg-slate-100/60 text-slate-800'
                          }`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${item.iconBg}`}>
                          <Icon size={20} weight="bold" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold tracking-tight leading-snug">
                            {item.title}
                          </span>
                          <span className={`block text-[12px] leading-snug mt-0.5 line-clamp-1 font-normal ${isNightMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                            {item.subtitle}
                          </span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}

        {currentView === 'profile' && (
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <div className="flex flex-col items-center text-center py-2 space-y-3">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UserAvatar avatar={avatar} name={username} size="xl" className={`!h-32 !w-32 text-4xl ring-4 shadow-md ${isNightMode ? 'ring-slate-800' : 'ring-slate-100'}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera size={26} weight="bold" />
                  <span className="text-[10px] font-bold tracking-wide mt-1">ИЗМЕНИТЬ</span>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  <UploadSimple size={15} weight="bold" />
                  <span>Загрузить фото</span>
                </button>
                {avatar !== 'user' && (
                  <button
                    type="button"
                    onClick={() => handleSelectPresetAvatar('user')}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
                    title="Сбросить"
                  >
                    <Trash size={14} />
                    <span>Сбросить</span>
                  </button>
                )}
              </div>

              <div className="w-full pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
                  Быстрый выбор аватарки:
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {AVATAR_PRESETS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(opt)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base leading-none transition-all ${avatar === opt
                          ? 'bg-blue-500/10 text-blue-600 ring-2 ring-blue-500 font-bold scale-105'
                          : (isNightMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700')
                        }`}
                    >
                      {opt === 'user' ? <UserIcon size={18} weight="bold" className={isNightMode ? 'text-slate-300' : 'text-slate-600'} /> : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`space-y-3 pt-2 border-t ${isNightMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={`rounded-2xl p-3.5 space-y-1 ${isNightMode ? 'bg-slate-800/60' : 'bg-slate-100/60'}`}>
                <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Ваше имя
                </label>

                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`flex-1 rounded-xl border border-blue-500 px-3 py-1.5 text-sm focus:outline-none ${isNightMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Check size={16} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-0.5">
                    <span className={`text-base font-bold ${isNightMode ? 'text-slate-100' : 'text-slate-900'}`}>{username}</span>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Редактировать имя"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 leading-normal">
                  Это имя будут видеть ваши контакты в HeyChat!
                </p>
              </div>

              <div className={`rounded-2xl p-3.5 space-y-1 ${isNightMode ? 'bg-slate-800/60' : 'bg-slate-100/60'}`}>
                <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Сведения
                </label>

                {editingBio ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`flex-1 rounded-xl border border-blue-500 px-3 py-1.5 text-sm focus:outline-none ${isNightMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveBio}
                      className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Check size={16} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-0.5">
                    <span className={`text-sm font-medium ${isNightMode ? 'text-slate-200' : 'text-slate-700'}`}>{bio}</span>
                    <button
                      onClick={() => setEditingBio(true)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Редактировать сведения"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl p-3.5 space-y-1 ${isNightMode ? 'bg-slate-800/60' : 'bg-slate-100/60'}`}>
                <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Имя пользователя (тег)
                </label>

                {editingTag ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userTag}
                      onChange={(e) => setUserTag(e.target.value)}
                      className={`flex-1 rounded-xl border border-blue-500 px-3 py-1.5 text-sm font-mono focus:outline-none ${isNightMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTag}
                      className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Check size={16} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-0.5">
                    <span className={`text-sm font-mono font-semibold ${isNightMode ? 'text-slate-200' : 'text-slate-800'}`}>{userTag}</span>
                    <button
                      onClick={() => setEditingTag(true)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Редактировать тег"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl p-3.5 space-y-1 ${isNightMode ? 'bg-slate-800/60' : 'bg-slate-100/60'}`}>
                <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Email
                </label>

                {editingEmail ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`flex-1 rounded-xl border border-blue-500 px-3 py-1.5 text-sm focus:outline-none ${isNightMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEmail}
                      className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Check size={16} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-0.5">
                    <span className={`text-sm font-medium ${isNightMode ? 'text-slate-200' : 'text-slate-700'}`}>{email}</span>
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Редактировать Email"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'account' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <ShieldCheck size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Уведомления о безопасности</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Защита сквозным шифрованием</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'privacy' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <Eye size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Время посещения и «в сети»</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Все</span>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <Prohibit size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Заблокированные контакты</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Нет заблокированных</span>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <Timer size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Исчезающие сообщения</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Выкл.</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'chats' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <PaintBrush size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Обои чата</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Стандартный фон</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'notifications' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${isNightMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
              <Bell size={22} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <div>
                <span className="block text-sm font-semibold">Звуки сообщений</span>
                <span className={`block text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>Включены</span>
              </div>
            </div>
          </div>
        )}

        <div className={`px-3.5 py-3 shrink-0 space-y-1 ${isNightMode ? 'border-t border-slate-800' : 'border-t border-slate-100/80'
          }`}>
          <div
            className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all ${isNightMode ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-100/60 text-slate-700'
              }`}
          >
            <div className="flex items-center gap-3">
              <Moon size={20} className={isNightMode ? 'text-slate-400' : 'text-slate-500'} />
              <span className="text-xs font-semibold">Ночной режим</span>
            </div>
            <button
              onClick={() => onToggleNightMode?.(!isNightMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isNightMode ? 'bg-[#2F80ED]' : 'bg-slate-300'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isNightMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <button
            onClick={() => {
              handleClose()
              onLogout()
            }}
            className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-red-500 active:scale-98 transition-all ${isNightMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50/80'}`}
          >
            <SignOut size={20} />
            <span>Выход</span>
          </button>
        </div>
      </div>
    </div>
  )
}
