import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types"
import { BotResponse, TwitchUserState } from "../client/types"


export interface Command {
  name: string
  permissions: ChatPermissionLevel | GlobalPermissionLevel
  description: string
  requiredParams: string[]
  optionalParams: string[]
  alias: string[]
  flags: CommandFlag[]
  cooldown: number
  methods?: {
    [key: string]: (...args: any) => Promise<any> | any
  }
  execute: (context: CommandContext) => Promise<BotResponse>
  static?: {
    [key: string]: any
  }
}

export interface CommandContext {
  user: TwitchUserState
  channel: string
  message: string[]
  type?: MessageType
}

export enum MessageType {
  MESSAGE = 'message',
  WHISPER = 'whisper'
}

export enum CommandFlag {
  WHISPER = 'whisper',
  LOWERCASE = 'lowercase'
}
