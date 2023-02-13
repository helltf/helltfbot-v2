import { BotResponse } from "@src/client/types";
import {  CommandContext} from "@src/commands/types";
import {
  GlobalPermissionLevel
} from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'

export class DisableCommand extends BaseCommand {
  name = 'disable'
  permissions = GlobalPermissionLevel.USER
  description = 'disables messages from the bot'
  requiredParams = [] as const
  optionalParams = [] as const
  alias = ['mute']
  flags = []
  cooldown = 30000

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute({
    channel
  }: CommandContext<DisableCommand>): Promise<BotResponse> {
    const success = await this.methods.disable(channel)

    if (!success) return { response: 'Bot is already disabled', success: false }

    return { response: 'disabled', success: true }
  }
  methods = {
    disable: async (channel: string): Promise<boolean> => {
      const channelData = await this.deps.db.channel.findOneBy({ channel })

      if (!channelData?.allowed) return false

      const updateResult = await this.deps.db.channel.update(
        { channel },
        { allowed: false }
      )

      return updateResult.affected !== 0
    }
  }
}
