import { Command, CommandFlag } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { ResourceError } from '@api/types'
export class PingCommand implements Command {
  flags: CommandFlag[] = [CommandFlag.WHISPER]
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
    const [commandsIssued, joinedChannels, latency, commit] = await Promise.all(
      [
        this.methods.getCommandsIssued(),
        this.methods.getChannels(),
        this.methods.getLatency(),
        this.methods.getCommitInfo()
      ]
    )

    return {
      response: [
        `pong`,
        `Latency: ${latency}ms`,
        `Uptime: ${uptime}`,
        `Memory used: ${memoryUsage}`,
        `Commit: ${commit}`,
        `Commands issued: ${commandsIssued}`,
        `Joined ${joinedChannels} channels`
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
          await hb.db.command
            .createQueryBuilder('commands')
            .select('SUM(commands.counter)', 'sum')
            .getRawOne()
        )?.sum
      )
    },

    getChannels: async (): Promise<number> => {
      return hb.db.channel.countBy({
        joined: true
      })
    },

    getLatency: async (): Promise<number> => {
      return (await hb.client.ping())[0] * 1000
    },

    getCommitInfo: async (): Promise<string> => {
      const [branch, commit, tag] = await Promise.all([
        this.methods.getCurrentBranch(),
        this.methods.getRev(),
        this.methods.getTag()
      ])

      return `${branch}@${commit} ${tag}`
    },

    getCurrentBranch: async (): Promise<string> => {
      const branch = await hb.utils.exec('git branch --show-current')

      if (branch instanceof ResourceError) {
        return 'no-branch'
      }

      return branch.data
    },

    getRev: async (): Promise<string> => {
      const rev = await hb.utils.exec('git rev-parse --short HEAD')

      if (rev instanceof ResourceError) {
        return 'no-rev'
      }

      return rev.data
    },

    getTag: async (): Promise<string> => {
      const tag = await hb.utils.exec('git tag --points-at HEAD')

      if (tag instanceof ResourceError) {
        return 'no-tag'
      }

      return tag.data
    }
  }
}


  