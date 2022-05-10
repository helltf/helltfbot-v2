import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'
import { Command } from '../export/types.js'

export const join = new Command({
  name: 'join',
  description: 'join a new channel with main client',
  permissions: 5,
  requiredParams: ['channel'],
  optionalParams: [],
  cooldown: 5000,
  execute: async (
    channel: string,
    user: ChatUserstate,
    [joinChannel]: string[]
  ): Promise<BotResponse> => {
    if (!joinChannel)
      return {
        success: false,
        channel: channel,
        response: 'channel has to be defined'
      }

    if (await isAlreadyConnected(channel)) return

    const success = await connectToChannel(channel)
  }
})

async function connectToChannel(channel: string): Promise<boolean> {
  try {
    await hb.client.join(channel)
    return true
  } catch (e) {
    return false
  }
}

async function isAlreadyConnected(channel: string) {
  return hb.db.channelRepo.countBy({
    joined: true,
    channel: channel
  })
}
