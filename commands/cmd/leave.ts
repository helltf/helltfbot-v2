import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'
import { Command } from '../export/types.js'

export const leave = new Command({
  name: 'leave',
  description: 'leave a new channel with main client',
  permissions: 100,
  requiredParams: ['channel'],
  optionalParams: [],
  cooldown: 5000,
  alias: [],
  execute: async (
    channel: string,
    user: ChatUserstate,
    [leaveChannel]: string[]
  ): Promise<BotResponse> => {
    return
  }
})
