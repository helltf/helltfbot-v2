import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/utilities/permission/types'
import { CommandDependencies } from 'deps'
import { BotResponse } from '../../client/types'
import { BaseCommand } from '../base'
import { CommandContext, CommandFlag } from '../types'

export class JoinCommand extends BaseCommand {
  name = 'join'
  description = 'join a channel'
  permissions = ChatPermissionLevel.USER
  requiredParams = ['channel'] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = ['j']
  flags: CommandFlag[] = [CommandFlag.WHISPER]

  constructor(deps: CommandDependencies) {
    super(deps)
  }

  async execute({
    user,
    params: { channel: joinChannel }
  }: CommandContext<JoinCommand>): Promise<BotResponse> {
    const errorResponse: BotResponse = {
      response: '',
      success: false
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
      response: message
    }
  }

  methods = {
    isAlreadyConnected: async (channel: string): Promise<number> => {
      return hb.db.channel.countBy({
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
      const channelExsisting = await hb.db.channel.countBy({
        channel: channel
      })

      if (channelExsisting) {
        return await hb.db.channel.update(
          {
            channel: channel
          },
          {
            joined: true
          }
        )
      }
      return await hb.db.channel.save({
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
