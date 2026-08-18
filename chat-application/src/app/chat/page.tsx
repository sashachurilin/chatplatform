import type { Metadata } from 'next'
import { ChatWidget } from '@/widgets/chat'

export const metadata: Metadata = {
  title: 'Чат — HeyChat!',
  description: 'Общайтесь в HeyChat!',
}

export default function ChatPage() {
  return <ChatWidget />
}
