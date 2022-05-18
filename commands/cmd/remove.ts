import { BotResponse } from '../../client/response.js'
import { TwitchUserState } from '../../client/types.js'
import { UpdateEventType } from '../../modules/pubsub/types.js'
import { Command } from '../export/types.js'

export const remove = new Command({
  name: 'remove',
  alias: ['rmn', 'removenotify', 'removeme'],
  cooldown: 5000,
  description: 'removes your notification for the given event',
  optionalParams: [],
  requiredParams: ['streamer', 'event'],
  permissions: 0,
  execute: async (
    channel: string,
    user: TwitchUserState,
    [streamer, event]: string[]
  ): Promise<BotResponse> => {
    return {
      success: false,
      channel: channel,
      response: `Event unknown. Valid events are ${Object.values(
        UpdateEventType
      ).join(' ')}`
    }
  }
})
