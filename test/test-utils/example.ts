import { BotResponse } from '../../client/response.js'
import { Command } from '../../commands/export/types.js'

export function getExampleCommand({
  alias = [],
  cooldown = 1,
  description = '',
  execute = async () => {
    return { channel: 'channel', response: '', success: true }
  },
  name = 'name',
  optionalParams = [],
  requiredParams = [],
  permissions = 0
}: ExampleCommand): Command {
  return {
    alias,
    cooldown,
    description,
    execute,
    name,
    optionalParams,
    permissions,
    requiredParams
  }
}

interface ExampleCommand {
  alias?: string[]
  cooldown?: number
  description?: string
  execute?: () => Promise<BotResponse>
  name?: string
  optionalParams?: string[]
  permissions?: number
  requiredParams?: string[]
}
