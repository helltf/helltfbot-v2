import { ChatUserstate } from 'tmi.js'
import { BotResponse } from '../../client/response.js'
import { Command } from '../export/types.js'

export const join = new Command({
  name: 'join',
  description: 'join a new channel with main client',
  permissions: 100,
  requiredParams: ['channel'],
  optionalParams: [],
  cooldown: 5000,
  alias: ['j'],
  execute: async (
    channel: string,
    user: ChatUserstate,
    [joinChannel]: string[]
  ): Promise<BotResponse> => {
    joinChannel = joinChannel === 'me' ? user['display-name'] : joinChannel

    const errorResponse: BotResponse = {
      channel: channel,
      response: '',
      success: false
    }

    if (!joinChannel) {
      errorResponse.response = 'channel has to be defined'
      return errorResponse
    }

    if (await isAlreadyConnected(joinChannel)) {
      errorResponse.response = 'Already connected to that channel'
      return errorResponse
    }

    const { success, message } = await connectToChannel(joinChannel)

    if (success) {
      await updateChannelInDb(joinChannel)
    }

    return {
      success: success,
      response: message,
      channel: channel
    }
  }
})

export async function connectToChannel(channel: string): Promise<{
  message?: string
  success: boolean
}> {
  try {
    await hb.client.join(channel)
    return {
      message: 'Successfully joined the channel',
      success: true
    }
  } catch (e) {
    return {
      success: false,
      message: e
    }
  }
}

export async function isAlreadyConnected(channel: string): Promise<number> {
  return hb.db.channelRepo.countBy({
    joined: true,
    channel: channel
  })
}

export const updateChannelInDb = async (channel: string) => {
  const channelExsisting = await hb.db.channelRepo.countBy({
    channel: channel
  })

  if (channelExsisting) {
    return await hb.db.channelRepo.update(
      {
        channel: channel
      },
      {
        joined: true
      }
    )
  }
  return await hb.db.channelRepo.save({
    channel: channel,
    allowed: true,
    allowed_live: true,
    connect_timestamp: Date.now(),
    times_connected: 1,
    joined: true
  })
}
