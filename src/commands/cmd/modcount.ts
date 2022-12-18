import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/utilities/permission/types";
import { BaseCommand } from '../base'

export class ModCountCommand extends BaseCommand {
  name = 'modcount'
  permissions = GlobalPermissionLevel.USER
  description = 'gets the amount of moderators'
  requiredParams = [] as const
  optionalParams = ['channel'] as const
  alias = ['mcount', 'moderatorcount']
  flags = [CommandFlag.WHISPER]
  cooldown = 10000
  execute = async ({
    channel,
    message: [givenChannel]
  }: CommandContext): Promise<BotResponse> => {
    const lookupChannel = givenChannel ?? channel

    const amount = await this.methods.getModCount(lookupChannel)

    if (amount === undefined) {
      return {
        response: 'Could not get moderators of that channel',
        success: false
      }
    }

    return {
      response: `@${lookupChannel} has ${amount} ${hb.utils.plularizeIf(
        'moderator',
        amount
      )}`,
      success: true
    }
  }

  methods = {
    getModCount: async (channel: string): Promise<number | undefined> => {
      try {
        return (await hb.client.mods(channel)).length
      } catch (e) {
        return undefined
      }
    }
  }
}
