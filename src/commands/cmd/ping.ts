import { CommandFlag } from '../types'
import { BotResponse } from '../../client/types'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { ResourceError } from '@api/types'
import { BaseCommand } from '../base'
import { DB } from '@src/db/export-repositories'
import { Client } from 'tmi.js'
import { Utility } from '@src/utilities/utility'

export class PingCommand extends BaseCommand {
  flags: CommandFlag[] = [CommandFlag.WHISPER]
  name = 'ping'
  description = 'just a ping command'
  permissions = ChatPermissionLevel.USER
  requiredParams = [] as const
  optionalParams = [] as const
  cooldown = 5000
  alias = []
  db: DB
  client: Client
  utils: Utility
  constructor(db: DB, client: Client, utils: Utility) {
    super()
    this.db = db
    this.client = client
    this.utils = utils
  }
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
      return this.utils.humanize(uptime)
    },

    getMemory: (): string =>
      this.methods.formatMemoryUsage(process.memoryUsage().heapUsed),
    formatMemoryUsage: (data: number) =>
      `${Math.floor(Math.round((data / 1024 / 1024) * 100) / 100)} MB`,

    getCommandsIssued: async (): Promise<number> => {
      return Number(
        (
          await this.db.command
            .createQueryBuilder('commands')
            .select('SUM(commands.counter)', 'sum')
            .getRawOne()
        )?.sum
      )
    },

    getChannels: async (): Promise<number> => {
      return this.db.channel.countBy({
        joined: true
      })
    },

    getLatency: async (): Promise<number> => {
      return (await this.client.ping())[0] * 1000
    },

    getCommitInfo: async (): Promise<string> => {
      const [branch, commit, tag, commitCount] = await Promise.all([
        this.methods.getCurrentBranch(),
        this.methods.getRev(),
        this.methods.getTag(),
        this.methods.getCommitCount()
      ])

      return `${branch}@${commit} ${tag} with ${commitCount} commits`
    },

    getCurrentBranch: async (): Promise<string> => {
      const branch = await this.utils.exec(
        "git branch | grep \\* | cut -d ' ' -f2"
      )

      if (branch instanceof ResourceError) {
        return 'no-branch'
      }

      return branch.data.trim()
    },

    getRev: async (): Promise<string> => {
      const rev = await this.utils.exec('git rev-parse --short HEAD')

      if (rev instanceof ResourceError) {
        return 'no-rev'
      }

      return rev.data.replace(/\s/gim, '')
    },

    getTag: async (): Promise<string> => {
      const tag = await this.utils.exec('git tag --points-at HEAD')

      if (tag instanceof ResourceError || !tag.data) {
        return 'no-tag'
      }

      return tag.data
    },

    getCommitCount: async (): Promise<string> => {
      const commitCount = await this.utils.exec('git rev-list --count HEAD')

      if (commitCount instanceof ResourceError) {
        return 'no-commit-count'
      }

      return commitCount.data.replace(/\s/gim, '')
    }
  }
}


  
