import { Command, CommandContext } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'

export class SuggestCommand implements Command {
  name = 'suggest'
  description = 'suggest a feature you want to see'
  permissions = ChatPermissionLevel.USER
  requiredParams = []
  optionalParams = []
  cooldown = 30000
  alias = []
  flags: string[] = []
  async execute({
    user,
    message: [...suggestion]
  }: CommandContext): Promise<BotResponse> {
    if (!suggestion[0])
      return {
        response: 'You have to specify a suggestion',
        success: false
      }

    const suggestionMessage = suggestion.join(' ')

    const id = await this.methods.saveSuggestion(
      suggestionMessage,
      parseInt(user['user-id']!)
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