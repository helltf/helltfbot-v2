import { Command } from '../export/types.js'
import { BotResponse } from '../../client/response.js'

const ping = new Command({
  name: 'ping',
  description: 'just a ping command',
  permissions: 0,
  requiredParams: [],
  optionalParams: [],
  cooldown: 5000,
  alias: [],
  execute: async (channel: string): Promise<BotResponse> => {
    return {
      response: 'pong',
      channel: channel,
      success: true
    }
  }
})

export { ping }
