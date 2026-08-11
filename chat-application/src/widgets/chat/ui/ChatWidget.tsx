'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  List,
  MagnifyingGlass,
  PaperPlaneRight,
  Paperclip,
  Smiley,
  Image,
  FileText,
  X,
  CalendarBlank,
  SealCheck,
} from '@phosphor-icons/react'
import { HeyChatLogo, Button, UserAvatar } from '@/shared/ui'
import { EditProfileModal } from '@/features/user-profile'
import { SidebarDrawer } from './SidebarDrawer'
import type { User } from '@/entities/user'

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  isReadOnly?: boolean
  isVerified?: boolean
  statusText?: string
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'HeyChat!',
    avatar: 'brand',
    lastMessage: 'Добро пожаловать в HeyChat!',
    time: '10:00',
    unread: 0,
    online: true,
    isReadOnly: true,
    statusText: 'Официальный канал',
  },
  {
    id: '2',
    name: 'Алексей Смирнов',
    avatar: '👨‍💻',
    lastMessage: 'Работает супер быстро! ⚡️ Не забудь...',
    time: '15:15',
    unread: 2,
    online: true,
    isVerified: true,
    statusText: 'в сети',
  },
  {
    id: '3',
    name: 'Екатерина Васина',
    avatar: '👩‍💻',
    lastMessage: 'Макеты нового UI уже готовы, отправила...',
    time: '14:20',
    unread: 1,
    online: true,
    statusText: 'была недавно',
  },
  {
    id: '4',
    name: 'Дизайн Команда',
    avatar: '🦊',
    lastMessage: 'Согласовали минималистичный стиль...',
    time: 'Вчера',
    unread: 0,
    online: false,
    statusText: '5 участников',
  },
  {
    id: '5',
    name: 'Михаил Игнатьев',
    avatar: '😎',
    lastMessage: 'Отличная работа по оптимизации...',
    time: 'Пн',
    unread: 0,
    online: true,
    statusText: 'в сети',
  },
]

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMine: boolean
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'HeyChat!',
      text: 'Привет, Саша! Добро пожаловать в рабочее пространство HeyChat! 🚀',
      time: '10:00',
      isMine: false,
    },
  ],
  '2': [
    {
      id: 'm10',
      sender: 'Алексей Смирнов',
      text: 'Отлично! У нас сегодня по плану релиз обновления UI и тестирование поиска по сообщениям.',
      time: '10:05',
      isMine: false,
    },
    {
      id: 'm11',
      sender: 'Саша',
      text: 'Предлагаю использовать Node.js + Socket.io для прототипа или FastAPI WebSocket endpoint.',
      time: '12:00',
      isMine: true,
    },
  ],
  '3': [
    {
      id: 'm3_1',
      sender: 'Екатерина Васина',
      text: 'Привет! Макеты нового UI уже готовы, отправила ссылки в фигму 🎨',
      time: '14:20',
      isMine: false,
    },
  ],
  '4': [
    {
      id: 'm4_1',
      sender: 'Дизайн Команда',
      text: 'Согласовали минималистичный стиль боковой панели! Все лишние детали убрали, добавили больше воздуха.',
      time: 'Вчера',
      isMine: false,
    },
  ],
  '5': [
    {
      id: 'm5_1',
      sender: 'Михаил Игнатьев',
      text: 'Отличная работа по оптимизации интерфейса! Теперь список чатов выглядит очень чисто и современно 🔥',
      time: 'Пн',
      isMine: false,
    },
  ],
}

const EMOJI_LIST = [
  '😊', '😂', '😍', '❤️', '👍', '🔥', '🎉', '✨',
  '🚀', '🥳', '😎', '🙏', '🙌', '💡', '💯', '💩',
  '👋', '🤖', '🙈', '⚡️', '💙', '😜', '🤩', '🎯',
]

const STICKER_LIST = [
  { id: 's1', icon: '🐱', name: 'Котёнок' },
  { id: 's2', icon: '🐶', name: 'Песель' },
  { id: 's3', icon: '🦊', name: 'Лисенок' },
  { id: 's4', icon: '🐻', name: 'Мишка' },
  { id: 's5', icon: '🦄', name: 'Единорог' },
  { id: 's6', icon: '👾', name: 'Геймер' },
  { id: 's7', icon: '🍩', name: 'Пончик' },
  { id: 's8', icon: '🥑', name: 'Авокадо' },
]

