import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { SuggestionStatus } from '@src/db/entities/suggestion.entity'
import { GlobalPermissionLevel } from "@src/services/permissions.service"
import { BaseCommand } from '../base'

export class AcceptCommand extends BaseCommand {
  name = 'accept'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'Accepts the given suggestion with a reason'
  requiredParams = ['id'] as const
  optionalParams = ['reason'] as const
  alias = ['acceptsuggestion', 'approve']
  flags = [CommandFlag.WHISPER, CommandFlag.APPEND_PARAMS]
  cooldown = 0
  async execute({
    params: { id, reason }
  }: CommandContext<AcceptCommand>): Promise<BotResponse> {
    const success = await this.methods.updateSuggestion(id, reason)

    if (success) {
      await this.methods.createNotificationReminder(id)
      return { success: true, response: 'Updated suggestion' }
    }

    return {
      success: false,
      response: 'suggestion does not exist'
    }
  }
  methods = {
    updateSuggestion: async (
      id: string,
      reason: string | undefined
    ): Promise<boolean> => {
      const result = await hb.db.suggestion.update(
        {
          id: Number(id)
        },
        { status: SuggestionStatus.ACCEPTED, reason: reason }
      )

      return result.affected !== 0
    },
    createNotificationReminder: async (id: string) => {
      const suggestion = (await hb.db.suggestion.findOneBy({ id: Number(id) }))!

      await hb.reminder.createSystemReminder(
        suggestion.user.id,
        `@${suggestion.user.name} your suggestion with id ${id} has been accepted`
      )
    }
  }
}
