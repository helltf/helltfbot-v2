import { Notification } from '../../db/export-entities'

export interface ParsedPubSubData {
  type: MessageType
  error?: string
  data?: any
  nonce?: string
}

export type PubSubMessageEventType =
  | 'stream-up'
  | 'stream-down'
  | 'broadcast_settings_update'

export type MessageType =
  | 'RESPONSE'
  | 'MESSAGE'
  | 'PONG'
  | 'LISTEN'
  | 'RECONNECT'
  | 'UNLISTEN'

export interface Topic {
  id: number
  prefix: TopicPrefix
}

export interface PubSubData<T extends IncomingMessage> {
  topic: string
  message: T
}

interface IncomingMessage {
  type: PubSubMessageEventType
}

export interface NotificationMessageInfo {
  type: UserNotificationType
  message: string
  streamer: string
  notifiedUsers: Notification[]
}

export interface StatusMessage extends IncomingMessage {
  server_time: number
  play_delay: number
}

export interface SettingMessage extends IncomingMessage {
  channel?: string
  channel_id?: string
  old_status?: string
  status?: string
  old_game?: string
  game?: string
  old_game_id?: number
  game_id?: number
}

export interface OutgoingMessage {
  type: MessageType
  nonce: string
  data: {
    topics: string[]
    auth_token: string
  }
}

export interface TwitchNotificationMessage {
  notifications: Map<string, string>
}

export enum TopicPrefix {
  SETTING = 'broadcast-settings-update.',
  STATUS = 'video-playback-by-id.'
}

export enum NotifyEventType {
  SETTING = 'setting',
  STATUS = 'status'
}

export enum UserNotificationType {
  LIVE = 'live',
  OFFLINE = 'offline',
  TITLE = 'title',
  GAME = 'game'
}
