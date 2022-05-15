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
  alias: ['l'],
  execute: async (
    channel: string,
    user: ChatUserstate,
    [channeltoLeave]: string[]
  ): Promise<BotResponse> => {
    const errorMessage: BotResponse = { channel, success: false, response: '' }
    if (!channeltoLeave) {
      errorMessage.response = 'You need to define a channel'
      return errorMessage
    }

    if (await isNotConnectedToChannel(channeltoLeave)) {
      errorMessage.response = 'Not connected to channel'
      return errorMessage
    }
    const { success, message } = await leaveChannel(channeltoLeave)

    if (success) await updateChannelProperty(channeltoLeave)
    return {
      success,
      response: message,
      channel: channel
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

export async function updateChannelProperty(channel: string) {
  await hb.db.channelRepo.update(
    {
      channel: channel
    },
    {
      joined: false
    }
  )
}

export async function leaveChannel(channel: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    await hb.client.join(channel)
    return {
      success: true,
      message: 'Successfully left the channel'
    }
  } catch (e) {
    return {
      success: false,
      message: 'Could not join the channel'
    }
  }
}
