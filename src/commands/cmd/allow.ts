import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { BotResponse } from '../../client/types'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class AllowCommand extends BaseCommand {
  name = 'allow'
  description = 'allows messages from the bot'
  permissions = ChatPermissionLevel.USER
  requiredParams = [] as const
  optionalParams = ['channel'] as const
  cooldown = 5000
  alias = []
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  async execute({
    user,
    message: [updateChannel]
  }: CommandContext<AllowCommand>): Promise<BotResponse> {
    const errorResponse = {
      response: 'You are not permitted to execute this command',
      success: false
    }

    if (user.permission! < ChatPermissionLevel.BROADCASTER) return errorResponse
    if (user.permission! === ChatPermissionLevel.BROADCASTER && updateChannel)
      return errorResponse

    updateChannel = updateChannel || user.username!

    const success = await this.methods.updateChannelAllowSettings(updateChannel)

    if (!success) {
      errorResponse.response = 'This channel is not registered'
      return errorResponse
    }

    return {
      response: 'Successfully updated settings',
      success: true
    }
  }

  methods = {
    updateChannelAllowSettings: async (channel: string): Promise<boolean> => {
      if (!(await this.methods.IsChannelExisting(channel))) return false
      await hb.db.channel.update(
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
        (await hb.db.channel.countBy({
          channel: channel
        })) !== 0
      )
    }
  }
}
