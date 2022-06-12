import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/utilities/permission/types'
import { BotResponse } from '../../client/types'

import { TwitchUserState } from '../../client/types'
import { Command } from '../types'

export class JoinCommand implements Command {
  name = 'join'
  description = 'join a channel'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['channel']
  optionalParams = []
  cooldown = 5000
  alias = ['j']

  async execute(
    channel: string,
    user: TwitchUserState,
    [joinChannel]: string[]
  ): Promise<BotResponse> {
    const errorResponse: BotResponse = {
      channel: channel,
      response: '',
      success: false
    }

    if (!joinChannel) {
      errorResponse.response = 'Channel has to be defined'
      return errorResponse
    }

    if (
      joinChannel !== 'me' &&
      user.permission! < GlobalPermissionLevel.ADMIN
    ) {
      errorResponse.response = 'You are not permitted to issue this command'
      return errorResponse
    }

    joinChannel = joinChannel === 'me' ? user.username! : joinChannel

    if (await this.methods.isAlreadyConnected(joinChannel)) {
      errorResponse.response = 'Already connected to that channel'
      return errorResponse
    }

    const { success, message } = await this.methods.connectToChannel(
      joinChannel
    )

    if (success) {
      await this.methods.updateChannelInDb(joinChannel)
    }

    return {
      success: success,
      response: message,
      channel: channel
    }
  }

  methods = {
    isAlreadyConnected: async (channel: string): Promise<number> => {
      return hb.db.channelRepo.countBy({
        joined: true,
        channel: channel
      })
    },

    connectToChannel: async (
      channel: string
    ): Promise<{
      message: string
      success: boolean
    }> => {
      try {
        await hb.client.join(channel)
        return {
          message: 'Successfully joined the channel',
          success: true
        }
      } catch (e: any) {
        return {
          success: false,
          message: e
        }
      }
    },

    updateChannelInDb: async (channel: string) => {
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
  }
}


