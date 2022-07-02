import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import {
  ChatPermissionLevel,
} from '@src/utilities/permission/types'

export class ColorHistoryCommand implements Command {
  name = 'colorhistory'
  permissions = ChatPermissionLevel.USER
  description = 'replies with the history of colors'
  requiredParams = []
  optionalParams = ['user']
  alias = ['colors', 'history']
  flags = [CommandFlag.WHISPER]
  cooldown = 15000
  execute = async ({ user }: CommandContext): Promise<BotResponse> => {
    const history = await this.methods.getColorHistory(user.username!)

    if (!history)
      return {
        success: false,
        response: 'no history found'
      }

    return {
      success: true,
      response: [
        `Your recent colors are ${history.history[0]}`,
        `last change ${hb.utils.humanizeNow(history.lastChange)} ago`
      ]
    }
  }
  methods = {
    getColorHistory: async (
      username: string
    ): Promise<{ history: string[]; lastChange: number } | undefined> => {
      return
    }
  }
}