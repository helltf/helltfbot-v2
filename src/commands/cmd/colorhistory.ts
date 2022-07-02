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
  execute = async ({
    user,
    message: [userParam]
  }: CommandContext): Promise<BotResponse> => {
    const username = userParam !== undefined ? userParam : user.username!
    const history = await this.methods.getColorHistory(username)

    if (!history)
      return {
        success: false,
        response: 'no history found'
      }

    const [begin, ...rest] = history.history

    return {
      success: true,
      response: [
        `${username}s recent colors are ${begin}`,
        ...rest,
        `changed ${hb.utils.humanizeNow(history.lastChange)} ago`
      ]
    }
  }
  methods = {
    getColorHistory: async (
      username: string
    ): Promise<{ history: string[]; lastChange: number } | undefined> => {
      const entity = await hb.db.colorRepo.findOneBy({
        user: {
          name: username
        }
      })

      if (!entity) return

      return {
        history: entity.history,
        lastChange: Number(entity.change_timestamp)
      }
    }
  }
}