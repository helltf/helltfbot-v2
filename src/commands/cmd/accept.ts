import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { SuggestionStatus } from '@src/db/entities/suggestion.entity'
import { DB } from '@src/db/export-repositories'
import { ReminderService } from '@src/services/reminder.service'
import { GlobalPermissionLevel } from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
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

  constructor(deps: CommandDependencies) {
    super(deps)
  }

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
      const result = await this.db.suggestion.update(
        {
          id: Number(id)
        },
        { status: SuggestionStatus.ACCEPTED, reason: reason }
      )

      return result.affected !== 0
    },
    createNotificationReminder: async (id: string) => {
      const suggestion = (await this.db.suggestion.findOneBy({
        id: Number(id)
      }))!

      await this.reminder.createSystemReminder(
        suggestion.user.id,
        `@${suggestion.user.name} your suggestion with id ${id} has been accepted`
      )
    }
  }
}
