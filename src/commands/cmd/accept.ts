import { BotResponse } from "@src/client/types";
import { Command, CommandContext, CommandFlag } from "@src/commands/types";
import { SuggestionStatus } from "@src/db/entities/suggestion.entity";
import { GlobalPermissionLevel } from '@src/utilities/permission/types'

export class AcceptCommand implements Command {
  name = 'accept'
  permissions = GlobalPermissionLevel.ADMIN
  description = 'Accepts the given suggestion with a reason'
  requiredParams = ['id']
  optionalParams = ['reason']
  alias = ['acceptsuggestion', 'approve']
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

    if (success) {
      this.methods.sendNotification(id)
      return { success: true, response: 'Updated suggestion' }
    }

    return {
      success: false,
      response: 'suggestion does not exist'
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
    },
    sendNotification: async (id: string) => {
      const suggestion = await hb.db.suggestion.findOneBy({ id: Number(id) })

      await hb.sendMessage(
        suggestion?.channel,
        `@${suggestion?.user.name} your suggestion with id ${id} has been accepted`
      )
    }
  }
}
