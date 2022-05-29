import { BotResponse } from '../../client/types.js'

import { TwitchUserState } from '../../client/types.js'

export interface Command {
  name: string
  permissions: number
  description: string
  requiredParams: string[]
  optionalParams: string[]
  alias: string[]
  cooldown: number
  execute: (
    channel: string,
    userstate: TwitchUserState,
    message: string[]
  ) => Promise<BotResponse>
}


