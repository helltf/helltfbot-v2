import { Command, CommandContext, CommandFlag } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
export class RemoveSuggestCommand implements Command {
  name = 'rmsuggest'
  description = 'removes your suggestion'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['id']
  optionalParams = []
  cooldown = 30000
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  alias = ['rms']

  async execute({ user, message: [id] }: CommandContext): Promise<BotResponse> {
    const response: BotResponse = {
      success: false,
      response: ''
    }

    if (!id) {
      response.response = 'You need to specify an id to delete your suggestion'
      return response
    }

    if (!parseInt(id)) {
      response.response = `id has to be a number`
      return response
    }

    if (await this.methods.idIsNotValidForUser(user['user-id']!, id)) {
      response.response = `Id ${id} does not exist or the suggestion is created by somebody else`
      return response
    }

    await this.methods.deleteSuggestion(id)

    return {
      response: `Succesfully removed your suggestion with id ${id}`,
      success: true
    }
  }
  methods = {
    async idIsNotValidForUser(
      userId: string,
      suggestionId: string
    ): Promise<boolean> {
      const parsedUserId = parseInt(userId)
      const parsedSuggestionId = parseInt(suggestionId)

      const entity = await hb.db.suggestionRepo.findOne({
        where: {
          id: parsedSuggestionId,
          user: {
            id: parsedUserId
          }
        },
        relations: {
          user: true
        }
      })
      return entity === null
    },

    async deleteSuggestion(suggestionId: string) {
      const parsedSuggestionId = parseInt(suggestionId)

      await hb.db.suggestionRepo.delete({
        id: parsedSuggestionId
      })
    }
  }
}