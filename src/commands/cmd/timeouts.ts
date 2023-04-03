import { BotResponse } from "@src/client/types";
import {  CommandContext, CommandFlag } from "@src/commands/types";
import { GlobalPermissionLevel } from "@src/services/permissions.service"
import { BaseCommand } from '../base'

export class TimeoutsCommand extends BaseCommand {
  name = 'timeouts'
  permissions = GlobalPermissionLevel.USER
  description = 'returns latest timeout and amount of tracked timeouts'
  requiredParams = [] as const
  optionalParams = ['user', 'channel'] as const
  alias = ['timeoutcheck', 'timeoutstats', 'tms']
  flags = [CommandFlag.LOWERCASE, CommandFlag.WHISPER]
  cooldown = 30000
  async execute({
    user,
    params: { user: providedUser, channel: providedChannel }
  }: CommandContext<TimeoutsCommand>): Promise<BotResponse> {
    const username = providedUser ?? user.username!

    return this.methods.getTimeoutInfo(username, providedChannel)
  }

  methods = {
    getTimeoutInfo: async (
      username: string,
      channel?: string
    ): Promise<BotResponse> => {
      if (channel)
        return await this.methods.getTimeoutForChannel(username, channel)

      return this.methods.getAllTimeouts(username)
    },

    getAllTimeouts: async (username: string): Promise<BotResponse> => {
      const timeouts = await hb.db.timeout.find({
        where: {
          user: username
        },
        order: {
          at: 'DESC'
        }
      })

      if (!timeouts.length) return this.methods.getNotFoundResponse()

      const [lastTimeout] = timeouts

      const channels = timeouts.reduce(
        (countedChannels: string[], { channel }) => {
          if (!countedChannels.includes(channel)) countedChannels.push(channel)
          return countedChannels
        },
        [] as string[]
      )

      return {
        success: true,
        response: [
          `${username} has been timeouted ${timeouts.length} time(s)`,
          `${channels.length} different channels`,
          `Last timeout ${hb.utils.humanizeNow(lastTimeout.at)} ago in ${
            lastTimeout.channel
          } for ${hb.utils.humanize(lastTimeout.duration)}`
        ]
      }
    },

    getTimeoutForChannel: async (
      username: string,
      channel: string
    ): Promise<BotResponse> => {
      const result = await hb.db.timeout.find({
        where: {
          channel: channel,
          user: username
        },
        order: { at: 'DESC' }
      })

      if (!result.length) return this.methods.getNotFoundResponse()

      const [lastTimeout] = result

      return {
        response: [
          `${username} has been timeouted ${result.length} times in channel ${channel}`,
          `Last timeout: ${hb.utils.humanizeNow(
            lastTimeout.at
          )} ago for ${hb.utils.humanize(lastTimeout.duration)}`
        ],
        success: true
      }
    },

    getNotFoundResponse: (): BotResponse => {
      return {
        response: 'No timeout found',
        success: true
      }
    }
  }
}
