import { Command } from '../types'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/types'

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
        success: false
      }

    const suggestionMessage = suggestion.join(' ')

    const id = await this.methods.saveSuggestion(
      suggestionMessage,
      parseInt(userstate['user-id']!)
    )

    return {
      response: `Succesfully saved your suggestion with id ${id}`,
      success: true
    }
  }

  methods = {
    async saveSuggestion(suggestion: string, user_id: number): Promise<number> {
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