import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/types.js'
export class RemoveSuggestCommand implements Command {
  name = 'rmsuggest'
  description = 'remove your given suggestion'
  permissions = 0
  requiredParams = ['id']
  optionalParams = []
  cooldown = 30000
  alias = ['rms']

  async execute(
    channel: string,
    user: ChatUserstate,
    [id]: string[]
  ): Promise<BotResponse> {
    const response: BotResponse = {
      channel: channel,
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

    if (await this.idIsNotValidForUser(user['user-id']!, id)) {
      response.response = `Id ${id} not existing or the suggestion is created by somebody else`
      return response
    }

    await this.deleteSuggestion(id)

    return {
      response: `Succesfully removed your suggestion with id ${id}`,
      channel: channel,
      success: true
    }
  }


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
  }

  async deleteSuggestion(suggestionId: string) {
    const parsedSuggestionId = parseInt(suggestionId)

    await hb.db.suggestionRepo.delete({
      id: parsedSuggestionId
    })
  }

}