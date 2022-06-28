import { ChatUserstate } from 'tmi.js'
import { ChatPermissionLevel, GlobalPermissionLevel } from '../utilities/permission/types'

export interface TwitchUserState extends ChatUserstate {
  permission?: ChatPermissionLevel | GlobalPermissionLevel
}
export interface BotResponse {
  success?: boolean
  response: string | string[]
}
