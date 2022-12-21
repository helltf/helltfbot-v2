import {  MessageType } from '@src/commands/types'
import { ChatUserstate } from 'tmi.js'
import { ChatPermissionLevel, GlobalPermissionLevel } from '../utilities/permission/types'

export interface TwitchUserState extends ChatUserstate {
  permission?: ChatPermissionLevel | GlobalPermissionLevel
}
export interface BotResponse {
  success?: boolean
  response: string | string[]
}

export interface ChatContext {
  where: string
  type: MessageType
  self: boolean
  message: string
  user: TwitchUserState
}

export interface ResponseContext {
  where: string
  response: BotResponse
  type: MessageType
}
