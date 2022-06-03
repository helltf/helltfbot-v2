import { Command } from '../types.js'
import { BotResponse } from '../../client/types.js'

export class PingCommand implements Command {
  name = 'ping'
  description = 'just a ping command'
  permissions = 0
  requiredParams = []
  optionalParams = []
  cooldown = 5000
  alias = []
  async execute(channel: string): Promise<BotResponse> {
    return {
      response: 'pong',
      channel: channel,
      success: true
    }
  }
}


