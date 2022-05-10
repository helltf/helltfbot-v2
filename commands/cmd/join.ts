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
    const errorResponse: BotResponse = {
      channel: channel,
      response: '',
      success: false
    }

    if (!joinChannel) {
      errorResponse.response = 'channel has to be defined'
      return errorResponse
    }

    if (await isAlreadyConnected(channel)) {
      errorResponse.response = 'Already connected to that channel'
      return errorResponse
    }

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

export async function isAlreadyConnected(channel: string): Promise<number> {
  return hb.db.channelRepo.countBy({
    joined: true,
    channel: channel
  })
}
