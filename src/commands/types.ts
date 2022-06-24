import { BotResponse, TwitchUserState } from "../client/types"


export interface Command {
  name: string
  permissions: number
  description: string
  requiredParams: string[]
  optionalParams: string[]
  alias: string[]
  cooldown: number
  methods?: {
    [key: string]: (...args: any) => Promise<any> | any
  }
  execute: (context: Context) => Promise<BotResponse>
}

export interface Context {
  user: TwitchUserState
  channel: string
  message: string[]
  type?: 'message' | 'whisper'
}