export function ChatWidget() {
  const router = useRouter()
  const [selectedChatId, setSelectedChatId] = useState<string>('2')
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [drawerInitialView, setDrawerInitialView] = useState<'settings' | 'profile'>('settings')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [pickerTab, setPickerTab] = useState<'emoji' | 'sticker'>('emoji')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Global Night Mode state — always start false to match SSR, then sync from localStorage after hydration
  const [isNightMode, setIsNightMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('heychat_night_mode') === 'true'
    setIsNightMode(stored)
  }, [])

  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isNightMode])

  const handleToggleNightMode = (val: boolean) => {
    setIsNightMode(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('heychat_night_mode', String(val))
    }
  }

  // Current user state
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    username: 'Саша',
    userTag: '@sasha',
    email: 'sasha@mail.ru',
    avatar: 'user',
    bio: 'Разработчик HeyChat',
    status: 'ONLINE',
    createdAt: new Date().toISOString(),
  })

  const activeChat = MOCK_CHATS.find((c) => c.id === selectedChatId) ?? MOCK_CHATS[0]
  const currentMessages = messages[selectedChatId] ?? []

  const filteredMessages = searchQuery.trim()
    ? currentMessages.filter((msg) =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
    : currentMessages

  const filteredChats = sidebarSearch.trim()
    ? MOCK_CHATS.filter((c) =>
      c.name.toLowerCase().includes(sidebarSearch.toLowerCase().trim()) ||
      c.lastMessage.toLowerCase().includes(sidebarSearch.toLowerCase().trim())
    )
    : MOCK_CHATS

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
    return parts.map((part, idx) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={idx} className={`rounded px-0.5 font-medium ${isNightMode ? 'bg-amber-500/30 text-amber-200' : 'bg-amber-200 text-slate-900'}`}>
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const scrollToMessage = (msgId: string) => {
    setHighlightedMsgId(msgId)
    const el = document.getElementById(`msg-${msgId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setTimeout(() => {
      setHighlightedMsgId(null)
    }, 2500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
    }))
    setInputText('')
  }

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji)
  }

  const handleStickerClick = (stickerIcon: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      text: stickerIcon,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }
    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
    }))
    setShowEmojiPicker(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      text: `📎 Файл прикреплен: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }
    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
    }))
    setShowAttachMenu(false)
    if (e.target) e.target.value = ''
  }

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-200 ${
      isNightMode ? 'bg-[#0f172a] text-slate-100 dark' : 'bg-slate-50 text-foreground'
    }`}>
      {/* ── Sidebar ── */}
      <aside className={`flex w-80 flex-col border-r select-none shrink-0 transition-colors duration-200 ${
        isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        {/* Header */}
        <div className={`flex h-16 items-center justify-between px-4 shrink-0 border-b ${
          isNightMode ? 'border-slate-800' : 'border-slate-100/80'
        }`}>
          <HeyChatLogo size="sm" />

          {/* Menu Button */}
          <button
            onClick={() => {
              setDrawerInitialView('settings')
              setIsDrawerOpen(true)
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 focus:outline-none ${
              isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            aria-label="Открыть меню"
            title="Меню"
          >
            <List size={20} weight="bold" />
          </button>
        </div>

        {/* Minimalist Search Bar */}
        <div className="px-3.5 pt-3 pb-2 shrink-0">
          <div className="relative flex items-center">
            <MagnifyingGlass
              size={18}
              className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors"
            />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Поиск чатов..."
              className={`w-full rounded-xl pl-10 pr-9 py-2 text-[13px] border border-transparent transition-all focus:outline-none ${
                isNightMode
                  ? 'bg-slate-800/80 text-slate-100 placeholder:text-slate-500 focus:bg-slate-800 focus:border-slate-700'
                  : 'bg-slate-100/80 text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
              }`}
            />
            {sidebarSearch && (
              <button
                onClick={() => setSidebarSearch('')}
                className={`absolute right-2.5 p-1 rounded-lg text-slate-400 transition-colors ${isNightMode ? 'hover:text-white hover:bg-slate-800' : 'hover:text-slate-600 hover:bg-slate-200/60'}`}
                aria-label="Очистить поиск"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Chat List - Visually Clean, Minimalist & Spacious */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1.5 flex flex-col gap-1">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 text-slate-400">
              <MagnifyingGlass size={28} className="mb-2 opacity-40" />
              <p className="text-xs font-normal">Чаты не найдены</p>
            </div>
          ) : (
            filteredChats.map((chat, idx) => {
              const isSelected = chat.id === selectedChatId
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`group relative flex w-full items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150 ${
                    isSelected
                      ? (isNightMode ? 'bg-slate-800 text-white font-medium shadow-xs' : 'bg-slate-100/90 text-slate-900 font-medium')
                      : (isNightMode ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-100/60 text-slate-700')
                  }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar avatar={chat.avatar} name={chat.name} colorIndex={idx} size="md" />
                    {chat.online && (
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 shadow-xs ${
                        isNightMode ? 'ring-[#111b21]' : 'ring-white'
                      }`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`truncate text-sm tracking-tight ${
                        isSelected
                          ? (isNightMode ? 'font-bold text-white' : 'font-bold text-slate-900')
                          : (isNightMode ? 'font-semibold text-slate-200' : 'font-semibold text-slate-900')
                      }`}>
                        {chat.name}
                      </span>
                      <span className={`shrink-0 text-[11px] font-normal ${
                        isNightMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`truncate text-[13px] leading-snug ${
                      isSelected
                        ? (isNightMode ? 'text-slate-300 font-normal' : 'text-slate-600 font-normal')
                        : (isNightMode ? 'text-slate-400' : 'text-slate-500')
                    }`}>
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 flex shrink-0 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-xs ml-1">
                      {chat.unread}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* ── Main Chat Window ── */}
      <main className={`flex flex-1 flex-col overflow-hidden transition-colors duration-200 ${
        isNightMode ? 'bg-[#0b141a]' : 'bg-slate-50'
      }`}>
        {/* Chat Header */}
        <header className={`flex h-[64px] items-center justify-between border-b px-4 shrink-0 transition-colors duration-200 ${
          isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-border'
        }`}>
          <div className="flex items-center gap-3">
            <UserAvatar avatar={activeChat.avatar} name={activeChat.name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`font-semibold text-base ${isNightMode ? 'text-slate-100' : 'text-foreground'}`}>
                  {activeChat.name}
                </h2>
                {activeChat.isVerified && (
                  <SealCheck size={18} weight="fill" className="text-[#2F80ED] shrink-0" />
                )}
              </div>
              <p className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-muted'}`}>
                {activeChat.statusText ?? (activeChat.online ? 'в сети' : 'был(а) недавно')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSearchOpen((prev) => !prev)
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                isSearchOpen
                  ? (isNightMode ? 'bg-slate-800 text-blue-400 font-semibold' : 'bg-slate-100 text-heychat font-semibold')
                  : (isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-foreground')
              }`}
              title="Поиск сообщений"
              aria-label="Поиск сообщений"
            >
              <MagnifyingGlass size={20} weight="bold" />
            </button>
          </div>
        </header>

        {/* Content Area (Chat Feed + Right Search Panel) */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Chat Feed & Input */}
          <div className={`flex flex-1 flex-col min-w-0 ${isNightMode ? 'bg-[#0b141a]' : 'bg-slate-50'}`}>
            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentMessages.map((msg) => {
                const isHighlighted = highlightedMsgId === msg.id
                return (
                  <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex flex-col transition-all duration-300 ${
                      msg.isMine ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 ${
                        isHighlighted
                          ? 'ring-4 ring-amber-400/80 scale-[1.02]'
                          : ''
                      } ${
                        msg.isMine
                          ? (isNightMode ? 'bg-[#005c4b] text-slate-100 rounded-br-none' : 'bg-[#69a1c8] text-white rounded-br-none')
                          : (isNightMode ? 'bg-[#202c33] text-slate-100 border border-slate-700/50 rounded-bl-none' : 'bg-white text-foreground border border-border/60 rounded-bl-none')
                      }`}
                    >
                      {!msg.isMine && (
                        <p className={`mb-1 text-[11px] font-semibold ${
                          isNightMode ? 'text-blue-400' : 'text-heychat'
                        }`}>
                          {msg.sender}
                        </p>
                      )}
                      <p className="leading-relaxed">
                        {highlightMatch(msg.text, searchQuery)}
                      </p>
                      <span
                        className={`block text-right text-[10px] mt-1 ${
                          msg.isMine
                            ? (isNightMode ? 'text-emerald-200/80' : 'text-white/80')
                            : (isNightMode ? 'text-slate-400' : 'text-muted')
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Bottom Input or Read-Only banner */}
            {activeChat.isReadOnly ? (
              <div className={`border-t p-3.5 text-center text-xs font-medium flex items-center justify-center gap-2 select-none ${
                isNightMode ? 'border-slate-800 bg-[#111b21] text-slate-400' : 'border-border bg-slate-100/90 text-slate-500'
              }`}>
                <span>Отправлять сообщения может только {activeChat.name}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSendMessage}
                className={`relative border-t p-3 transition-colors duration-200 ${
                  isNightMode ? 'border-slate-800 bg-[#111b21]' : 'border-border bg-white'
                }`}
              >
                {/* Emoji / Sticker Popover */}
                {showEmojiPicker && (
                  <div className={`absolute bottom-18 left-3 z-30 w-72 rounded-2xl border p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                    isNightMode ? 'bg-[#111b21] border-slate-800 text-slate-100' : 'bg-white border-border text-slate-900'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-2 mb-2 ${
                      isNightMode ? 'border-slate-800' : 'border-border/60'
                    }`}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPickerTab('emoji')}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            pickerTab === 'emoji'
                              ? (isNightMode ? 'bg-slate-800 text-white font-semibold' : 'bg-slate-100 text-foreground font-semibold')
                              : (isNightMode ? 'text-slate-400 hover:text-white' : 'text-muted hover:text-foreground')
                          }`}
                        >
                          Эмодзи
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerTab('sticker')}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            pickerTab === 'sticker'
                              ? (isNightMode ? 'bg-slate-800 text-white font-semibold' : 'bg-slate-100 text-foreground font-semibold')
                              : (isNightMode ? 'text-slate-400 hover:text-white' : 'text-muted hover:text-foreground')
                          }`}
                        >
                          Стикеры
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className={`p-1 rounded-md transition-colors ${
                          isNightMode ? 'text-slate-400 hover:text-white' : 'text-muted hover:text-foreground'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {pickerTab === 'emoji' ? (
                      <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-1">
                        {EMOJI_LIST.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-all active:scale-95 ${
                              isNightMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                        {STICKER_LIST.map((sticker) => (
                          <button
                            key={sticker.id}
                            type="button"
                            onClick={() => handleStickerClick(sticker.icon)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${
                              isNightMode ? 'border-slate-800 hover:bg-slate-800/80' : 'border-border/40 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl mb-1">{sticker.icon}</span>
                            <span className={`text-[10px] truncate w-full text-center ${
                              isNightMode ? 'text-slate-400' : 'text-muted'
                            }`}>
                              {sticker.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Attachment Menu Popover */}
                {showAttachMenu && (
                  <div className={`absolute bottom-18 left-3 z-30 w-52 rounded-xl border p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                    isNightMode ? 'bg-[#111b21] border-slate-800 text-slate-100' : 'bg-white border-border text-slate-900'
                  }`}>
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowAttachMenu(false)
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-foreground hover:bg-slate-100'
                      }`}
                    >
                      <Image size={18} className="text-blue-500" />
                      <span>Фото или видео</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowAttachMenu(false)
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-foreground hover:bg-slate-100'
                      }`}
                    >
                      <FileText size={18} className="text-emerald-500" />
                      <span>Документ</span>
                    </button>
                  </div>
                )}

                <div className="relative flex items-center">
                  {/* Left buttons inside input */}
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachMenu((prev) => !prev)
                        setShowEmojiPicker(false)
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        isNightMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
                      }`}
                      title="Прикрепить файл"
                      aria-label="Прикрепить файл"
                    >
                      <Paperclip size={20} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmojiPicker((prev) => !prev)
                        setShowAttachMenu(false)
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        isNightMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-200/60'
                      }`}
                      title="Стикеры и эмодзи"
                      aria-label="Стикеры и эмодзи"
                    >
                      <Smiley size={20} weight="bold" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className={`w-full rounded-full border pl-24 pr-14 py-3.5 text-sm transition-colors ${
                      isNightMode
                        ? 'bg-slate-800/80 text-slate-100 border-slate-700 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none'
                        : 'bg-slate-50 text-foreground border-border placeholder:text-muted/60 focus:border-border-focus focus:outline-none'
                    }`}
                  />

                  <Button
                    type="submit"
                    className="!absolute right-1.5 top-1/2 -translate-y-1/2 !w-9 !h-9 !p-0 flex items-center justify-center shrink-0 !rounded-full"
                    title="Отправить"
                    aria-label="Отправить сообщение"
                  >
                    <PaperPlaneRight size={18} weight="bold" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Search Side Panel (Matching Telegram Desktop) */}
          {isSearchOpen && (
            <aside className={`w-80 border-l flex flex-col shrink-0 animate-in slide-in-from-right duration-200 ${
              isNightMode ? 'bg-[#111b21] border-slate-800 text-slate-100' : 'bg-white border-border text-foreground'
            }`}>
              {/* Panel Header */}
              <div className={`flex h-[64px] items-center gap-3 border-b px-4 shrink-0 ${
                isNightMode ? 'border-slate-800' : 'border-border'
              }`}>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-foreground'
                  }`}
                  title="Закрыть поиск"
                >
                  <X size={20} />
                </button>
                <h3 className="font-semibold text-sm">Поиск сообщений</h3>
              </div>

              {/* Panel Search Input Bar */}
              <div className={`p-3 border-b flex items-center gap-2 shrink-0 ${
                isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-border/40'
              }`}>
                <button
                  type="button"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors shrink-0 ${
                    isNightMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Поиск по дате"
                >
                  <CalendarBlank size={20} />
                </button>

                <div className="relative flex-1 flex items-center">
                  <MagnifyingGlass
                    size={18}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    className={`w-full rounded-full border pl-9 pr-8 py-2 text-xs transition-all ${
                      isNightMode
                        ? 'bg-slate-800 text-slate-100 border-slate-700 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none'
                        : 'bg-slate-50 text-foreground border-border placeholder:text-slate-400 focus:border-border-focus focus:bg-white focus:outline-none'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute right-2.5 transition-colors ${isNightMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Очистить"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Panel Body */}
              <div className="flex-1 overflow-y-auto p-3">
                {!searchQuery.trim() ? (
                  <div className="flex h-full items-center justify-center text-center text-xs text-slate-400 px-6 select-none">
                    Поиск сообщений с {activeChat.name}.
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center text-xs text-slate-400">
                    <MagnifyingGlass size={32} className="mb-2 opacity-40" />
                    <span>Сообщения не найдены</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium text-slate-400 px-1 mb-1">
                      Найдено: {filteredMessages.length}
                    </div>
                    {filteredMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => scrollToMessage(msg.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] ${
                          isNightMode
                            ? 'border-slate-800 hover:bg-slate-800/80 text-slate-200'
                            : 'border-border/40 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className={isNightMode ? 'text-blue-400 truncate' : 'text-heychat truncate'}>
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">
                            {msg.time}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${
                          isNightMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {highlightMatch(msg.text, searchQuery)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Slide-out Sidebar Drawer Panel */}
      <SidebarDrawer
        user={currentUser}
        isOpen={isDrawerOpen}
        initialView={drawerInitialView}
        isNightMode={isNightMode}
        onToggleNightMode={handleToggleNightMode}
        onClose={() => setIsDrawerOpen(false)}
        onOpenProfile={() => {
          setIsDrawerOpen(false)
          setIsProfileOpen(true)
        }}
        onSaveProfile={(updated) => setCurrentUser(updated)}
        onLogout={handleLogout}
      />

      {/* Telegram Desktop Style Profile Modal */}
      <EditProfileModal
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={(updated) => setCurrentUser(updated)}
      />
    </div>
  )
}
