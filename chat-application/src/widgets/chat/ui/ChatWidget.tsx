'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
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
  Checks,
  DotsThreeVertical,
  ChartBar,
  CheckCircle,
  PaintBrush,
  Export,
  Broom,
  Trash,
  Plus,
  Check,
  Sparkle,
  Microphone,
  Play,
  Pause,
  Rewind,
  FastForward,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash,
  Phone,
  At,
  Info,
  Bell,
  BellSlash,
  ShareNetwork,
  Prohibit,
  ChatCircleDots,
  CaretLeft,
  CaretRight,
  ArrowDown,
  CalendarCheck,
  DownloadSimple,
  ShareFat,
  ArrowsOut,
  ArrowsIn,
} from '@phosphor-icons/react'
import { HeyChatLogo, Button, UserAvatar } from '@/shared/ui'
import { SidebarDrawer } from './SidebarDrawer'
import type { User } from '@/entities/user'
import { updateProfile as apiUpdateProfile } from '@/features/user-profile/api/userApi'
import {
  ChatSettings,
  DEFAULT_CHAT_SETTINGS,
  BUBBLE_COLOR_PRESETS,
  WALLPAPER_PRESETS,
} from '../model/wallpaper'

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

export interface PollOption {
  id: string
  text: string
  votes: number
  voters?: string[]
}

export interface PollData {
  question: string
  options: PollOption[]
  multiple?: boolean
  anonymous?: boolean
  totalVotes: number
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface ChecklistData {
  title: string
  items: ChecklistItem[]
}

export interface VoiceData {
  duration: string
  seconds: number
  wave: number[]
  audioUrl?: string
}

export interface Message {
  id: string
  sender: string
  text: string
  time: string
  date?: string
  isMine: boolean
  isGif?: boolean
  poll?: PollData
  checklist?: ChecklistData
  voice?: VoiceData
  image?: string
  fileName?: string
  fileSize?: string
}

const TODAY_DATE_STR = new Date().toISOString().split('T')[0]
const YESTERDAY_DATE_STR = new Date(Date.now() - 86400000).toISOString().split('T')[0]

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
    isVerified: true,
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
    avatar: '👨‍💼',
    lastMessage: 'Отличная работа по оптимизации...',
    time: 'Пн',
    unread: 0,
    online: false,
    statusText: 'был(а) недавно',
  },
]

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'HeyChat!',
      text: 'Привет, Саша! Добро пожаловать в рабочее пространство HeyChat! 🚀',
      time: '10:00',
      date: TODAY_DATE_STR,
      isMine: false,
    },
  ],
  '2': [
    {
      id: 'm10',
      sender: 'Алексей Смирнов',
      text: 'Отлично! У нас сегодня по плану релиз обновления UI и тестирование поиска по сообщениям.',
      time: '10:05',
      date: TODAY_DATE_STR,
      isMine: false,
    },
    {
      id: 'm11',
      sender: 'Саша',
      text: 'Предлагаю использовать Node.js + Socket.io для прототипа или FastAPI WebSocket endpoint.',
      time: '12:00',
      date: TODAY_DATE_STR,
      isMine: true,
    },
  ],
  '3': [
    {
      id: 'm3_1',
      sender: 'Екатерина Васина',
      text: 'Привет! Макеты нового UI уже готовы, отправила ссылки в фигму 🎨',
      time: '14:20',
      date: TODAY_DATE_STR,
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

export interface EmojiCategory {
  id: string
  name: string
  icon: string
  emojis: string[]
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Эмоции',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
      '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
      '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟',
      '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
      '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
      '👺', '👻', '👽', '👾', '🤖',
    ],
  },
  {
    id: 'gestures',
    name: 'Жесты',
    icon: '👋',
    emojis: [
      '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
      '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀',
      '👁', '👅', '👄', '🫦', '💋', '👣', '🫂', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱',
    ],
  },
  {
    id: 'hearts',
    name: 'Сердца',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '🔥', '✨', '⚡️', '💥', '💫', '⭐️', '🌟', '☄️', '💯', '💢', '💨', '💤', '🎉',
      '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '💎', '💡', '🔔', '📣', '📢', '💬', '💭',
      '🎯', '🎲', '🧩', '🚀', '🔮', '🧿', '🍀', '🌸', '🌹', '🌺', '🌻', '🌼', '💐', '🪐', '☀️', '🌙',
    ],
  },
  {
    id: 'animals',
    name: 'Животные',
    icon: '🐱',
    emojis: [
      '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
      '🐧', '🐦', '🐤', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🐢', '🐍', '🦎', '🐙', '🐬', '🐳',
      '🦈', '🦭', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐕',
      '🐩', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥',
    ],
  },
  {
    id: 'food',
    name: 'Еда',
    icon: '🍔',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥',
      '🥝', '🍅', '🥑', '🥦', '🥒', '🌶', '🌽', '🥕', '🥔', '🥐', '🍞', '🥖', '🥨', '🧀', '🍳', '🥞',
      '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🍜', '🍝',
      '🍣', '🍤', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '☕️', '🍵', '🧃',
    ],
  },
  {
    id: 'objects',
    name: 'Предметы',
    icon: '⚽️',
    emojis: [
      '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🥊', '🥋', '🛹', '🛼', '🎿',
      '⛷', '🏂', '🏋️', '🚴', '🏆', '🎮', '🕹', '🎲', '♟', '🎳', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹',
      '🥁', '🎷', '🎺', '🎸', '🎻', '🚗', '🚕', '🚙', '🏎', '🚓', '🚑', '🚒', '🏍', '🚲', '✈️', '⛵️',
      '📱', '💻', '⌨️', '🖥', '📷', '📸', '📹', '🎥', '📺', '📻', '⏰', '⏱', '⌚️', '⌛️', '⏳', '🔑',
    ],
  },
]

const EMOJI_LIST = EMOJI_CATEGORIES.flatMap((c) => c.emojis)

export interface GiphyGifItem {
  id: string
  url: string
  title: string
  tag?: string
}

