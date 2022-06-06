import { BotResponse } from '../../client/types'

import { TwitchUserState } from '../../client/types'
import { PermissionLevel } from '../../utilities/twitch/types'
import { Command } from '../types'

export class AllowCommand implements Command {
  name = 'allow'
  description = 'Allow messages from the bot'
  permissions = 0
  requiredParams = []
  optionalParams = ['channel']
  cooldown = 5000
  alias = []

  async execute(
    channel: string,
    user: TwitchUserState,
    [updateChannel]: string[]
  ): Promise<BotResponse> {
    const errorResponse = {
      channel: channel,
      response: 'You are not permitted to execute this command',
      success: false
    }

    if (user.permission! < PermissionLevel.BROADCASTER) return errorResponse
    if (user.permission! === PermissionLevel.BROADCASTER && updateChannel)
      return errorResponse

    updateChannel = updateChannel || user.username!

    const success = await this.methods.updateChannelAllowSettings(updateChannel)

    if (!success) {
      errorResponse.response = 'This channel is not registered'
      return errorResponse
    }

    return {
      response: 'Successfully updated settings',
      channel: channel,
      success: true
    }
  }

  methods = {
    updateChannelAllowSettings: async (channel: string): Promise<boolean> => {
      if (!(await this.methods.IsChannelExisting(channel))) return false
      await hb.db.channelRepo.update(
        {
          channel: channel
        },
        {
          allowed: true
        }
      )
      return true
    },

    IsChannelExisting: async (channel: string): Promise<boolean> => {
      return (
        (await hb.db.channelRepo.countBy({
          channel: channel
        })) !== 0
      )
    }
  }
}



