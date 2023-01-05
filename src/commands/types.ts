
import { BotResponse, TwitchUserState } from "../client/types"
import { ChatPermissionLevel, GlobalPermissionLevel } from "../utilities/permission/types"
import { BaseCommand } from "./base"


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
  execute<T extends BaseCommand>(
    context: CommandContext<T>
  ): Promise<BotResponse>
  static?: {
    [key: string]: any
  }
}

export type CommandParams<T extends BaseCommand> = {
  [key in T['requiredParams'][number]]: string
} & {
  [key in T['optionalParams'][number]]?: string
}

export interface CommandContext<T extends BaseCommand> {
  user: TwitchUserState
  channel: string
  params: CommandParams<T>
  type?: MessageType
}

export enum MessageType {
  MESSAGE = 'message',
  WHISPER = 'whisper'
}

export enum CommandFlag {
  WHISPER = 'whisper',
  LOWERCASE = 'lowercase',
  APPEND_PARAMS = 'append_params'
}
