import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/types.js'

export class SuggestCommand implements Command {

  name = 'suggest'
  description = 'suggest a feature you want to see'
  permissions = 0
  requiredParams = []
  optionalParams = []
  cooldown = 30000
  alias = []
  async execute(
    channel: string,
    userstate: ChatUserstate,
    [...suggestion]: string[]
  ): Promise<BotResponse> {
    if (!suggestion[0])
      return {
        response: 'You have to specify a suggestion',
        channel,
        success: false
      }

    const suggestionMessage = suggestion.join(' ')

    const id = await this.methods.saveSuggestion(
      suggestionMessage,
      parseInt(userstate['user-id']!)
    )

    return {
      response: `Succesfully saved your suggestion with id ${id}`,
      channel: channel,
      success: true
    }
  }

  methods = {
    async saveSuggestion(
      suggestion: string,
      user_id: number
    ): Promise<number> {
      return (
        await hb.db.suggestionRepo.save({
          date: Date.now(),
          suggestion,
          user: {
            id: user_id
          }
        })
      ).id
    }
  }
}