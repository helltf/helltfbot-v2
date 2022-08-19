import { BotResponse } from '@src/client/types';
import { Command, CommandContext, CommandFlag } from '@src/commands/types'
import { SuggestionStatus } from '@src/db/entities/suggestion.entity';
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export class DenyCommand implements Command {
  name = 'deny'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'denies a suggestion'
  requiredParams = ['id']
  optionalParams = ['reason']
  alias = ['denysuggestion']
  flags = [CommandFlag.WHISPER]
  cooldown = 10000
  execute = async ({
    message: [id, ...reason]
  }: CommandContext): Promise<BotResponse> => {
    if (!id) return { response: 'no id given', success: false }

    const success = await this.methods.updateSuggestion(id, reason.join(' '))

    if (!success)
      return { response: 'suggestion does not exist', success: false }

    return {
      response: `Successfully updated suggestion with id ${id}`,
      success: true
    }
  }

  methods = {
    updateSuggestion: async (
      id: string,
      reason: string | undefined
    ): Promise<boolean> => {
      const updated = await hb.db.suggestion.update(
        {
          id: Number(id)
        },
        { reason, status: SuggestionStatus.DENIED }
      )

      return updated.affected !== 0
    }
  }
}

