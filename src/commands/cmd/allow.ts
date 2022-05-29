import { BotResponse } from '../../client/types.js'

import { TwitchUserState } from '../../client/types.js'
import { PermissionLevel } from '../../utilities/twitch/types.js'
import { Command } from '../export/types.js'


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

    const success = await this.updateChannelAllowSettings(updateChannel)

    if (!success) {
      errorResponse.response = 'This channel is not registered'
      return errorResponse
    }

    return {
      response: 'Successfully updated setttngs',
      channel: channel,
      success: true
    }
  }

  async updateChannelAllowSettings(channel: string) {
    if (!(await this.IsChannelExisting(channel))) return false
    await hb.db.channelRepo.update(
      {
        channel: channel
      },
      {
        allowed: true
      }
    )
    return true
  }

  async IsChannelExisting(channel: string) {
    return (
      (await hb.db.channelRepo.countBy({
        channel: channel
      })) !== 0
    )
  }
}



