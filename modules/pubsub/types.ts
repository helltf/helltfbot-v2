import ReconnectingWebSocket from 'reconnecting-websocket'
import { Notification } from '../../db/export-entities.js'

export type PubSubMessageEventType =
  | 'stream-up'
  | 'stream-down'
  | 'broadcast_settings_update'

export type PubSubType = 'RESPONSE' | 'MESSAGE' | 'PONG' | 'LISTEN'

export interface PubSubData<T extends PubSubDataMessage> {
  topic: string
  message: T
}

interface PubSubDataMessage {
  type: PubSubMessageEventType
}

export interface NotificationMessageInfo {
  type: UpdateEventType
  message: string
  streamer: string
  notifiedUsers: Notification[]
}

export interface StatusMessage extends PubSubDataMessage {
  server_time: number
  play_delay: number
}

export interface SettingMessage extends PubSubDataMessage {
  channel?: string
  channel_id?: string
  old_status?: string
  status?: string
  old_game?: string
  game?: string
  old_game_id?: number
  game_id?: number
}

export interface WebSocketConnection {
  connection: ReconnectingWebSocket
  interval: NodeJS.Timer
  listenedTopicsLength: number
}

export interface PubSubChannel {
  name: string
  id: number
}

export interface PubSubMessage {
  type: PubSubType
  nonce: string
  data: {
    topics: string[]
    auth_token: string
  }
}

export interface TwitchNotificationMessage {
  notifications: Map<string, string>
}

export enum TopicType {
  INFO = 'broadcast-settings-update.',
  LIVE = 'video-playback-by-id.'
}

export enum UpdateEventType {
  LIVE = 'live',
  OFFLINE = 'offline',
  TITLE = 'title',
  GAME = 'game'
}
