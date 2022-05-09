import { Command } from '../export/types.js'
import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'

const suggest = new Command({
  name: 'suggest',
  description: 'suggest a feature you want to see',
  permissions: 5,
  requiredParams: [],
  optionalParams: [],
  cooldown: 30000,
  execute: async (
    channel: string,
    userstate: ChatUserstate,
    [...suggestion]: string[]
  ): Promise<BotResponse> => {
    if (!suggestion[0])
      return {
        response: 'You have to specify a suggestion',
        channel,
        success: false
      }

    let suggestionMessage = suggestion.join(' ')

    let id = await saveSuggestion(
      suggestionMessage,
      parseInt(userstate['user-id'])
    )

    return {
      response: `Succesfully saved your suggestion with id ${id}`,
      channel: channel,
      success: true
    }
  }
})

async function saveSuggestion(
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
export { suggest }