const DEFAULT_TRENDING_GIFS: GiphyGifItem[] = [
  { id: 'g1', url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif', title: 'Popcorn Cat 🍿', tag: 'cats' },
  { id: 'g2', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', title: 'Typing Cat 💻', tag: 'cats' },
  { id: 'g3', url: 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif', title: 'Dancing Cat 🎵', tag: 'cats' },
  { id: 'g4', url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', title: 'Mind Blown 🤯', tag: 'wow' },
  { id: 'g5', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', title: 'Leo Clapping 👏', tag: 'reactions' },
  { id: 'g6', url: 'https://media.giphy.com/media/11ISw6cxFx0j4c/giphy.gif', title: 'Dog Coding 🐕', tag: 'memes' },
  { id: 'g7', url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif', title: 'Happy Dance 🎉', tag: 'dance' },
  { id: 'g8', url: 'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif', title: 'Excited Yay 🚀', tag: 'reactions' },
  { id: 'g9', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif', title: 'Cat Shocked 🙀', tag: 'cats' },
  { id: 'g10', url: 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif', title: 'Party Hard 🥳', tag: 'dance' },
  { id: 'g11', url: 'https://media.giphy.com/media/QMHoU66sBXCAIzFs9G/giphy.gif', title: 'This Is Fine 🔥', tag: 'memes' },
  { id: 'g12', url: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', title: 'Thumbs Up 👍', tag: 'reactions' },
  { id: 'g13', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif', title: 'Friday Night 🕺', tag: 'dance' },
  { id: 'g14', url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', title: 'Cat Wink 😉', tag: 'cats' },
  { id: 'g15', url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif', title: 'Blinking Guy 😳', tag: 'reactions' },
  { id: 'g16', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1bWc3azFyeTFnMGl3eDB3amJqOHVpdWh4dmF0cWNiaGFnd29pMiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/13HgwGsXF0aiGY/giphy.gif', title: 'Happy Dog 🐶', tag: 'cats' },
  { id: 'g17', url: 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif', title: 'Cry Waterfall 😭', tag: 'reactions' },
  { id: 'g18', url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif', title: 'Gatsby Cheers 🥂', tag: 'memes' },
  { id: 'g19', url: 'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif', title: 'Facepalm 🤦‍♂️', tag: 'reactions' },
  { id: 'g20', url: 'https://media.giphy.com/media/ule4akeXnY9FbVSpu8/giphy.gif', title: 'Cat Vibing 🎧', tag: 'cats' },
  { id: 'g21', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', title: 'Brain Explosion 💥', tag: 'wow' },
  { id: 'g22', url: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif', title: 'Yes Excited 🙌', tag: 'reactions' },
  { id: 'g23', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', title: 'Cat Hug ❤️', tag: 'cats' },
  { id: 'g24', url: 'https://media.giphy.com/media/8vUEXZA2me7vnuUvrs/giphy.gif', title: 'Shrug 🤷‍♂️', tag: 'memes' },
  { id: 'g25', url: 'https://media.giphy.com/media/Y4yWtyQtxMeJ8GlAiR/giphy.gif', title: 'Chill Out 😎', tag: 'reactions' },
  { id: 'g26', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Cat Snuggle 🥰', tag: 'cats' },
  { id: 'g27', url: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif', title: 'Applause 🌟', tag: 'reactions' },
  { id: 'g28', url: 'https://media.giphy.com/media/fV7xZPk6aeiAJV6bVR/giphy.gif', title: 'Dance Vibes 💃', tag: 'dance' },
  { id: 'g29', url: 'https://media.giphy.com/media/l2YWCHf5RZixLHiDK/giphy.gif', title: 'Shocked 👀', tag: 'wow' },
  { id: 'g30', url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif', title: 'Magic Sparkles ✨', tag: 'wow' },
]

const GIF_CATEGORIES = [
  { id: 'trending', name: '🔥 Тренды' },
  { id: 'cats', name: '🐱 Котики' },
  { id: 'memes', name: '😂 Мемы' },
  { id: 'reactions', name: '👏 Реакции' },
  { id: 'dance', name: '💃 Танцы' },
  { id: 'wow', name: '✨ Wow' },
  { id: 'party', name: '🥳 Туса' },
  { id: 'love', name: '❤️ Любовь' },
]

const QUICK_EMOJI_FILTERS = [
  { emoji: '❤️', query: 'love' },
  { emoji: '👍', query: 'thumbs up' },
  { emoji: '🔥', query: 'fire lit' },
  { emoji: '😂', query: 'lol funny' },
  { emoji: '🎉', query: 'party celebration' },
  { emoji: '🐱', query: 'cute cat' },
  { emoji: '🐶', query: 'dog' },
  { emoji: '💃', query: 'dance happy' },
  { emoji: '🤯', query: 'mind blown' },
  { emoji: '😭', query: 'crying sad' },
  { emoji: '😎', query: 'cool sunglasses' },
  { emoji: '👏', query: 'applause clap' },
]

export function ChatWidget() {
  const router = useRouter()
  const [selectedChatId, setSelectedChatId] = useState<string>('2')
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedSearchDate, setSelectedSearchDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profileActiveTab, setProfileActiveTab] = useState<'media' | 'files' | 'voice'>('media')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [drawerInitialView, setDrawerInitialView] = useState<'settings' | 'profile'>('settings')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [pickerTab, setPickerTab] = useState<'emoji' | 'gif'>('emoji')
  const [emojiSearch, setEmojiSearch] = useState('')
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>('all')
  const [gifSearch, setGifSearch] = useState('')
  const [activeGifCategory, setActiveGifCategory] = useState<string>('trending')
  const [isGifLoading, setIsGifLoading] = useState(false)
  const [customGifs, setCustomGifs] = useState<GiphyGifItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Smart Auto-Scroll & Scroll-to-Bottom States
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef<boolean>(true)
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false)
  const [unreadNewMessagesCount, setUnreadNewMessagesCount] = useState(0)
  const prevMessagesLengthRef = useRef(0)

  // Chat Header Actions Dropdown Menu State
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false)
  const chatMenuRef = useRef<HTMLDivElement>(null)

  // Hover Timers for Attach & Emoji Menus
  const attachHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const emojiHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleAttachMouseEnter = () => {
    if (attachHoverTimeoutRef.current) clearTimeout(attachHoverTimeoutRef.current)
    setShowAttachMenu(true)
    setShowEmojiPicker(false)
  }

  const handleAttachMouseLeave = () => {
    attachHoverTimeoutRef.current = setTimeout(() => {
      setShowAttachMenu(false)
    }, 250)
  }

  const handleEmojiMouseEnter = () => {
    if (emojiHoverTimeoutRef.current) clearTimeout(emojiHoverTimeoutRef.current)
    setShowEmojiPicker(true)
    setShowAttachMenu(false)
  }

  const handleEmojiMouseLeave = () => {
    emojiHoverTimeoutRef.current = setTimeout(() => {
      setShowEmojiPicker(false)
    }, 250)
  }

  // Poll Creation Modal State
  const [showPollModal, setShowPollModal] = useState(false)
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [pollMultiple, setPollMultiple] = useState(false)
  const [pollAnonymous, setPollAnonymous] = useState(true)

  // Checklist Creation Modal State
  const [showChecklistModal, setShowChecklistModal] = useState(false)
  const [checklistTitle, setChecklistTitle] = useState('')
  const [checklistItems, setChecklistItems] = useState(['', ''])

  // Real Microphone Voice Message Recording State & Refs
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const recordedWaveDataRef = useRef<number[]>([])
  const [liveWaveBars, setLiveWaveBars] = useState<number[]>([
    12, 18, 10, 22, 14, 26, 16, 20, 28, 14, 18, 24, 12, 16, 22, 10, 18,
  ])

  // Voice Playback State & Refs
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [activeVoiceMsgId, setActiveVoiceMsgId] = useState<string | null>(null)
  const [showTopBarVolume, setShowTopBarVolume] = useState(false)
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState<Record<string, number>>({})
  const [voiceVolume, setVoiceVolume] = useState(1.0)
  const [voiceSpeed, setVoiceSpeed] = useState<1 | 1.5 | 2>(1)
  const [showVolumeForMsg, setShowVolumeForMsg] = useState<string | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const currentAudioMsgIdRef = useRef<string | null>(null)

  // Media Preview Lightbox State & HUD
  const [previewMedia, setPreviewMedia] = useState<{
    url: string
    sender?: string
    time?: string
    title?: string
    isGif?: boolean
  } | null>(null)
  const [isMediaZoomed, setIsMediaZoomed] = useState(false)

  const handleOpenMediaViewer = (msg: Message) => {
    if (!msg.image) return
    setIsMediaZoomed(false)
    setPreviewMedia({
      url: msg.image,
      sender: msg.sender,
      time: msg.time,
      title: msg.isGif ? 'GIF' : (msg.fileName || msg.text || 'Изображение'),
      isGif: Boolean(msg.isGif || msg.image.includes('.gif') || msg.image.includes('giphy') || msg.image.includes('tenor')),
    })
  }

  const handleNavigateMedia = useCallback((direction: 'prev' | 'next') => {
    const allMedia = (messages[selectedChatId] ?? []).filter((m) => Boolean(m.image))
    if (!previewMedia || allMedia.length <= 1) return
    const currentIndex = allMedia.findIndex((m) => m.image === previewMedia.url)
    if (currentIndex === -1) return

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0) nextIndex = allMedia.length - 1
    if (nextIndex >= allMedia.length) nextIndex = 0

    const nextMsg = allMedia[nextIndex]
    if (nextMsg?.image) {
      setIsMediaZoomed(false)
      setPreviewMedia({
        url: nextMsg.image,
        sender: nextMsg.sender,
        time: nextMsg.time,
        title: nextMsg.isGif ? 'GIF' : (nextMsg.fileName || nextMsg.text || 'Изображение'),
        isGif: Boolean(nextMsg.isGif || nextMsg.image.includes('.gif') || nextMsg.image.includes('giphy') || nextMsg.image.includes('tenor')),
      })
    }
  }, [messages, selectedChatId, previewMedia])

  const handleDownloadMedia = (url: string, filename = 'heychat-media') => {
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.gif`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showToast('Файл сохранён!')
  }

  const handleShareMedia = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      showToast('Ссылка на медиа скопирована в буфер!')
    }
  }

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  // Close dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) {
        setIsChatMenuOpen(false)
      }
    }
    if (isChatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatMenuOpen])

  // Global Night Mode state — always start false to match SSR, then sync from localStorage after hydration
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('heychat_night_mode') === 'true'
  })

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

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const fallback: User = {
      id: 'usr-1',
      username: 'Саша',
      userTag: '@sasha',
      email: 'sasha@mail.ru',
      avatar: 'user',
      bio: 'Разработчик HeyChat',
      status: 'ONLINE',
      createdAt: new Date().toISOString(),
    }
    if (typeof window === 'undefined') return fallback
    const saved = localStorage.getItem('heychat_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.username) return parsed
      } catch {}
    }
    return fallback
  })

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('heychat_user', JSON.stringify(updatedUser))
    }
    try {
      await apiUpdateProfile({
        username: updatedUser.username !== currentUser.username ? updatedUser.username : undefined,
        userTag: updatedUser.userTag?.replace('@', '') !== currentUser.userTag?.replace('@', '') ? updatedUser.userTag?.replace('@', '') : undefined,
        bio: updatedUser.bio !== currentUser.bio ? updatedUser.bio : undefined,
        avatarUrl: updatedUser.avatar !== currentUser.avatar ? updatedUser.avatar : undefined,
      })
    } catch (err) {
      console.error('Ошибка обновления профиля:', err)
    }
  }

  
    const [chatSettings, setChatSettings] = useState<ChatSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_CHAT_SETTINGS
    const saved = localStorage.getItem('heychat_chat_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.wallpaper) {
          if (parsed.wallpaper.category !== 'custom') {
            const matched = WALLPAPER_PRESETS.find((wp) => wp.id === parsed.wallpaper.id)
            if (matched) {
              return {
                ...parsed,
                wallpaper: {
                  ...matched,
                  blur: parsed.wallpaper.blur ?? 0,
                  dim: parsed.wallpaper.dim ?? 0,
                },
              }
            }
          }
          return parsed
        }
      } catch {}
    }
    return DEFAULT_CHAT_SETTINGS
  })

  const handleUpdateChatSettings = (newSettings: ChatSettings) => {
    setChatSettings(newSettings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('heychat_chat_settings', JSON.stringify(newSettings))
    }
  }

  
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS)

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey
      const isAlt = e.altKey

      
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
        return
      }

      
      if (isCmdOrCtrl && (e.key === '/' || e.key === ',')) {
        e.preventDefault()
        setDrawerInitialView('settings')
        setIsDrawerOpen(true)
        return
      }

      
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        handleToggleNightMode(!isNightMode)
        return
      }

      
      if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setShowEmojiPicker((prev) => !prev)
        return
      }

      
      if (isCmdOrCtrl && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        setShowAttachMenu((prev) => !prev)
        return
      }

      
      if (isAlt && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        setChats((currentChats) => {
          const currentIndex = currentChats.findIndex((c) => c.id === selectedChatId)
          if (currentIndex === -1) return currentChats
          const nextIndex =
            e.key === 'ArrowUp'
              ? (currentIndex - 1 + currentChats.length) % currentChats.length
              : (currentIndex + 1) % currentChats.length
          setSelectedChatId(currentChats[nextIndex].id)
          return currentChats
        })
        return
      }

      
      if (e.key === 'ArrowLeft' && previewMedia) {
        handleNavigateMedia('prev')
        return
      }
      if (e.key === 'ArrowRight' && previewMedia) {
        handleNavigateMedia('next')
        return
      }

      
      if (e.key === 'Escape') {
        if (previewMedia) {
          setPreviewMedia(null)
          setIsMediaZoomed(false)
          return
        }
        if (showPollModal) {
          setShowPollModal(false)
          return
        }
        if (showChecklistModal) {
          setShowChecklistModal(false)
          return
        }
        if (isChatMenuOpen) {
          setIsChatMenuOpen(false)
          return
        }
        if (showEmojiPicker) {
          setShowEmojiPicker(false)
          return
        }
        if (showAttachMenu) {
          setShowAttachMenu(false)
          return
        }
        if (isProfileOpen) {
          setIsProfileOpen(false)
          return
        }
        if (isSearchOpen) {
          setIsSearchOpen(false)
          return
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedChatId,
    showEmojiPicker,
    showAttachMenu,
    isSearchOpen,
    isProfileOpen,
    isDrawerOpen,
    isNightMode,
    showPollModal,
    showChecklistModal,
    isChatMenuOpen,
    previewMedia,
    handleNavigateMedia,
  ])

  
  

  const selectChat = (id: string) => {
    setSelectedChatId(id)
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
    setUnreadNewMessagesCount(0)
    setShowScrollBottomBtn(false)
    isNearBottomRef.current = true
  }

  const activeChat = chats.find((c) => c.id === selectedChatId) ?? chats[0]
  const currentMessages = useMemo(() => messages[selectedChatId] ?? [], [messages, selectedChatId])

  const displayedGifs = useMemo(() => {
    if (customGifs.length > 0) return customGifs
    if (activeGifCategory === 'trending') return DEFAULT_TRENDING_GIFS
    return DEFAULT_TRENDING_GIFS.filter((g) => g.tag === activeGifCategory)
  }, [customGifs, activeGifCategory])

  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ]

  const formatSearchDateTitle = (dateStr: string) => {
    if (dateStr === TODAY_DATE_STR) return 'Сегодня'
    if (dateStr === YESTERDAY_DATE_STR) return 'Вчера'
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10)
      const monthIdx = parseInt(parts[1], 10) - 1
      const shortMonths = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
      return `${day} ${shortMonths[monthIdx] || ''}`
    }
    return dateStr
  }

  const calYear = calendarMonth.getFullYear()
  const calMonth = calendarMonth.getMonth()
  const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7 // Mon = 0
  const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  const calendarDays: Array<{
    dayNumber: number
    dateStr: string
    isToday: boolean
    isSelected: boolean
    hasMessages: boolean
  } | null> = []

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayPadded = day < 10 ? `0${day}` : `${day}`
    const monthPadded = calMonth + 1 < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`
    const dateStr = `${calYear}-${monthPadded}-${dayPadded}`
    const isToday = dateStr === TODAY_DATE_STR
    const isSelected = dateStr === selectedSearchDate
    const hasMessages = currentMessages.some(
      (m) => (m.date || (m.time === 'Вчера' ? YESTERDAY_DATE_STR : TODAY_DATE_STR)) === dateStr
    )

    calendarDays.push({
      dayNumber: day,
      dateStr,
      isToday,
      isSelected,
      hasMessages,
    })
  }

  const filteredMessages = currentMessages.filter((msg) => {
    // 1. Text Query Filter
    const query = searchQuery.toLowerCase().trim()
    const matchesText = query
      ? msg.text.toLowerCase().includes(query) ||
        (msg.fileName && msg.fileName.toLowerCase().includes(query)) ||
        (msg.poll && msg.poll.question.toLowerCase().includes(query)) ||
        (msg.checklist && msg.checklist.title.toLowerCase().includes(query))
      : true

    // 2. Date Filter
    const msgDate = msg.date || (msg.time === 'Вчера' ? YESTERDAY_DATE_STR : TODAY_DATE_STR)
    const matchesDate = selectedSearchDate ? msgDate === selectedSearchDate : true

    return matchesText && matchesDate
  })

  const filteredChats = sidebarSearch.trim()
    ? chats.filter((c) =>
      c.name.toLowerCase().includes(sidebarSearch.toLowerCase().trim()) ||
      c.lastMessage.toLowerCase().includes(sidebarSearch.toLowerCase().trim())
    )
    : chats

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

  
  const handleScrollFeed = () => {
    const el = messageContainerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const isAtBottom = distanceFromBottom <= 120
    isNearBottomRef.current = isAtBottom

    if (isAtBottom) {
      setShowScrollBottomBtn(false)
      setUnreadNewMessagesCount(0)
    } else {
      setShowScrollBottomBtn(true)
    }
  }

  
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' })
    } else if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior,
      })
    }
    setShowScrollBottomBtn(false)
    setUnreadNewMessagesCount(0)
    isNearBottomRef.current = true
  }

  
  useEffect(() => {
    prevMessagesLengthRef.current = currentMessages.length
    const timer = setTimeout(() => {
      scrollToBottom('auto')
    }, 60)
    return () => clearTimeout(timer)
  }, [selectedChatId, currentMessages.length])

  
  useEffect(() => {
    const prevCount = prevMessagesLengthRef.current
    const newCount = currentMessages.length

    if (newCount > prevCount) {
      const lastMsg = currentMessages[currentMessages.length - 1]
      // If current user sent the message, always scroll down smoothly
      // If someone else sent it, only scroll if user was already near bottom
      if (lastMsg?.isMine || isNearBottomRef.current) {
        setTimeout(() => {
          scrollToBottom('smooth')
        }, 50)
      } else {
        // User is scrolled up reading history: show button with badge
        setUnreadNewMessagesCount((prev) => prev + (newCount - prevCount))
        setShowScrollBottomBtn(true)
      }
    }

    prevMessagesLengthRef.current = newCount
  }, [currentMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: currentUser.username,
      text: inputText.trim(),
      time: timeStr,
      isMine: true,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
    }))
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessage: inputText.trim(), time: timeStr, unread: 0 } : c))
    )
    setInputText('')
  }

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji)
  }

  
  useEffect(() => {
    if (pickerTab !== 'gif') return
    const query = gifSearch.trim()
    const category = activeGifCategory

    const abortController = new AbortController()
    const timer = setTimeout(async () => {
      setIsGifLoading(true)
      try {
        const endpoint = `/api/gifs?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&limit=50`
        const res = await fetch(endpoint, { signal: abortController.signal })
        if (res.ok) {
          const data = await res.json()
          if (data.gifs && Array.isArray(data.gifs) && data.gifs.length > 0) {
            setCustomGifs(data.gifs)
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('GIF search error:', err)
        }
      } finally {
        setIsGifLoading(false)
      }
    }, 200)

    return () => {
      clearTimeout(timer)
      abortController.abort()
    }
  }, [gifSearch, activeGifCategory, pickerTab])

  const handleSendGif = (gifUrl: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: currentUser.username,
      text: '',
      image: gifUrl,
      isGif: true,
      time: timeStr,
      date: TODAY_DATE_STR,
      isMine: true,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
    }))
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId ? { ...c, lastMessage: '🎬 GIF', time: timeStr, unread: 0 } : c
      )
    )
    setShowEmojiPicker(false)
    scrollToBottom('smooth')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const isImg = file.type.startsWith('image/')

    if (isImg) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const newMsg: Message = {
            id: 'img-' + crypto.randomUUID(),
            sender: currentUser.username,
            text: '',
            image: event.target.result,
            fileName: file.name,
            fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            time: timeStr,
            isMine: true,
          }
          setMessages((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] ?? []), newMsg],
          }))
          setChats((prev) =>
            prev.map((c) =>
              c.id === selectedChatId
                ? { ...c, lastMessage: `🖼️ Фото (${file.name})`, time: timeStr, unread: 0 }
                : c
            )
          )
          showToast('Изображение отправлено 📸')
        }
      }
      reader.readAsDataURL(file)
    } else {
      const fileSize = (file.size / 1024).toFixed(1) + ' KB'
      const fileMsgText = `📎 ${file.name} (${fileSize})`
      const newMessage: Message = {
        id: 'file-' + crypto.randomUUID(),
        sender: currentUser.username,
        text: fileMsgText,
        fileName: file.name,
        fileSize,
        time: timeStr,
        isMine: true,
      }
      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] ?? []), newMessage],
      }))
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? { ...c, lastMessage: fileMsgText, time: timeStr, unread: 0 }
            : c
        )
      )
      showToast('Документ прикреплен 📎')
    }

    setShowAttachMenu(false)
    if (e.target) e.target.value = ''
  }

  const handleLogout = () => {
    router.push('/login')
  }

  // 1. Export Chat History to .txt
  const handleExportChat = () => {
    setIsChatMenuOpen(false)
    const chatMsgs = messages[selectedChatId] || []
    if (chatMsgs.length === 0) {
      showToast('В этом чате пока нет сообщений для экспорта')
      return
    }

    const log = chatMsgs
      .map((m) => {
        let extra = ''
        if (m.poll) {
          extra =
            `\n[Опрос: ${m.poll.question}]\n` +
            m.poll.options.map((o) => `  - ${o.text}: ${o.votes} голосов`).join('\n')
        }
        if (m.checklist) {
          extra =
            `\n[Чек-лист: ${m.checklist.title}]\n` +
            m.checklist.items.map((i) => `  [${i.completed ? 'x' : ' '}] ${i.text}`).join('\n')
        }
        return `[${m.time}] ${m.sender}: ${m.text || ''}${extra}`
      })
      .join('\n\n')

    const blob = new Blob(
      [
        `========================================\n` +
          `История чата: ${activeChat.name}\n` +
          `Экспортировано: ${new Date().toLocaleString()}\n` +
          `HeyChat Messenger\n` +
          `========================================\n\n` +
          log,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `heychat_${activeChat.name.toLowerCase().replace(/\s+/g, '_')}_history.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast(`История чата "${activeChat.name}" экспортирована 📥`)
  }

  // 2. Clear Chat History
  const handleClearHistory = () => {
    setIsChatMenuOpen(false)
    if (confirm(`Очистить всю историю сообщений в чате "${activeChat.name}"?`)) {
      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [],
      }))
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId ? { ...c, lastMessage: 'История очищена', unread: 0 } : c
        )
      )
      showToast('История сообщений очищена 🧹')
    }
  }

  // 3. Delete Chat
  const handleDeleteChat = () => {
    setIsChatMenuOpen(false)
    if (confirm(`Вы действительно хотите удалить чат "${activeChat.name}"?`)) {
      setChats((prev) => {
        const remaining = prev.filter((c) => c.id !== selectedChatId)
        if (remaining.length > 0) {
          setSelectedChatId(remaining[0].id)
        }
        return remaining
      })
      showToast(`Чат "${activeChat.name}" удален 🗑️`)
    }
  }

  // 4. Create Poll Handler
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault()
    const validOptions = pollOptions.filter((opt) => opt.trim().length > 0)
    if (!pollQuestion.trim() || validOptions.length < 2) {
      alert('Пожалуйста, введите вопрос и минимум 2 варианта ответа')
      return
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = {
      id: 'poll-' + crypto.randomUUID(),
      sender: currentUser.username,
      text: '',
      time: timeStr,
      isMine: true,
      poll: {
        question: pollQuestion.trim(),
        options: validOptions.map((opt, idx) => ({
          id: `opt-${Date.now()}-${idx}`,
          text: opt.trim(),
          votes: 0,
          voters: [],
        })),
        multiple: pollMultiple,
        anonymous: pollAnonymous,
        totalVotes: 0,
      },
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }))
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, lastMessage: `📊 Опрос: ${pollQuestion.trim()}`, time: timeStr, unread: 0 }
          : c
      )
    )

    setShowPollModal(false)
    setPollQuestion('')
    setPollOptions(['', ''])
    showToast('Опрос опубликован 📊')
  }

  // 5. Vote in Poll Handler
  const handleVotePoll = (msgId: string, optionId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[selectedChatId] || []
      const updated = chatMsgs.map((msg) => {
        if (msg.id !== msgId || !msg.poll) return msg
        const newOptions = msg.poll.options.map((opt) => {
          const isTarget = opt.id === optionId
          const wasVoted = opt.voters?.includes(currentUser.id)

          if (isTarget) {
            if (wasVoted) {
              return {
                ...opt,
                votes: Math.max(0, opt.votes - 1),
                voters: opt.voters?.filter((uid) => uid !== currentUser.id),
              }
            } else {
              return {
                ...opt,
                votes: opt.votes + 1,
                voters: [...(opt.voters || []), currentUser.id],
              }
            }
          } else if (!msg.poll?.multiple && wasVoted) {
            return {
              ...opt,
              votes: Math.max(0, opt.votes - 1),
              voters: opt.voters?.filter((uid) => uid !== currentUser.id),
            }
          }
          return opt
        })

        const totalVotes = newOptions.reduce((acc, curr) => acc + curr.votes, 0)
        return {
          ...msg,
          poll: {
            ...msg.poll,
            options: newOptions,
            totalVotes,
          },
        }
      })

      return {
        ...prev,
        [selectedChatId]: updated,
      }
    })
  }

  // 6. Create Checklist Handler
  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = checklistItems.filter((item) => item.trim().length > 0)
    if (!checklistTitle.trim() || validItems.length < 1) {
      alert('Пожалуйста, введите название чек-листа и хотя бы 1 пункт')
      return
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = {
      id: 'chk-' + crypto.randomUUID(),
      sender: currentUser.username,
      text: '',
      time: timeStr,
      isMine: true,
      checklist: {
        title: checklistTitle.trim(),
        items: validItems.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          text: item.trim(),
          completed: false,
        })),
      },
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }))
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, lastMessage: `📋 Чек-лист: ${checklistTitle.trim()}`, time: timeStr, unread: 0 }
          : c
      )
    )

    setShowChecklistModal(false)
    setChecklistTitle('')
    setChecklistItems(['', ''])
    showToast('Чек-лист опубликован 📋')
  }

  // 7. Toggle Checklist Item
  const handleToggleChecklistItem = (msgId: string, itemId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[selectedChatId] || []
      const updated = chatMsgs.map((msg) => {
        if (msg.id !== msgId || !msg.checklist) return msg
        const newItems = msg.checklist.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
        return {
          ...msg,
          checklist: {
            ...msg.checklist,
            items: newItems,
          },
        }
      })
      return {
        ...prev,
        [selectedChatId]: updated,
      }
    })
  }

  // 8. Open Wallpaper Customizer in Drawer
  const handleOpenWallpaperCustomizer = () => {
    setIsChatMenuOpen(false)
    setDrawerInitialView('settings')
    setIsDrawerOpen(true)
  }

  // 9. Real Microphone Voice Recording Handlers
  const handleStartRecording = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        showToast('Ваш браузер не поддерживает запись аудио')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })
      audioStreamRef.current = stream

      // Create MediaRecorder with supported format
      let mimeType = 'audio/webm'
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus'
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4'
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg'
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      recordedWaveDataRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          const audioCtx = new AudioCtx()
          audioContextRef.current = audioCtx
          const source = audioCtx.createMediaStreamSource(stream)
          const analyser = audioCtx.createAnalyser()
          analyser.fftSize = 64
          analyser.smoothingTimeConstant = 0.7
          source.connect(analyser)
          analyserRef.current = analyser

          const dataArray = new Uint8Array(analyser.frequencyBinCount)

          const updateLiveWave = () => {
            if (!analyserRef.current) return
            analyserRef.current.getByteFrequencyData(dataArray)

            
            const newBars: number[] = []
            let totalVolume = 0
            for (let i = 0; i < 17; i++) {
              const val = dataArray[i % dataArray.length]
              totalVolume += val
              const scaled = Math.min(28, Math.max(6, Math.round((val / 255) * 28)))
              newBars.push(scaled)
            }
            setLiveWaveBars(newBars)

            
            const avgVol = Math.min(85, Math.max(18, Math.round((totalVolume / (17 * 255)) * 85) + 15))
            if (recordedWaveDataRef.current.length < 26) {
              recordedWaveDataRef.current.push(avgVol)
            }

            animFrameRef.current = requestAnimationFrame(updateLiveWave)
          }

          animFrameRef.current = requestAnimationFrame(updateLiveWave)
        }
      } catch (err) {
        console.warn('AudioContext visualization not available:', err)
      }

      mediaRecorder.start(200)
      setIsRecordingVoice(true)
      setRecordingSeconds(0)

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } catch (err: unknown) {
      console.error('Error accessing microphone:', err)
      showToast('Доступ к микрофону заблокирован или недоступен')
    }
  }

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null
      mediaRecorderRef.current.stop()
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
      audioStreamRef.current = null
    }

    setIsRecordingVoice(false)
    setRecordingSeconds(0)
    audioChunksRef.current = []
    recordedWaveDataRef.current = []
  }

  const handleSendVoiceMessage = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }

    const finalSecs = Math.max(1, recordingSeconds)
    const mins = Math.floor(finalSecs / 60)
    const secs = finalSecs % 60
    const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`

    const finishSend = (audioDataUrl?: string, realWave?: number[]) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const wave = realWave && realWave.length > 0 ? realWave : Array.from({ length: 32 }, (_, i) => Math.floor(Math.sin(i * 0.5) * 35 + 45))

      const newMsg: Message = {
        id: 'voice-' + crypto.randomUUID(),
        sender: currentUser.username,
        text: '',
        time: timeStr,
        isMine: true,
        voice: {
          duration: durationStr,
          seconds: finalSecs,
          wave,
          audioUrl: audioDataUrl,
        },
      }

      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
      }))

      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? { ...c, lastMessage: `🎤 Голосовое (${durationStr})`, time: timeStr, unread: 0 }
            : c
        )
      )

      setIsRecordingVoice(false)
      setRecordingSeconds(0)
      audioChunksRef.current = []
      recordedWaveDataRef.current = []
      showToast('Голосовое сообщение отправлено 🎙️')
    }

    const extractWaveform = async (audioBlob: Blob): Promise<number[]> => {
      try {
        const arrayBuffer = await audioBlob.arrayBuffer()
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          const decodeCtx = new AudioCtx()
          const decodedBuffer = await decodeCtx.decodeAudioData(arrayBuffer.slice(0))
          const rawData = decodedBuffer.getChannelData(0)
          const samples = 32
          const blockSize = Math.floor(rawData.length / samples)
          const peaks: number[] = []

          for (let i = 0; i < samples; i++) {
            let sum = 0
            const blockStart = blockSize * i
            for (let j = 0; j < blockSize; j++) {
              sum += Math.abs(rawData[blockStart + j] || 0)
            }
            peaks.push(sum / Math.max(1, blockSize))
          }

          decodeCtx.close().catch(() => {})
          const maxPeak = Math.max(...peaks, 0.005)
          return peaks.map((p) => Math.round((p / maxPeak) * 75 + 25))
        }
      } catch (e) {
        console.warn('Could not decode audio data for waveform:', e)
      }
      return Array.from({ length: 32 }, (_, i) => Math.floor(Math.abs(Math.sin(i * 0.4)) * 60 + 25))
    }

    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.onstop = () => {
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop())
          audioStreamRef.current = null
        }

        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' })
        extractWaveform(blob).then((extractedWave) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64Audio = typeof reader.result === 'string' ? reader.result : undefined
            finishSend(base64Audio, extractedWave)
          }
          reader.readAsDataURL(blob)
        })
      }
      mediaRecorder.stop()
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
        audioStreamRef.current = null
      }
      finishSend()
    }
  }

  // 10. Real Audio Play / Pause / Seek / Volume / Speed Handlers
  const handleTogglePlayVoice = (msgId: string, totalSeconds: number, audioUrl?: string) => {
    // If currently playing this voice message -> Pause it
    if (playingVoiceId === msgId) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
      setPlayingVoiceId(null)
      return
    }

    // Stop any previously playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }

    setPlayingVoiceId(msgId)
    setActiveVoiceMsgId(msgId)

    // A. Real HTML5 Audio Playback if audioUrl exists
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.volume = Math.min(1, Math.max(0, voiceVolume))
      audio.playbackRate = voiceSpeed
      currentAudioRef.current = audio
      currentAudioMsgIdRef.current = msgId

      audio.ontimeupdate = () => {
        const current = audio.currentTime
        const total = audio.duration || totalSeconds
        const pct = Math.min(100, Math.round((current / total) * 100))
        setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: pct }))
      }

      audio.onended = () => {
        setPlayingVoiceId(null)
        setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }))
        currentAudioRef.current = null
      }

      audio.play().catch((err) => {
        console.warn('Audio playback error:', err)
        setPlayingVoiceId(null)
      })
    } else {
      // B. Fallback animated playback for mock messages
      setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }))
      let currentSec = 0
      const interval = setInterval(() => {
        currentSec += 0.25
        const pct = Math.min(100, Math.round((currentSec / totalSeconds) * 100))
        setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: pct }))

        if (currentSec >= totalSeconds) {
          clearInterval(interval)
          setPlayingVoiceId(null)
          setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }))
        }
      }, 250)
    }
  }

  // Rewind current audio by 5 seconds
  const handleRewindVoice = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = Math.max(0, currentAudioRef.current.currentTime - 5)
    } else if (activeVoiceMsgId) {
      setVoicePlaybackProgress((prev) => {
        const curPct = prev[activeVoiceMsgId] ?? 0
        return { ...prev, [activeVoiceMsgId]: Math.max(0, curPct - 15) }
      })
    }
  }

  // Fast-forward current audio by 5 seconds
  const handleFastForwardVoice = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = Math.min(
        currentAudioRef.current.duration || 10,
        currentAudioRef.current.currentTime + 5
      )
    } else if (activeVoiceMsgId) {
      setVoicePlaybackProgress((prev) => {
        const curPct = prev[activeVoiceMsgId] ?? 0
        return { ...prev, [activeVoiceMsgId]: Math.min(100, curPct + 15) }
      })
    }
  }

  // Close / Dismiss top voice player bar
  const handleCloseTopVoiceBar = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setPlayingVoiceId(null)
    setActiveVoiceMsgId(null)
    setShowTopBarVolume(false)
  }

  // Change voice playback volume
  const handleChangeVoiceVolume = (newVol: number) => {
    setVoiceVolume(newVol)
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = Math.min(1, Math.max(0, newVol))
    }
  }

  // Cycle voice playback speed (1x -> 1.5x -> 2x)
  const handleCycleVoiceSpeed = () => {
    const nextSpeed: 1 | 1.5 | 2 = voiceSpeed === 1 ? 1.5 : voiceSpeed === 1.5 ? 2 : 1
    setVoiceSpeed(nextSpeed)
    if (currentAudioRef.current) {
      currentAudioRef.current.playbackRate = nextSpeed
    }
  }

  // Seek within voice message
  const handleSeekVoice = (msgId: string, percent: number, totalSeconds: number, audioUrl?: string) => {
    setVoicePlaybackProgress((prev) => ({ ...prev, [msgId]: percent }))
    if (currentAudioRef.current && currentAudioMsgIdRef.current === msgId && audioUrl) {
      currentAudioRef.current.currentTime = (percent / 100) * (currentAudioRef.current.duration || totalSeconds)
    }
  }

  // Active Voice Message for Top Global Audio Player Bar
  const allMessagesList = Object.values(messages).flat()
  const activeVoiceMsg = activeVoiceMsgId
    ? allMessagesList.find((m) => m.id === activeVoiceMsgId && m.voice)
    : null
  const isTopBarPlaying = playingVoiceId === activeVoiceMsgId
  const topBarProgress = activeVoiceMsgId ? (voicePlaybackProgress[activeVoiceMsgId] ?? 0) : 0
  const topBarCurrentSec = activeVoiceMsg
    ? Math.round((topBarProgress / 100) * (activeVoiceMsg.voice?.seconds || 1))
    : 0
  const formatTimeSec = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-200 ${isNightMode ? 'bg-[#0f172a] text-slate-100 dark' : 'bg-slate-50 text-foreground'
      }`}>
      
      <aside className={`flex w-80 flex-col border-r select-none shrink-0 transition-colors duration-200 ${isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
        
        <div className={`flex h-16 items-center justify-between px-4 shrink-0 border-b ${isNightMode ? 'border-slate-800' : 'border-slate-100/80'
          }`}>
          <HeyChatLogo size="sm" />

          
          <button
            onClick={() => {
              setDrawerInitialView('settings')
              setIsDrawerOpen(true)
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 focus:outline-none ${isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            aria-label="Открыть меню"
            title="Меню"
          >
            <List size={20} weight="bold" />
          </button>
        </div>

        
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
              className={`w-full rounded-xl pl-10 pr-9 py-2 text-[13px] border border-transparent transition-all focus:outline-none ${isNightMode
                  ? 'bg-[#202c34] text-slate-100 placeholder:text-slate-400 focus:bg-[#25333d] focus:border-[#2b3a46]'
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
                  onClick={() => selectChat(chat.id)}
                  className={`group relative flex w-full items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150 ${isSelected
                      ? (isNightMode ? 'bg-slate-800 text-white font-medium shadow-xs' : 'bg-slate-100/90 text-slate-900 font-medium')
                      : (isNightMode ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-100/60 text-slate-700')
                    }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar avatar={chat.avatar} name={chat.name} colorIndex={idx} size="md" />
                    {chat.online && (
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 shadow-xs ${isNightMode ? 'ring-[#111b21]' : 'ring-white'
                        }`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className={`truncate text-sm tracking-tight ${isSelected
                            ? (isNightMode ? 'font-bold text-white' : 'font-bold text-slate-900')
                            : (isNightMode ? 'font-semibold text-slate-200' : 'font-semibold text-slate-900')
                          }`}>
                          {chat.name}
                        </span>
                        {chat.isVerified && (
                          <SealCheck size={14} weight="fill" className="text-[#2F80ED] shrink-0" />
                        )}
                      </div>
                      <span className={`shrink-0 text-[11px] font-normal ${isNightMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`truncate text-[13px] leading-snug ${isSelected
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

      
      <main className={`flex flex-1 flex-col overflow-hidden transition-colors duration-200 ${isNightMode ? 'bg-[#0b141a]' : 'bg-slate-50'
        }`}>
        
        <header className={`flex h-[64px] items-center justify-between border-b px-4 shrink-0 transition-colors duration-200 ${isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-border'
          }`}>
          
          <div
            onClick={() => {
              setIsProfileOpen((prev) => !prev)
              setIsSearchOpen(false)
            }}
            className={`flex items-center gap-3 cursor-pointer p-1.5 -ml-1.5 rounded-2xl transition-all active:scale-[0.99] select-none ${
              isNightMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
            }`}
            title="Открыть профиль пользователя"
            role="button"
          >
            <UserAvatar avatar={activeChat.avatar} name={activeChat.name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`font-semibold text-base ${isNightMode ? 'text-slate-100' : 'text-slate-900'}`}>
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

          <div className="flex items-center gap-1.5 relative" ref={chatMenuRef}>
            
            <button
              onClick={() => {
                setIsSearchOpen((prev) => !prev)
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${isSearchOpen
                  ? (isNightMode ? 'bg-slate-800 text-blue-400 font-semibold' : 'bg-slate-100 text-heychat font-semibold')
                  : (isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-foreground')
                }`}
              title="Поиск сообщений (⌘K)"
              aria-label="Поиск сообщений"
            >
              <MagnifyingGlass size={20} weight="bold" />
            </button>

            
            <button
              onClick={() => setIsChatMenuOpen((prev) => !prev)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${isChatMenuOpen
                  ? (isNightMode ? 'bg-slate-800 text-blue-400 font-semibold ring-2 ring-blue-500/20' : 'bg-slate-100 text-blue-600 ring-2 ring-blue-500/20')
                  : (isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-foreground')
                }`}
              title="Действия с чатом"
              aria-label="Действия с чатом"
            >
              <DotsThreeVertical size={20} weight="bold" />
            </button>

            
            {isChatMenuOpen && (
              <div
                className={`absolute right-0 top-11 z-50 w-60 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
                  isNightMode
                    ? 'bg-[#18222d]/95 border-slate-700/80 text-slate-200 shadow-black/60'
                    : 'bg-white/95 border-slate-200/80 text-slate-800 shadow-slate-400/20'
                }`}
              >
                
                <button
                  type="button"
                  onClick={() => {
                    setIsChatMenuOpen(false)
                    setShowPollModal(true)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isNightMode ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <ChartBar size={18} className="text-blue-500 shrink-0" weight="bold" />
                  <span>Создать опрос</span>
                </button>

                
                <button
                  type="button"
                  onClick={() => {
                    setIsChatMenuOpen(false)
                    setShowChecklistModal(true)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isNightMode ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" weight="bold" />
                  <span>Создать чек-лист</span>
                </button>

                
                <button
                  type="button"
                  onClick={handleOpenWallpaperCustomizer}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isNightMode ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <PaintBrush size={18} className="text-purple-500 shrink-0" weight="bold" />
                  <span>Установить обои</span>
                </button>

                
                <button
                  type="button"
                  onClick={handleExportChat}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isNightMode ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Export size={18} className="text-amber-500 shrink-0" weight="bold" />
                  <span>Экспорт истории чата</span>
                </button>

                <div className="h-px bg-slate-200/60 dark:bg-slate-800 my-1" />

                
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isNightMode ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Broom size={18} className="text-slate-400 shrink-0" weight="bold" />
                  <span>Очистить историю</span>
                </button>

                
                <button
                  type="button"
                  onClick={handleDeleteChat}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left text-rose-500 hover:bg-rose-500/10 active:scale-[0.98]"
                >
                  <Trash size={18} className="shrink-0" weight="bold" />
                  <span>Удалить чат</span>
                </button>
              </div>
            )}
          </div>
        </header>

        
        {activeVoiceMsg && (
          <div
            className={`relative flex h-10 items-center justify-between px-4 border-b select-none z-20 transition-all duration-200 animate-in slide-in-from-top-1 ${
              isNightMode
                ? 'bg-[#182533] border-slate-800 text-slate-200'
                : 'bg-white/95 border-slate-200/90 text-slate-800 backdrop-blur-md'
            }`}
          >
            
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-700/20 dark:bg-slate-700/50">
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${topBarProgress}%` }}
              />
            </div>

            
            <div className="flex items-center gap-2.5 min-w-0">
              
              <button
                type="button"
                onClick={handleRewindVoice}
                className="text-blue-500 hover:text-blue-600 transition-transform active:scale-90 p-0.5"
                title="Перемотать на 5 сек назад"
              >
                <Rewind size={17} weight="fill" />
              </button>

              
              <button
                type="button"
                onClick={() =>
                  handleTogglePlayVoice(
                    activeVoiceMsg.id,
                    activeVoiceMsg.voice!.seconds,
                    activeVoiceMsg.voice?.audioUrl
                  )
                }
                className="text-blue-500 hover:text-blue-600 transition-transform active:scale-95 p-0.5"
                title={isTopBarPlaying ? 'Пауза' : 'Воспроизвести'}
              >
                {isTopBarPlaying ? (
                  <Pause size={18} weight="fill" />
                ) : (
                  <Play size={18} weight="fill" className="translate-x-0.5" />
                )}
              </button>

              
              <button
                type="button"
                onClick={handleFastForwardVoice}
                className="text-blue-500 hover:text-blue-600 transition-transform active:scale-90 p-0.5"
                title="Перемотать на 5 сек вперёд"
              >
                <FastForward size={17} weight="fill" />
              </button>

              
              <div className="flex items-center gap-2 truncate text-xs ml-1">
                <span className={`font-bold truncate ${isNightMode ? 'text-white' : 'text-slate-900'}`}>{activeVoiceMsg.sender}</span>
                <span className={`text-[11px] truncate ${isNightMode ? 'text-slate-300' : 'text-slate-500'}`}>{activeVoiceMsg.time}</span>
              </div>
            </div>

            
            <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
              
              <span className={`font-medium ${isNightMode ? 'text-slate-200' : 'text-slate-600'}`}>
                {formatTimeSec(topBarCurrentSec)}
              </span>

              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTopBarVolume((prev) => !prev)}
                  className={`p-1 rounded-md transition-all active:scale-95 ${
                    isNightMode ? 'hover:bg-slate-700/80 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  title={`Громкость: ${Math.round(voiceVolume * 100)}%`}
                >
                  {voiceVolume === 0 ? (
                    <SpeakerSlash size={16} weight="bold" />
                  ) : voiceVolume < 0.5 ? (
                    <SpeakerLow size={16} weight="bold" />
                  ) : (
                    <SpeakerHigh size={16} weight="bold" />
                  )}
                </button>

                {showTopBarVolume && (
                  <div
                    className={`absolute top-8 right-0 z-50 p-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-2 w-36 animate-in fade-in zoom-in-95 duration-150 ${
                      isNightMode
                        ? 'bg-[#18222d] border-slate-700 text-white shadow-black/60'
                        : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={voiceVolume}
                      onChange={(e) => handleChangeVoiceVolume(parseFloat(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                    <span className="text-[10px] font-mono font-bold shrink-0 w-7 text-right">
                      {Math.round(voiceVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              
              <button
                type="button"
                onClick={handleCycleVoiceSpeed}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border border-dashed border-slate-500/50 hover:border-solid hover:border-blue-500 transition-all active:scale-95 ${
                  isNightMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Скорость воспроизведения"
              >
                {voiceSpeed}X
              </button>

              
              <button
                type="button"
                onClick={handleCloseTopVoiceBar}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 dark:hover:text-white transition-all active:scale-95"
                title="Закрыть плеер"
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}

        
        <div className="flex flex-1 overflow-hidden relative">
          
          <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">
            
            <div
              className="absolute inset-0 transition-all duration-300 pointer-events-none z-0"
              style={{
                ...(chatSettings.wallpaper.type === 'pattern'
                  ? {
                      backgroundImage: `url("${chatSettings.wallpaper.value}")`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: chatSettings.wallpaper.patternSize || '120px 120px',
                      backgroundColor: chatSettings.wallpaper.bgColor || (isNightMode ? '#0a131a' : '#eef2f6'),
                    }
                  : chatSettings.wallpaper.type === 'gradient'
                  ? { background: chatSettings.wallpaper.value }
                  : chatSettings.wallpaper.type === 'image'
                  ? {
                      backgroundImage: `url("${chatSettings.wallpaper.value}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : chatSettings.wallpaper.type === 'color'
                  ? { backgroundColor: chatSettings.wallpaper.value }
                  : { backgroundColor: isNightMode ? '#0b141a' : '#f8fafc' }),
                filter: (chatSettings.wallpaper.blur && chatSettings.wallpaper.blur > 0) ? `blur(${chatSettings.wallpaper.blur}px)` : undefined,
                transform: (chatSettings.wallpaper.blur && chatSettings.wallpaper.blur > 0) ? 'scale(1.05)' : undefined,
              }}
            />

            
            {Boolean(chatSettings.wallpaper.dim && chatSettings.wallpaper.dim > 0) && (
              <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-200 z-0"
                style={{ opacity: (chatSettings.wallpaper.dim ?? 0) / 100 }}
              />
            )}

            
            <div
              ref={messageContainerRef}
              onScroll={handleScrollFeed}
              className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3"
            >
              {currentMessages.map((msg) => {
                const isHighlighted = highlightedMsgId === msg.id
                const currentBubbleConfig = BUBBLE_COLOR_PRESETS.find((c) => c.id === chatSettings.bubbleColor) ?? BUBBLE_COLOR_PRESETS[0]
                const myBubbleBg = isNightMode ? currentBubbleConfig.darkBg : currentBubbleConfig.lightBg

                // ── A. RENDER POLL MESSAGE ──
                if (msg.poll) {
                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`w-full max-w-[85%] sm:max-w-sm rounded-2xl p-4 shadow-sm border transition-all ${
                          msg.isMine
                            ? (isNightMode ? 'bg-[#182a38] border-slate-700/80 text-white rounded-br-none' : 'bg-blue-50/90 border-blue-200/80 text-slate-900 rounded-br-none')
                            : (isNightMode ? 'bg-[#202c33]/95 border-slate-700/60 text-white rounded-bl-none' : 'bg-white border-slate-200/80 text-slate-900 rounded-bl-none')
                        }`}
                      >
                        
                        <div className="flex items-start gap-2 mb-3">
                          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-500 shrink-0">
                            <ChartBar size={18} weight="bold" />
                          </span>
                          <div>
                            <span className="block font-bold text-sm leading-tight">
                              {msg.poll.question}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">
                              {msg.poll.anonymous ? 'Анонимный опрос' : 'Открытый опрос'} • {msg.poll.multiple ? 'Несколько вариантов' : 'Один вариант'}
                            </span>
                          </div>
                        </div>

                        
                        <div className="space-y-2">
                          {msg.poll.options.map((opt) => {
                            const hasVoted = opt.voters?.includes(currentUser.id)
                            const percentage = msg.poll && msg.poll.totalVotes > 0 ? Math.round((opt.votes / msg.poll.totalVotes) * 100) : 0

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleVotePoll(msg.id, opt.id)}
                                className={`w-full relative overflow-hidden flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                                  hasVoted
                                    ? 'border-blue-500 bg-blue-500/10 font-bold'
                                    : (isNightMode ? 'border-slate-700/70 hover:border-slate-600 bg-slate-800/40' : 'border-slate-200 hover:border-slate-300 bg-white/70')
                                }`}
                              >
                                
                                <div
                                  className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                                    hasVoted ? 'bg-blue-500/25' : (isNightMode ? 'bg-slate-700/40' : 'bg-blue-100/60')
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />

                                <div className="relative z-10 flex items-center gap-2 pr-2">
                                  <span
                                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      hasVoted ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-400'
                                    }`}
                                  >
                                    {hasVoted && <Check size={10} weight="bold" />}
                                  </span>
                                  <span className="truncate">{opt.text}</span>
                                </div>

                                <div className="relative z-10 flex items-center gap-1.5 shrink-0 text-[11px] font-semibold text-slate-400">
                                  {msg.poll && msg.poll.totalVotes > 0 && <span>{percentage}%</span>}
                                  <span className="text-[10px]">({opt.votes})</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span>Всего голосов: {msg.poll.totalVotes}</span>
                          <span>{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  )
                }

                // ── B. RENDER CHECKLIST MESSAGE ──
                if (msg.checklist) {
                  const completedCount = msg.checklist.items.filter((i) => i.completed).length

                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`w-full max-w-[85%] sm:max-w-sm rounded-2xl p-4 shadow-sm border transition-all ${
                          msg.isMine
                            ? (isNightMode ? 'bg-[#182c2a] border-emerald-800/60 text-white rounded-br-none' : 'bg-emerald-50/90 border-emerald-200 text-slate-900 rounded-br-none')
                            : (isNightMode ? 'bg-[#202c33]/95 border-slate-700/60 text-white rounded-bl-none' : 'bg-white border-slate-200/80 text-slate-900 rounded-bl-none')
                        }`}
                      >
                        
                        <div className="flex items-start gap-2 mb-3">
                          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 shrink-0">
                            <CheckCircle size={18} weight="bold" />
                          </span>
                          <div>
                            <span className="block font-bold text-sm leading-tight">
                              {msg.checklist.title}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">
                              Выполнено {completedCount} из {msg.checklist.items.length}
                            </span>
                          </div>
                        </div>

                        
                        <div className="space-y-1.5">
                          {msg.checklist.items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleChecklistItem(msg.id, item.id)}
                              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-xs font-medium transition-all text-left ${
                                item.completed
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-slate-400 line-through'
                                  : (isNightMode ? 'border-slate-700/70 hover:border-slate-600 bg-slate-800/40' : 'border-slate-200 hover:border-slate-300 bg-white/70')
                              }`}
                            >
                              <span
                                className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'
                                }`}
                              >
                                {item.completed && <Check size={11} weight="bold" />}
                              </span>
                              <span className="truncate">{item.text}</span>
                            </button>
                          ))}
                        </div>

                        
                        <div className="flex items-center justify-end text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span>{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  )
                }

                // ── C. RENDER VOICE MESSAGE ──
                if (msg.voice) {
                  const isPlaying = playingVoiceId === msg.id
                  const progress = voicePlaybackProgress[msg.id] ?? 0

                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`w-72 sm:w-80 rounded-2xl p-3 shadow-sm border transition-all ${
                          msg.isMine
                            ? `${myBubbleBg} rounded-br-none`
                            : (isNightMode ? 'bg-[#202c33]/95 border-slate-700/60 text-white rounded-bl-none' : 'bg-white border-slate-200/80 text-slate-900 rounded-bl-none')
                        }`}
                      >
                        {!msg.isMine && (
                          <p className={`mb-1 text-[11px] font-semibold ${isNightMode ? 'text-blue-400' : 'text-heychat'}`}>
                            {msg.sender}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          
                          <button
                            type="button"
                            onClick={() => handleTogglePlayVoice(msg.id, msg.voice!.seconds, msg.voice?.audioUrl)}
                            className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 ${
                              msg.isMine
                                ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            title={isPlaying ? 'Пауза' : 'Слушать голосовое'}
                          >
                            {isPlaying ? (
                              <Pause size={20} weight="fill" />
                            ) : (
                              <Play size={20} weight="fill" className="translate-x-0.5" />
                            )}
                          </button>

                          
                          <div className="flex-1 min-w-0">
                            <div
                              className="flex items-center gap-0.5 h-7 cursor-pointer group/wave"
                              title="Нажмите для перемотки"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const clickPct = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 100)))
                                handleSeekVoice(msg.id, clickPct, msg.voice!.seconds, msg.voice?.audioUrl)
                              }}
                            >
                              {msg.voice.wave.map((heightPct, wIdx) => {
                                const barProgressPct = (wIdx / msg.voice!.wave.length) * 100
                                const isPlayed = isPlaying && barProgressPct <= progress

                                return (
                                  <div
                                    key={wIdx}
                                    className={`flex-1 min-w-[2px] rounded-full transition-all duration-150 group-hover/wave:opacity-90 ${
                                      isPlayed
                                        ? (msg.isMine ? 'bg-white' : 'bg-blue-500')
                                        : (msg.isMine ? 'bg-white/40' : (isNightMode ? 'bg-slate-600' : 'bg-slate-300'))
                                    }`}
                                    style={{
                                      height: `${Math.min(24, Math.max(5, Math.round((heightPct / 100) * 24)))}px`,
                                    }}
                                  />
                                )
                              })}
                            </div>

                            
                            <div className="flex items-center justify-between mt-1 text-[11px] opacity-90 font-mono gap-2 relative">
                              <span>{isPlaying ? `${Math.round((progress / 100) * msg.voice.seconds)} сек` : msg.voice.duration}</span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCycleVoiceSpeed()
                                  }}
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 ${
                                    msg.isMine
                                      ? 'bg-white/20 hover:bg-white/30 text-white'
                                      : (isNightMode ? 'bg-slate-700/80 hover:bg-slate-600 text-slate-200' : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700')
                                  }`}
                                  title="Скорость воспроизведения"
                                >
                                  {voiceSpeed}x
                                </button>

                                
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setShowVolumeForMsg(showVolumeForMsg === msg.id ? null : msg.id)
                                    }}
                                    className={`p-1 rounded-md transition-all active:scale-95 ${
                                      msg.isMine
                                        ? 'hover:bg-white/20 text-white'
                                        : (isNightMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600')
                                    }`}
                                    title={`Громкость: ${Math.round(voiceVolume * 100)}%`}
                                  >
                                    {voiceVolume === 0 ? (
                                      <SpeakerSlash size={14} weight="bold" />
                                    ) : voiceVolume < 0.5 ? (
                                      <SpeakerLow size={14} weight="bold" />
                                    ) : (
                                      <SpeakerHigh size={14} weight="bold" />
                                    )}
                                  </button>

                                  
                                  {showVolumeForMsg === msg.id && (
                                    <div
                                      className={`absolute bottom-6 right-0 z-30 p-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-2 w-36 animate-in fade-in zoom-in-95 duration-150 ${
                                        isNightMode
                                          ? 'bg-[#18222d] border-slate-700 text-white shadow-black/60'
                                          : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
                                      }`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        value={voiceVolume}
                                        onChange={(e) => handleChangeVoiceVolume(parseFloat(e.target.value))}
                                        className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                                      />
                                      <span className="text-[10px] font-mono font-bold shrink-0 w-7 text-right">
                                        {Math.round(voiceVolume * 100)}%
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <span className="text-[10px] opacity-75">{msg.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                // ── D. RENDER IMAGE / GIF MESSAGE ──
                if (msg.image) {
                  const isPureGif =
                    msg.isGif ||
                    (Boolean(msg.image && (msg.image.includes('.gif') || msg.image.includes('giphy') || msg.image.includes('tenor'))) && !msg.text)

                  if (isPureGif) {
                    return (
                      <div
                        key={msg.id}
                        id={`msg-${msg.id}`}
                        className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'}`}
                      >
                        {!msg.isMine && (
                          <p className={`px-1 mb-1 text-[11px] font-semibold ${isNightMode ? 'text-blue-400' : 'text-heychat'}`}>
                            {msg.sender}
                          </p>
                        )}
                        <div
                          className="relative max-w-[80%] sm:max-w-xs md:max-w-sm rounded-2xl overflow-hidden shadow-lg border border-black/10 transition-all duration-200 hover:scale-[1.01] group cursor-pointer"
                          onClick={() => handleOpenMediaViewer(msg)}
                        >
                          
                          <img
                            src={msg.image}
                            alt="GIF"
                            className="w-full max-h-80 object-cover rounded-2xl block"
                          />

                          
                          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wider shadow-xs select-none">
                            GIF
                          </span>

                          
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/55 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-md select-none">
                            <span>{msg.time}</span>
                            {msg.isMine && (
                              <Checks size={13} weight="bold" className="text-white/90" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // Standard Photo Message with caption
                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-xs md:max-w-sm rounded-2xl p-1.5 shadow-md border transition-all ${
                          msg.isMine
                            ? `${myBubbleBg} rounded-br-none`
                            : (isNightMode ? 'bg-[#202c33]/95 border-slate-700/60 text-white rounded-bl-none' : 'bg-white border-slate-200/80 text-slate-900 rounded-bl-none')
                        }`}
                      >
                        {!msg.isMine && (
                          <p className={`px-2 pt-1 mb-1 text-[11px] font-semibold ${isNightMode ? 'text-blue-400' : 'text-heychat'}`}>
                            {msg.sender}
                          </p>
                        )}

                        <div
                          className="relative rounded-xl overflow-hidden group cursor-pointer"
                          onClick={() => handleOpenMediaViewer(msg)}
                        >
                          <img
                            src={msg.image}
                            alt={msg.fileName || 'Изображение'}
                            className="w-full max-h-72 object-cover rounded-xl transition-transform duration-300 group-hover:scale-102"
                          />
                          {msg.text && (
                            <p className="p-2 text-xs font-medium leading-relaxed">
                              {msg.text}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[10px] px-2 py-1">
                          <span className={msg.isMine ? (isNightMode ? 'text-emerald-200/80' : 'text-white/80') : (isNightMode ? 'text-slate-400' : 'text-muted')}>
                            {msg.time}
                          </span>
                          {msg.isMine && (
                            <Checks size={15} weight="bold" className={isNightMode ? 'text-emerald-300' : 'text-white/90'} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }

                // ── E. RENDER STANDARD TEXT / STICKER MESSAGE ──
                return (
                  <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex flex-col transition-all duration-300 ${msg.isMine ? 'items-end' : 'items-start'
                      }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-300 ${isHighlighted
                          ? 'ring-4 ring-amber-400/80 scale-[1.02]'
                          : ''
                        } ${msg.isMine
                          ? `${myBubbleBg} rounded-br-none text-white`
                          : (isNightMode ? 'bg-[#202c33]/95 text-slate-100 border border-slate-700/50 backdrop-blur-xs rounded-bl-none' : 'bg-white/95 text-slate-900 border border-border/60 backdrop-blur-xs rounded-bl-none')
                        }`}
                      style={{ fontSize: chatSettings.fontSize }}
                    >
                      {!msg.isMine && (
                        <p className={`mb-1 text-[11px] font-semibold ${isNightMode ? 'text-blue-400' : 'text-heychat'
                          }`}>
                          {msg.sender}
                        </p>
                      )}
                      <p className="leading-relaxed text-inherit">
                        {highlightMatch(msg.text, searchQuery)}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] mt-1">
                        <span
                          className={
                            msg.isMine
                              ? 'text-white/85'
                              : (isNightMode ? 'text-slate-400' : 'text-muted')
                          }
                        >
                          {msg.time}
                        </span>
                        {msg.isMine && (
                          <Checks
                            size={15}
                            weight="bold"
                            className="text-white/90"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div ref={messagesEndRef} className="h-0.5" />
            </div>

            
            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                className={`absolute bottom-20 right-6 z-30 flex items-center gap-1.5 py-2 px-3.5 rounded-full shadow-2xl border transition-all duration-200 active:scale-95 animate-in fade-in slide-in-from-bottom-3 select-none cursor-pointer ${
                  unreadNewMessagesCount > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400 font-bold shadow-blue-500/30'
                    : isNightMode
                    ? 'bg-[#18232c]/95 hover:bg-slate-800 text-slate-200 border-slate-700 backdrop-blur-md shadow-black/60'
                    : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200 backdrop-blur-md shadow-slate-300/60'
                }`}
                title="Прокрутить к последним сообщениям"
              >
                <ArrowDown size={16} weight="bold" />
                {unreadNewMessagesCount > 0 ? (
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    Новые сообщения
                    <span className="h-4 min-w-4 px-1 rounded-full bg-white text-blue-600 dark:bg-slate-900 dark:text-blue-400 text-[10px] flex items-center justify-center font-black shadow-xs">
                      {unreadNewMessagesCount}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs font-medium">Вниз</span>
                )}
              </button>
            )}

            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            
            {activeChat.isReadOnly ? (
              <div className={`border-t p-3.5 text-center text-xs font-medium flex items-center justify-center gap-2 select-none ${isNightMode ? 'border-slate-800 bg-[#111b21] text-slate-400' : 'border-border bg-slate-100/90 text-slate-500'
                }`}>
                <span>Отправлять сообщения может только {activeChat.name}</span>
              </div>
            ) : (
              <form
                onSubmit={handleSendMessage}
                className={`relative border-t p-3 transition-colors duration-200 ${isNightMode ? 'border-slate-800 bg-[#111b21]' : 'border-border bg-white'
                  }`}
              >
                
                {showAttachMenu && (
                  <div
                    onMouseEnter={handleAttachMouseEnter}
                    onMouseLeave={handleAttachMouseLeave}
                    className={`absolute bottom-16 left-3 z-40 w-56 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none ${
                      isNightMode ? 'bg-[#18222d]/95 border-slate-700/80 text-slate-100 shadow-black/80' : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-slate-400/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowAttachMenu(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="p-1 rounded-lg bg-blue-500/10 text-blue-500">
                        <Image size={17} weight="bold" />
                      </span>
                      <span>Фото или видео</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowAttachMenu(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <FileText size={17} weight="bold" />
                      </span>
                      <span>Документ</span>
                    </button>

                    <div className="h-px bg-slate-200/60 dark:bg-slate-800 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachMenu(false)
                        setShowPollModal(true)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="p-1 rounded-lg bg-purple-500/10 text-purple-500">
                        <ChartBar size={17} weight="bold" />
                      </span>
                      <span>Создать опрос</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachMenu(false)
                        setShowChecklistModal(true)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                        isNightMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                        <CheckCircle size={17} weight="bold" />
                      </span>
                      <span>Создать чек-лист</span>
                    </button>
                  </div>
                )}

                
                {showEmojiPicker && (
                  <div
                    onMouseEnter={handleEmojiMouseEnter}
                    onMouseLeave={handleEmojiMouseLeave}
                    className={`absolute bottom-16 right-3 z-40 w-92 sm:w-[410px] h-[520px] max-h-[82vh] flex flex-col rounded-2xl border p-3 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none ${
                      isNightMode ? 'bg-[#18222d]/95 border-slate-700/80 text-slate-100 shadow-black/80' : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-slate-400/30'
                    }`}
                  >
                    
                    <div className={`flex items-center justify-between border-b pb-2.5 mb-2.5 shrink-0 ${isNightMode ? 'border-slate-800' : 'border-border/60'}`}>
                      <div className="flex gap-1.5 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        <button
                          type="button"
                          onClick={() => setPickerTab('emoji')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            pickerTab === 'emoji'
                              ? isNightMode
                                ? 'bg-[#25333d] text-white shadow-xs'
                                : 'bg-white text-slate-900 shadow-xs'
                              : isNightMode
                              ? 'text-slate-400 hover:text-white'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          😊 Эмодзи
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickerTab('gif')}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            pickerTab === 'gif'
                              ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-xs'
                              : isNightMode
                              ? 'text-slate-400 hover:text-white'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <span>🎬 GIF</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-black/30 font-black tracking-wider uppercase">
                            GIPHY
                          </span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <X size={16} weight="bold" />
                      </button>
                    </div>

                    {pickerTab === 'emoji' ? (
                      <div className="flex flex-col flex-1 overflow-hidden gap-2">
                        
                        <div className="relative flex items-center shrink-0">
                          <MagnifyingGlass size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                            placeholder="Поиск эмодзи..."
                            className={`w-full rounded-xl pl-8 pr-7 py-2 text-xs border transition-all focus:outline-none ${
                              isNightMode
                                ? 'bg-[#202c34] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
                            }`}
                          />
                          {emojiSearch && (
                            <button
                              type="button"
                              onClick={() => setEmojiSearch('')}
                              className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                              <X size={13} weight="bold" />
                            </button>
                          )}
                        </div>

                        
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEmojiSearch('')
                              setActiveEmojiCategory('all')
                            }}
                            className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer ${
                              !emojiSearch.trim() && activeEmojiCategory === 'all'
                                ? 'bg-blue-500 text-white font-bold shadow-xs'
                                : isNightMode
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ✨ Все
                          </button>
                          {EMOJI_CATEGORIES.map((cat) => {
                            const isActive = !emojiSearch.trim() && activeEmojiCategory === cat.id
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setEmojiSearch('')
                                  setActiveEmojiCategory(cat.id)
                                }}
                                className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-blue-500 text-white font-bold shadow-xs'
                                    : isNightMode
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                              </button>
                            )
                          })}
                        </div>

                        
                        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 flex-1 overflow-y-auto p-1 rounded-xl scrollbar-thin">
                          {(() => {
                            const query = emojiSearch.trim().toLowerCase()
                            const emojisToRender = query
                              ? EMOJI_LIST.filter((e) => e.includes(query))
                              : activeEmojiCategory === 'all'
                              ? EMOJI_LIST
                              : EMOJI_CATEGORIES.find((c) => c.id === activeEmojiCategory)?.emojis ?? EMOJI_LIST

                            return emojisToRender.map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleEmojiClick(emoji)}
                                className={`h-10 w-10 flex items-center justify-center rounded-xl text-2xl transition-all duration-150 hover:scale-125 active:scale-95 cursor-pointer ${
                                  isNightMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                                }`}
                              >
                                {emoji}
                              </button>
                            ))
                          })()}
                        </div>
                      </div>
                    ) : (
                      /* ── GIPHY GIF TAB ── */
                      <div className="flex flex-col flex-1 overflow-hidden gap-2">
                        
                        <div className="relative flex items-center shrink-0">
                          <MagnifyingGlass size={15} className="absolute left-2.5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={gifSearch}
                            onChange={(e) => setGifSearch(e.target.value)}
                            placeholder="Поиск GIF в GIPHY..."
                            className={`w-full rounded-xl pl-8 pr-7 py-2 text-xs border transition-all focus:outline-none ${
                              isNightMode
                                ? 'bg-[#202c34] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-purple-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-500'
                            }`}
                          />
                          {gifSearch && (
                            <button
                              type="button"
                              onClick={() => setGifSearch('')}
                              className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                              <X size={13} weight="bold" />
                            </button>
                          )}
                        </div>

                        
                        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none shrink-0 border-b border-slate-200/40 dark:border-slate-800/60">
                          {QUICK_EMOJI_FILTERS.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setGifSearch(item.query)
                              }}
                              className={`h-7 w-7 flex items-center justify-center rounded-lg text-sm shrink-0 transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                                isNightMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                              }`}
                              title={`Искать гифки: ${item.query}`}
                            >
                              {item.emoji}
                            </button>
                          ))}
                        </div>

                        
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] shrink-0">
                          {GIF_CATEGORIES.map((cat) => {
                            const isActive = !gifSearch.trim() && activeGifCategory === cat.id
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setGifSearch('')
                                  setActiveGifCategory(cat.id)
                                }}
                                className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-purple-500 text-white font-bold shadow-xs'
                                    : isNightMode
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {cat.name}
                              </button>
                            )
                          })}
                        </div>

                        
                        <div className="grid grid-cols-3 auto-rows-[92px] gap-1.5 flex-1 overflow-y-auto p-1 rounded-xl scrollbar-thin">
                          {isGifLoading && customGifs.length === 0 ? (
                            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-slate-400 text-xs">
                              <span className="animate-spin text-2xl mb-2">⏳</span>
                              <span>Загрузка GIPHY...</span>
                            </div>
                          ) : displayedGifs.length === 0 ? (
                            <div className="col-span-3 text-center py-16 text-xs text-slate-400">
                              Гифки не найдены
                            </div>
                          ) : (
                            displayedGifs.map((gif) => (
                              <button
                                key={gif.id}
                                type="button"
                                onClick={() => handleSendGif(gif.url)}
                                className={`relative group w-full h-[92px] rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer block shrink-0 ${
                                  isNightMode ? 'border-slate-800 bg-slate-800/60 hover:border-purple-500/60' : 'border-slate-200 bg-slate-100 hover:border-purple-400/60'
                                }`}
                                title={`Отправить: ${gif.title}`}
                              >
                                <img
                                  src={gif.url}
                                  alt={gif.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover block group-hover:brightness-105"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent text-white text-[9px] font-medium px-1.5 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                  {gif.title}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                
                {isRecordingVoice ? (
                  /* ── ACTIVE VOICE RECORDING BAR ── */
                  <div
                    className={`flex items-center justify-between gap-3 w-full rounded-full border px-4 py-2 shadow-sm transition-all animate-in fade-in duration-200 ${
                      isNightMode
                        ? 'bg-[#1a232c] border-rose-500/40 text-slate-100'
                        : 'bg-rose-50/80 border-rose-200 text-slate-900'
                    }`}
                  >
                    
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-500">
                        {Math.floor(recordingSeconds / 60)}:
                        {recordingSeconds % 60 < 10 ? '0' : ''}
                        {recordingSeconds % 60}
                      </span>
                    </div>

                    
                    <div className="flex-1 flex items-center justify-center gap-1 h-7 px-2 overflow-hidden">
                      {liveWaveBars.map((barHeight, i) => (
                        <div
                          key={i}
                          className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                          style={{
                            height: `${Math.min(26, Math.max(5, barHeight))}px`,
                          }}
                        />
                      ))}
                    </div>

                    
                    <div className="flex items-center gap-2 shrink-0">
                      
                      <button
                        type="button"
                        onClick={handleCancelRecording}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                          isNightMode
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        title="Отменить запись"
                      >
                        <Trash size={14} className="text-rose-500" />
                        <span className="hidden sm:inline">Отмена</span>
                      </button>

                      
                      <button
                        type="button"
                        onClick={handleSendVoiceMessage}
                        className="h-9 w-9 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
                        title="Отправить голосовое сообщение"
                      >
                        <PaperPlaneRight size={18} weight="bold" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── STANDARD INPUT BAR (TEXT + VOICE TOGGLE) ── */
                  <div className="relative flex items-center">
                    
                    <div
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10"
                      onMouseEnter={handleAttachMouseEnter}
                      onMouseLeave={handleAttachMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu((prev) => !prev)
                          setShowEmojiPicker(false)
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          showAttachMenu
                            ? 'text-blue-500 bg-blue-500/10'
                            : isNightMode
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
                        }`}
                        title="Прикрепить файл (наведите или нажмите)"
                        aria-label="Прикрепить файл"
                      >
                        <Paperclip size={20} weight="bold" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' &&
                          !e.shiftKey &&
                          !chatSettings.sendOnEnter &&
                          !e.ctrlKey &&
                          !e.metaKey
                        ) {
                          e.preventDefault()
                        }
                      }}
                      placeholder="Напишите сообщение или запишите голосовое..."
                      className={`w-full rounded-full border pl-12 pr-24 py-3.5 text-sm transition-colors ${
                        isNightMode
                          ? 'bg-slate-800/80 text-slate-100 border-slate-700 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none'
                          : 'bg-slate-50 text-foreground border-border placeholder:text-muted/60 focus:border-border-focus focus:outline-none'
                      }`}
                    />

                    
                    <div
                      className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
                      onMouseEnter={handleEmojiMouseEnter}
                      onMouseLeave={handleEmojiMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmojiPicker((prev) => !prev)
                          setShowAttachMenu(false)
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          showEmojiPicker
                            ? 'text-amber-500 bg-amber-500/10'
                            : isNightMode
                            ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-200/60'
                        }`}
                        title="Стикеры и эмодзи (наведите или нажмите)"
                        aria-label="Стикеры и эмодзи"
                      >
                        <Smiley size={20} weight="bold" />
                      </button>
                    </div>

                    
                    {inputText.trim().length > 0 ? (
                      <Button
                        type="submit"
                        className="!absolute right-1.5 top-1/2 -translate-y-1/2 !w-9 !h-9 !p-0 flex items-center justify-center shrink-0 !rounded-full animate-in zoom-in-75 duration-150"
                        title="Отправить сообщение"
                        aria-label="Отправить сообщение"
                      >
                        <PaperPlaneRight size={18} weight="bold" />
                      </Button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center transition-all active:scale-90 animate-in zoom-in-75 duration-150 ${
                          isNightMode
                            ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                        }`}
                        title="Записать голосовое сообщение"
                        aria-label="Записать голосовое сообщение"
                      >
                        <Microphone size={20} weight="fill" />
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

          
          {isSearchOpen && (
            <aside className={`w-80 border-l flex flex-col shrink-0 animate-in slide-in-from-right duration-200 ${isNightMode ? 'bg-[#111b21] border-slate-800 text-slate-100' : 'bg-white border-border text-foreground'
              }`}>
              
              <div className={`flex h-[64px] items-center gap-3 border-b px-4 shrink-0 ${isNightMode ? 'border-slate-800' : 'border-border'
                }`}>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-foreground'
                    }`}
                  title="Закрыть поиск"
                >
                  <X size={20} />
                </button>
                <h3 className="font-semibold text-sm">Поиск сообщений</h3>
              </div>

              
              <div className={`p-3 border-b flex items-center gap-2 shrink-0 relative ${isNightMode ? 'bg-[#111b21] border-slate-800' : 'bg-white border-border/40'
                }`}>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker((prev) => !prev)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 shrink-0 ${
                      showDatePicker || selectedSearchDate
                        ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-400/30'
                        : isNightMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                    title="Поиск по дате (Календарь)"
                  >
                    {selectedSearchDate ? (
                      <CalendarCheck size={19} weight="fill" />
                    ) : (
                      <CalendarBlank size={19} weight="bold" />
                    )}
                  </button>

                  
                  {showDatePicker && (
                    <div
                      className={`absolute top-11 left-0 z-50 w-72 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 select-none ${
                        isNightMode
                          ? 'bg-[#18222d] border-slate-700 text-slate-100 shadow-black/80'
                          : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
                      }`}
                    >
                      
                      <div className="flex items-center justify-between mb-2.5 px-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                            )
                          }
                          className={`p-1 rounded-lg transition-colors ${
                            isNightMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                          title="Предыдущий месяц"
                        >
                          <CaretLeft size={16} weight="bold" />
                        </button>

                        <span className="text-xs font-bold capitalize">
                          {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                            )
                          }
                          className={`p-1 rounded-lg transition-colors ${
                            isNightMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                          title="Следующий месяц"
                        >
                          <CaretRight size={16} weight="bold" />
                        </button>
                      </div>

                      
                      <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSearchDate(TODAY_DATE_STR)
                            setShowDatePicker(false)
                          }}
                          className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                            selectedSearchDate === TODAY_DATE_STR
                              ? 'bg-blue-500 text-white'
                              : isNightMode
                              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Сегодня
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSearchDate(YESTERDAY_DATE_STR)
                            setShowDatePicker(false)
                          }}
                          className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                            selectedSearchDate === YESTERDAY_DATE_STR
                              ? 'bg-blue-500 text-white'
                              : isNightMode
                              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Вчера
                        </button>
                        {selectedSearchDate && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSearchDate(null)
                              setShowDatePicker(false)
                            }}
                            className="py-1 px-2 rounded-lg text-[10px] font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            Сбросить
                          </button>
                        )}
                      </div>

                      
                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold ${
                              i >= 5 ? 'text-rose-400' : isNightMode ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dayObj, idx) => {
                          if (!dayObj) {
                            return <div key={`empty-${idx}`} className="h-7 w-7" />
                          }

                          const { dayNumber, dateStr, isToday, isSelected, hasMessages } = dayObj

                          return (
                            <button
                              key={dateStr}
                              type="button"
                              onClick={() => {
                                setSelectedSearchDate(dateStr)
                                setShowDatePicker(false)
                              }}
                              className={`h-7 w-7 rounded-lg flex flex-col items-center justify-center text-xs font-semibold relative transition-all active:scale-90 ${
                                isSelected
                                  ? 'bg-blue-500 text-white font-bold shadow-md'
                                  : isToday
                                  ? 'border border-blue-500 text-blue-500 font-bold'
                                  : isNightMode
                                  ? 'hover:bg-slate-800 text-slate-200'
                                  : 'hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span>{dayNumber}</span>
                              {hasMessages && !isSelected && (
                                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-blue-500" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                
                <div className="relative flex-1 flex items-center min-w-0">
                  <MagnifyingGlass
                    size={18}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={selectedSearchDate ? `Поиск за ${formatSearchDateTitle(selectedSearchDate)}...` : 'Поиск'}
                    className={`w-full rounded-full border pl-9 pr-8 py-2 text-xs transition-all ${isNightMode
                        ? 'bg-[#202c34] text-slate-100 border-[#2b3a46] placeholder:text-slate-400 focus:border-[#3b4d5c] focus:bg-[#25333d] focus:outline-none'
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

              
              {selectedSearchDate && (
                <div className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] ${
                  isNightMode ? 'bg-[#18232c]/70 border-slate-800 text-slate-300' : 'bg-blue-50/80 border-blue-100 text-blue-900'
                }`}>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold">Фильтр по дате:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-blue-500 text-white text-[10px]">
                      📅 {formatSearchDateTitle(selectedSearchDate)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSearchDate(null)}
                    className="text-slate-400 hover:text-rose-500 transition-colors shrink-0 text-[10px] font-semibold"
                    title="Сбросить фильтр даты"
                  >
                    Сбросить
                  </button>
                </div>
              )}

              
              <div className="flex-1 overflow-y-auto p-3">
                {!searchQuery.trim() && !selectedSearchDate ? (
                  <div className="flex h-full items-center justify-center text-center text-xs text-slate-400 px-6 select-none leading-relaxed">
                    Поиск сообщений с {activeChat.name} по тексту или выберите дату в календаре.
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center text-xs text-slate-400">
                    <MagnifyingGlass size={32} className="mb-2 opacity-40" />
                    <span>Сообщения не найдены</span>
                    {selectedSearchDate && (
                      <button
                        type="button"
                        onClick={() => setSelectedSearchDate(null)}
                        className="mt-2 text-blue-500 hover:underline text-[11px]"
                      >
                        Сбросить фильтр даты
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 px-1 mb-1">
                      <span>Найдено: {filteredMessages.length}</span>
                      {selectedSearchDate && (
                        <span>{formatSearchDateTitle(selectedSearchDate)}</span>
                      )}
                    </div>
                    {filteredMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => scrollToMessage(msg.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] ${isNightMode
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
                        <p className={`text-xs line-clamp-2 leading-relaxed ${isNightMode ? 'text-slate-300' : 'text-slate-600'
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

          
          {isProfileOpen && (
            <aside
              className={`w-80 border-l flex flex-col shrink-0 animate-in slide-in-from-right duration-200 select-none z-20 ${
                isNightMode ? 'bg-[#111b21] border-slate-800 text-slate-100' : 'bg-white border-border text-slate-900'
              }`}
            >
              
              <div
                className={`flex h-[64px] items-center justify-between border-b px-4 shrink-0 ${
                  isNightMode ? 'border-slate-800' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      isNightMode
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    title="Закрыть профиль (Esc)"
                  >
                    <X size={18} weight="bold" />
                  </button>
                  <h3 className="font-semibold text-sm">Информация</h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href)
                    showToast('Ссылка на профиль скопирована 📋')
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isNightMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Поделиться"
                >
                  <ShareNetwork size={18} weight="bold" />
                </button>
              </div>

              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                <div className="flex flex-col items-center text-center pt-1">
                  <div className="relative mb-3">
                    <UserAvatar avatar={activeChat.avatar} name={activeChat.name} size="xl" />
                    {activeChat.online && (
                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111b21]" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 justify-center">
                    <h2 className="font-bold text-base leading-tight">
                      {activeChat.name}
                    </h2>
                    {activeChat.isVerified && (
                      <SealCheck size={18} weight="fill" className="text-[#2F80ED] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeChat.statusText ?? (activeChat.online ? 'в сети' : 'был(а) недавно')}
                  </p>

                  
                  <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false)
                        const inputEl = document.querySelector('input[placeholder="Написать сообщение..."]') as HTMLInputElement
                        inputEl?.focus()
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${
                        isNightMode ? 'border-slate-800 bg-[#18232c]/70 hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <ChatCircleDots size={20} className="text-blue-500 mb-1" weight="fill" />
                      <span className="text-[11px] font-medium">Чат</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsEnabled((prev) => !prev)
                        showToast(notificationsEnabled ? 'Уведомления выключены 🔕' : 'Уведомления включены 🔔')
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${
                        isNightMode ? 'border-slate-800 bg-[#18232c]/70 hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {notificationsEnabled ? (
                        <Bell size={20} className="text-amber-500 mb-1" weight="fill" />
                      ) : (
                        <BellSlash size={20} className="text-slate-400 mb-1" weight="fill" />
                      )}
                      <span className="text-[11px] font-medium">Звук</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false)
                        setIsSearchOpen(true)
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${
                        isNightMode ? 'border-slate-800 bg-[#18232c]/70 hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <MagnifyingGlass size={20} className="text-emerald-500 mb-1" weight="bold" />
                      <span className="text-[11px] font-medium">Поиск</span>
                    </button>
                  </div>
                </div>

                
                <div
                  className={`rounded-2xl p-3 border space-y-3 ${
                    isNightMode ? 'bg-[#18222d]/60 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
                      <Phone size={16} weight="bold" />
                    </span>
                    <div>
                      <span className="block text-xs font-semibold select-text">
                        +7 (999) 782-41-20
                      </span>
                      <span className="block text-[10px] text-slate-400">Телефон</span>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0 mt-0.5">
                      <Info size={16} weight="bold" />
                    </span>
                    <div>
                      <span className="block text-xs leading-relaxed select-text">
                        💻 Разработчик интерфейсов и веб-сервисов. На связи в рабочее время.
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">О себе</span>
                    </div>
                  </div>

                  
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                      <At size={16} weight="bold" />
                    </span>
                    <div>
                      <span className="block text-xs font-semibold text-blue-500 select-text">
                        @{activeChat.name.toLowerCase().replace(/\s+/g, '_')}
                      </span>
                      <span className="block text-[10px] text-slate-400">Имя пользователя</span>
                    </div>
                  </div>
                </div>

                
                <div>
                  <div className="flex items-center gap-1 border-b border-slate-200/60 dark:border-slate-800 pb-1 mb-3">
                    <button
                      type="button"
                      onClick={() => setProfileActiveTab('media')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        profileActiveTab === 'media'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Медиа ({currentMessages.filter((m) => m.image).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileActiveTab('files')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        profileActiveTab === 'files'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Файлы ({currentMessages.filter((m) => m.fileName).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileActiveTab('voice')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        profileActiveTab === 'voice'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Голос ({currentMessages.filter((m) => m.voice).length})
                    </button>
                  </div>

                  
                  {profileActiveTab === 'media' && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {currentMessages.filter((m) => m.image).length === 0 ? (
                        <div className="col-span-3 py-6 text-center text-xs text-slate-400">
                          Нет фото и видео
                        </div>
                      ) : (
                        currentMessages
                          .filter((m) => m.image)
                          .map((m) => (
                            <img
                              key={m.id}
                              src={m.image}
                              alt="Медиа"
                              onClick={() => handleOpenMediaViewer(m)}
                              className="h-20 w-full object-cover rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
                            />
                          ))
                      )}
                    </div>
                  )}

                  {profileActiveTab === 'files' && (
                    <div className="space-y-1.5">
                      {currentMessages.filter((m) => m.fileName).length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Нет файлов
                        </div>
                      ) : (
                        currentMessages
                          .filter((m) => m.fileName)
                          .map((m) => (
                            <div
                              key={m.id}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs ${
                                isNightMode ? 'border-slate-800 bg-[#18232c]/50' : 'border-slate-200 bg-slate-50'
                              }`}
                            >
                              <FileText size={20} className="text-emerald-500 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">{m.fileName}</p>
                                <span className="text-[10px] text-slate-400">{m.fileSize || '1.2 MB'} • {m.time}</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}

                  {profileActiveTab === 'voice' && (
                    <div className="space-y-1.5">
                      {currentMessages.filter((m) => m.voice).length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Нет голосовых сообщений
                        </div>
                      ) : (
                        currentMessages
                          .filter((m) => m.voice)
                          .map((m) => (
                            <div
                              key={m.id}
                              onClick={() => handleTogglePlayVoice(m.id, m.voice!.seconds, m.voice?.audioUrl)}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all active:scale-[0.98] ${
                                isNightMode ? 'border-slate-800 bg-[#18232c]/50 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                              }`}
                            >
                              <button
                                type="button"
                                className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0"
                              >
                                {playingVoiceId === m.id ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">Голосовое сообщение</p>
                                <span className="text-[10px] text-slate-400">{m.voice!.duration} • {m.time}</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>

                
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Broom size={16} />
                    <span>Очистить историю</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('Пользователь заблокирован 🚫')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-500 hover:bg-amber-500/10 transition-colors text-left"
                  >
                    <Prohibit size={16} weight="bold" />
                    <span>Заблокировать</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteChat}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <Trash size={16} weight="bold" />
                    <span>Удалить чат</span>
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      
      <SidebarDrawer
        user={currentUser}
        isOpen={isDrawerOpen}
        initialView={drawerInitialView}
        isNightMode={isNightMode}
        onToggleNightMode={handleToggleNightMode}
        onClose={() => setIsDrawerOpen(false)}
        onSaveProfile={handleUpdateUser}
        onLogout={handleLogout}
        chatSettings={chatSettings}
        onUpdateChatSettings={handleUpdateChatSettings}
      />

      
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
              isNightMode
                ? 'bg-[#18222d] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <ChartBar size={20} weight="bold" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Создать опрос</h3>
                  <p className="text-xs text-slate-400">для участников чата {activeChat.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            
            <form onSubmit={handleCreatePoll} className="space-y-4 pt-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Вопрос
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Задайте вопрос..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition ${
                    isNightMode
                      ? 'bg-slate-800/80 border-slate-700 placeholder:text-slate-500 text-white'
                      : 'bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900'
                  }`}
                />
              </div>

              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Варианты ответа
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required={idx < 2}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...pollOptions]
                          newOpts[idx] = e.target.value
                          setPollOptions(newOpts)
                        }}
                        placeholder={`Вариант ${idx + 1}`}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition ${
                          isNightMode
                            ? 'bg-slate-800/80 border-slate-700 placeholder:text-slate-500 text-white'
                            : 'bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900'
                        }`}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                          title="Удалить вариант"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 transition pt-1"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Добавить вариант</span>
                  </button>
                )}
              </div>

              
              <div className={`p-3 rounded-2xl border space-y-2.5 ${isNightMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="font-medium">Анонимное голосование</span>
                  <input
                    type="checkbox"
                    checked={pollAnonymous}
                    onChange={(e) => setPollAnonymous(e.target.checked)}
                    className="h-4 w-4 accent-blue-500 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="font-medium">Выбор нескольких ответов</span>
                  <input
                    type="checkbox"
                    checked={pollMultiple}
                    onChange={(e) => setPollMultiple(e.target.checked)}
                    className="h-4 w-4 accent-blue-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    isNightMode
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-600 active:scale-95 text-white shadow-md transition"
                >
                  Создать опрос
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
              isNightMode
                ? 'bg-[#18222d] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle size={20} weight="bold" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Создать чек-лист</h3>
                  <p className="text-xs text-slate-400">для совместных задач в {activeChat.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChecklistModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            
            <form onSubmit={handleCreateChecklist} className="space-y-4 pt-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Название чек-листа
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="Например: План релиза v2.0..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition ${
                    isNightMode
                      ? 'bg-slate-800/80 border-slate-700 placeholder:text-slate-500 text-white'
                      : 'bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900'
                  }`}
                />
              </div>

              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Пункты задач
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required={idx === 0}
                        value={item}
                        onChange={(e) => {
                          const newItems = [...checklistItems]
                          newItems[idx] = e.target.value
                          setChecklistItems(newItems)
                        }}
                        placeholder={`Пункт ${idx + 1}`}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition ${
                          isNightMode
                            ? 'bg-slate-800/80 border-slate-700 placeholder:text-slate-500 text-white'
                            : 'bg-slate-50 border-slate-200 placeholder:text-slate-400 text-slate-900'
                        }`}
                      />
                      {checklistItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setChecklistItems(checklistItems.filter((_, i) => i !== idx))
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                          title="Удалить пункт"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {checklistItems.length < 10 && (
                  <button
                    type="button"
                    onClick={() => setChecklistItems([...checklistItems, ''])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition pt-1"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Добавить пункт</span>
                  </button>
                )}
              </div>

              
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChecklistModal(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    isNightMode
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-md transition"
                >
                  Создать чек-лист
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl border border-slate-700/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkle size={15} weight="fill" className="text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none"
          onClick={() => {
            setPreviewMedia(null)
            setIsMediaZoomed(false)
          }}
        >
          
          <div
            className="w-full flex items-center justify-between p-4 z-20 bg-linear-to-b from-black/80 via-black/40 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-white/90">
              <span className="px-2 py-0.5 rounded-md bg-white/15 text-xs font-bold uppercase tracking-wider">
                {previewMedia.isGif ? 'GIF' : 'МЕДИА'}
              </span>
              <span className="text-xs text-white/70">
                {previewMedia.sender || 'HeyChat'} • {previewMedia.time || 'сегодня'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewMedia(null)
                  setIsMediaZoomed(false)
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all shadow-lg cursor-pointer"
                title="Закрыть (Esc)"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
          </div>

          
          <div
            className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            
            {currentMessages.filter((m) => Boolean(m.image)).length > 1 && (
              <button
                type="button"
                onClick={() => handleNavigateMedia('prev')}
                className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer backdrop-blur-xs border border-white/10 shadow-xl"
                title="Предыдущее (←)"
              >
                <CaretLeft size={24} weight="bold" />
              </button>
            )}

            
            
            <img
              src={previewMedia.url}
              alt={previewMedia.title || 'Медиа'}
              className={`max-w-full max-h-[76vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200 cursor-pointer ${
                isMediaZoomed ? 'scale-135 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setIsMediaZoomed((prev) => !prev)}
            />

            
            {currentMessages.filter((m) => Boolean(m.image)).length > 1 && (
              <button
                type="button"
                onClick={() => handleNavigateMedia('next')}
                className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110 active:scale-90 z-20 cursor-pointer backdrop-blur-xs border border-white/10 shadow-xl"
                title="Следующее (→)"
              >
                <CaretRight size={24} weight="bold" />
              </button>
            )}
          </div>

          
          <div
            className="w-full flex items-center justify-between px-6 py-4 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent text-white"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white/95 truncate max-w-xs sm:max-w-md">
                {previewMedia.title || 'GIF'}
              </span>
              <span className="text-xs text-white/60">
                {previewMedia.sender || 'HeyChat'} • {previewMedia.time || 'сегодня'}
              </span>
            </div>

            
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              <button
                type="button"
                onClick={() => setIsMediaZoomed((prev) => !prev)}
                className="p-2.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer"
                title={isMediaZoomed ? 'Уменьшить' : 'Увеличить'}
              >
                {isMediaZoomed ? <ArrowsIn size={20} weight="bold" /> : <ArrowsOut size={20} weight="bold" />}
              </button>

              
              <button
                type="button"
                onClick={() => handleShareMedia(previewMedia.url)}
                className="p-2.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="Копировать ссылку"
              >
                <ShareFat size={20} weight="bold" />
              </button>

              
              <button
                type="button"
                onClick={() => handleDownloadMedia(previewMedia.url, previewMedia.title)}
                className="p-2.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-all active:scale-95 cursor-pointer"
                title="Сохранить на диск"
              >
                <DownloadSimple size={20} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
