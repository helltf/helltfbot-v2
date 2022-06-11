import { ChatUserstate } from 'tmi.js'
import { PermissionLevel } from '../utilities/permission/types'

export interface TwitchUserState extends ChatUserstate {
  permission?: PermissionLevel
}
export interface BotResponse {
  success?: boolean
  response: string
  channel: string
}
