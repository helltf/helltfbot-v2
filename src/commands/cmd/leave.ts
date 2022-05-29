import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/types.js'
import { PermissionLevel } from '../../utilities/twitch/types.js'
import { Command } from '../export/types.js'

export class LeaveCommand implements Command {
  name = 'leave'
  description = 'leave a new channel with main client'
  permissions = 0
  requiredParams = ['channel']
  optionalParams = []
  cooldown = 5000
  alias = ['l']
  async execute(
    channel: string,
    user: ChatUserstate,
    [channeltoLeave]: string[]
  ): Promise<BotResponse> {
    const errorResponse: BotResponse = { channel, success: false, response: '' }

    if (!channeltoLeave) {
      errorResponse.response = 'You need to define a channel'
      return errorResponse
    }

    if (channeltoLeave !== 'me' && user.permission < PermissionLevel.ADMIN) {
      errorResponse.response = 'You are not permitted to issue this command'
      return errorResponse
    }
    channeltoLeave = channeltoLeave === 'me' ? user.username! : channeltoLeave

    if (await this.methods.isNotConnectedToChannel(channeltoLeave)) {
      errorResponse.response = 'Not connected to channel'
      return errorResponse
    }
    const { success, message } = await this.methods.leaveChannel(channeltoLeave)

    if (success) await this.methods.updateChannelProperty(channeltoLeave)
    return {
      success,
      response: message,
      channel: channel
    }
  }

  methods = {
    async leaveChannel(channel: string): Promise<{
      success: boolean
      message: string
    }> {
      try {
        await hb.client.part(channel)
        return {
          success: true,
          message: 'Successfully left the channel'
        }
      } catch (e) {
        return {
          success: false,
          message: 'Could not leave the channel'
        }
      }
    },

    async updateChannelProperty(channel: string) {
      await hb.db.channelRepo.update(
        {
          channel: channel
        },
        {
          joined: false
        }
      )
    },


    async isNotConnectedToChannel(channel: string): Promise<boolean> {
      return (
        (await hb.db.channelRepo.countBy({
          channel: channel,
          joined: true
        })) === 0
      )
    }
  }
}

