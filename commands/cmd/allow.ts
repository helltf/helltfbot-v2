import { BotResponse } from '../../client/response.js'
import { TwitchUserState } from '../../client/types.js'
import { PermissionLevel } from '../../utilities/twitch/types.js'
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
    const errorResponse = {
      channel: channel,
      response: 'You are not permitted to execute this command',
      success: false
    }

    if (user.permission < PermissionLevel.BROADCASTER) return errorResponse
    if (user.permission === PermissionLevel.BROADCASTER && updateChannel)
      return errorResponse

    return {
      response: 'Successfully updated setttngs',
      channel: channel,
      success: true
    }
  }
})

export { allow }
