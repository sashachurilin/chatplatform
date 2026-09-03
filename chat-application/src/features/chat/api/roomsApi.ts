import { apiClient } from '@/shared/api'

export interface BackendRoom {
  id: string
  name: string
  type: 'PUBLIC' | 'PRIVATE' | 'DIRECT'
  participantsCount?: number
  createdAt?: string
  lastMessage?: BackendMessage
}

export interface BackendMessage {
  id: string
  roomId: string
  senderId: string
  senderUsername: string
  senderUserTag?: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'FILE'
  status?: string
  sentAt: string
  fileUrl?: string
  fileName?: string
}

export async function getUserRooms(): Promise<BackendRoom[]> {
  return apiClient<BackendRoom[]>('/api/rooms', {
    method: 'GET',
  })
}

export async function createRoom(
  name: string,
  type: 'PUBLIC' | 'PRIVATE' | 'DIRECT' = 'PUBLIC'
): Promise<BackendRoom> {
  return apiClient<BackendRoom>(
    `/api/rooms?name=${encodeURIComponent(name)}&type=${type}`,
    {
      method: 'POST',
    }
  )
}

export async function getRoomMessages(
  roomId: string,
  page = 0,
  size = 50
): Promise<BackendMessage[]> {
  return apiClient<BackendMessage[]>(
    `/api/rooms/${roomId}/messages?page=${page}&size=${size}`,
    {
      method: 'GET',
    }
  )
}

export async function sendRoomMessage(
  roomId: string,
  content: string,
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'FILE' = 'TEXT'
): Promise<BackendMessage> {
  return apiClient<BackendMessage>(
    `/api/rooms/${roomId}/messages?content=${encodeURIComponent(content)}&messageType=${messageType}`,
    {
      method: 'POST',
    }
  )
}
