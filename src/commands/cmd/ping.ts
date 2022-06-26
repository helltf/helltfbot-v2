import { Command } from '../types'
import { BotResponse } from '../../client/types'
import * as os from 'os'
export class PingCommand implements Command {
  name = 'ping'
  description = 'just a ping command'
  permissions = 0
  requiredParams = []
  optionalParams = []
  cooldown = 5000
  alias = []
  async execute(): Promise<BotResponse> {
    const uptime = this.methods.getUptime()
    console.log(hb.utils.humanize(Math.floor(os.uptime() * 1000)))
    return {
      response: `pong | Uptime: ${uptime}`,
      success: true
    }
  }
  methods = {
    getUptime: (): string => {
      const uptime = Math.floor(process.uptime()) * 1000
      return hb.utils.humanize(uptime)
    }
  }
}


