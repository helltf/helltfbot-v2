import { BotResponse } from '../../client/types'
import { ChatPermissionLevel, GlobalPermissionLevel } from '../../utilities/permission/types'
import { Command, CommandContext, CommandFlag } from '../types'

export class LeaveCommand implements Command {
  name = 'leave'
  description = 'leave a channel'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['channel']
  optionalParams = []
  cooldown = 5000
  alias = ['l']
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute({
    user,
    message: [channeltoLeave]
  }: CommandContext): Promise<BotResponse> {
    const errorResponse: BotResponse = {
      success: false,
      response: ''
    }

    if (!channeltoLeave) {
      errorResponse.response = 'You need to define a channel'
      return errorResponse
    }

    if (
      channeltoLeave !== 'me' &&
      user.permission! < GlobalPermissionLevel.ADMIN
    ) {
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
      response: message
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

