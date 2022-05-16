import { BotResponse } from '../../client/response.js'
import { TwitchUserState } from '../../client/types.js'
import { Command } from '../export/types.js'

const allow = new Command({
  name: 'allow',
  description: 'Allow messages from the bot',
  permissions: 0,
  requiredParams: [],
  optionalParams: ['channel'],
  cooldown: 5000,
  alias: [],
  execute: async (
    channel: string,
    user: TwitchUserState,
    [updateChannel]
  ): Promise<BotResponse> => {
    return {
      channel: channel,
      response: 'You are not permitted to execute this command',
      success: false
    }
  }
})

export { allow }
