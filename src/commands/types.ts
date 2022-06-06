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
  execute: (
    channel: string,
    userstate: TwitchUserState,
    message: string[]
  ) => Promise<BotResponse>
}


