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
    if (!leaveChannel)
      return {
        channel,
        response: 'You need to define a channel',
        success: false
      }
    if (await isNotConnectedToChannel(leaveChannel))
      return {
        channel,
        response: 'Not connected to channel',
        success: false
      }
  }
})

async function isNotConnectedToChannel(channel: string): Promise<boolean> {
  return (
    (await hb.db.channelRepo.countBy({
      channel: channel,
      joined: true
    })) === 0
  )
}
