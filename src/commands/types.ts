import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types"
import { BotResponse, TwitchUserState } from "../client/types"
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
  [key in
    | T['optionalParams'][number]
    | T['requiredParams'][number]]: key extends T['requiredParams'][number]
    ? string
    : string | undefined
}

export interface CommandContext<T extends BaseCommand> {
  user: TwitchUserState
  channel: string
  message: string[]
  params: CommandParams<T>
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
