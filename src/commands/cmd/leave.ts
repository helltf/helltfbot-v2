import { BotResponse } from '../../client/types'
import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/services/permissions.service'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class LeaveCommand extends BaseCommand {
  name = 'leave'
  description = 'leave a channel'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['channel'] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = ['l']
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute({
    user,
    params: { channel: channeltoLeave }
  }: CommandContext<LeaveCommand>): Promise<BotResponse> {
    const errorResponse: BotResponse = {
      success: false,
      response: ''
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
      await hb.db.channel.update(
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
        (await hb.db.channel.countBy({
          channel: channel,
          joined: true
        })) === 0
      )
    }
  }
}
