import { BotResponse } from "@src/client/types";
import { Command, CommandContext} from "@src/commands/types";
import {
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class DisableCommand implements Command {
  name = 'disable'
  permissions = GlobalPermissionLevel.USER
  description = 'disables messages from the bot'
  requiredParams = []
  optionalParams = []
  alias = ['mute']
  flags = []
  cooldown = 30000
  execute = async ({ channel }: CommandContext): Promise<BotResponse> => {
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
