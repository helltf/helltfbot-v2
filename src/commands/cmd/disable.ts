
import { BotResponse } from '../../client/types'
import { GlobalPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandContext } from '../types'

export class DisableCommand extends BaseCommand {
  name = 'disable'
  permissions = GlobalPermissionLevel.USER
  description = 'disables messages from the bot'
  requiredParams = [] as const
  optionalParams = [] as const
  alias = ['mute']
  flags = []
  cooldown = 30000
  async execute({
    channel
  }: CommandContext<DisableCommand>): Promise<BotResponse> {
    const success = await this.methods.disable(channel)

    if (!success) return { response: 'Bot is already disabled', success: false }

    return { response: 'disabled', success: true }
  }
  methods = {
    disable: async (channel: string): Promise<boolean> => {
      const channelData = await hb.db.channel.findOneBy({ channel })

      if (!channelData?.allowed) return false

      const updateResult = await hb.db.channel.update(
        { channel },
        { allowed: false }
      )

      return updateResult.affected !== 0
    }
  }
}
