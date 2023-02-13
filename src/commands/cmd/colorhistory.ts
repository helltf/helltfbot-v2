import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import {
  ChatPermissionLevel,
} from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BaseCommand } from '../base'

export class ColorHistoryCommand extends BaseCommand {
  name = 'colorhistory'
  permissions = ChatPermissionLevel.USER
  description = 'replies with the history of colors'
  requiredParams = [] as const
  optionalParams = ['user'] as const
  alias = ['colors', 'history']
  flags = [CommandFlag.WHISPER]
  cooldown = 15000

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute({
    user,
    params: { user: userParam }
  }: CommandContext<ColorHistoryCommand>): Promise<BotResponse> {
    const username = userParam !== undefined ? userParam : user.username!
    const history = await this.methods.getColorHistory(username)

    if (!history)
      return {
        success: false,
        response: 'no history found'
      }

    const {
      history: [begin, ...rest]
    } = history

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
      const entity = await hb.db.color.findOneBy({
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
