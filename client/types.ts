import { ChatUserstate } from 'tmi.js'
import { TwitchApi } from '../api/twitch/export-api.js'
import { PermissionLevel } from '../utilities/twitch/types.js'

export interface TwitchUserState extends ChatUserstate {
  permission?: PermissionLevel
}
export interface APIs {
  twitch?: TwitchApi
}
