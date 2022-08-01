import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { SuggestionStatus } from "@src/db/entity/suggestion.entity";
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class AcceptCommand implements Command {
  name = 'accept'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'Accepts the given suggestion with a reason'
  requiredParams = ['id']
  optionalParams = ['reason']
  alias = ['acceptsuggestion']
  flags = [CommandFlag.WHISPER]
  cooldown = 0
  execute = async ({
    message: [id, ...reason]
  }: CommandContext): Promise<BotResponse> => {
    if (!id)
      return {
        response: 'id missing',
        success: false
      }

    const success = await this.methods.updateSuggestion(id, reason.join(' '))

    return {
      success: success,
      response: success ? 'Updated suggestion' : 'suggestion does not exist'
    }
  }
  methods = {
    updateSuggestion: async (id: string, reason: string): Promise<boolean> => {
      const result = await hb.db.suggestion.update(
        {
          id: Number(id)
        },
        { status: SuggestionStatus.ACCEPTED, reason: reason }
      )

      return result.affected !== 0
    }
  }
}
