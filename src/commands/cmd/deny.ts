
import { BotResponse } from '../../client/types'
import { SuggestionStatus } from '../../db/entities/suggestion.entity'
import { GlobalPermissionLevel } from '../../utilities/permission/types'
import { BaseCommand } from '../base'
import { CommandFlag, CommandContext } from '../types'

export class DenyCommand extends BaseCommand {
  name = 'deny'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'denies a suggestion'
  requiredParams = ['id'] as const
  optionalParams = ['reason'] as const
  alias = ['denysuggestion']
  flags = [CommandFlag.WHISPER, CommandFlag.APPEND_PARAMS]
  cooldown = 10000
  async execute({
    params: { id, reason }
  }: CommandContext<DenyCommand>): Promise<BotResponse> {
    if (!id) return { response: 'no id given', success: false }

    const success = await this.methods.updateSuggestion(id, reason)

    if (!success)
      return { response: 'suggestion does not exist', success: false }

    await this.methods.sendNotification(id)

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
    },
    sendNotification: async (id: string) => {
      const suggestion = await hb.db.suggestion.findOneBy({ id: Number(id) })

      await hb.sendMessage(
        suggestion?.channel,
        `@${suggestion?.user?.name} your suggestion with id ${id} has been denied with reason: ${suggestion?.reason}`
      )
    }
  }
}
