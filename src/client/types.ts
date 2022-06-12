import { ChatUserstate } from 'tmi.js'
import { ChatPermissionLevel } from '../utilities/permission/types'

export interface TwitchUserState extends ChatUserstate {
  permission?: ChatPermissionLevel
}
export interface BotResponse {
  success?: boolean
  response: string
  channel: string
}
