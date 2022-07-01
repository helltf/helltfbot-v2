import { Command } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
export class PingCommand implements Command {
  flags: string[] = []
  name = 'ping'
  description = 'just a ping command'
  permissions = ChatPermissionLevel.USER
  requiredParams = []
  optionalParams = []
  cooldown = 5000
  alias = []
  async execute(): Promise<BotResponse> {
    const uptime = this.methods.getUptime()
    const memoryUsage = this.methods.getMemory()
    const [commandsIssued, joinedChannels, latency] = await Promise.all([
      this.methods.getCommandsIssued(),
      this.methods.getChannels(),
      this.methods.getLatency()
    ])

    return {
      response: [
        `pong`,
        `Latency: ${latency}ms`,
        `Uptime: ${uptime}`,
        `Memory used: ${memoryUsage}`,
        `Commands issued: ${commandsIssued}`,
        `Connected to ${joinedChannels} channels`
      ],
      success: true
    }
  }

  methods = {
    getUptime: (): string => {
      const uptime = Math.floor(process.uptime()) * 1000
      return hb.utils.humanize(uptime)
    },

    getMemory: (): string =>
      this.methods.formatMemoryUsage(process.memoryUsage().heapUsed),
    formatMemoryUsage: (data: number) =>
      `${Math.floor(Math.round((data / 1024 / 1024) * 100) / 100)} MB`,

    getCommandsIssued: async (): Promise<number> => {
      return Number(
        (
          await hb.db.commandRepo
            .createQueryBuilder('commands')
            .select('SUM(commands.counter)', 'sum')
            .getRawOne()
        )?.sum
      )
    },

    getChannels: async (): Promise<number> => {
      return hb.db.channelRepo.countBy({
        joined: true
      })
    },

    getLatency: async (): Promise<number> => {
      return (await hb.client.ping())[0] * 1000
    }
  }
}


