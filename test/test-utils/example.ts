import { Command } from '../../src/commands/export/types.js'
import { Channel } from '../../src/db/export-entities.js'

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
}: Partial<Command>): Command {
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

export function getExampleChannel({
  allowed = true,
  allowed_live = true,
  channel = 'channel',
  connect_timestamp = 1,
  times_connected = 0,
  joined = true
}: Partial<Channel>): Partial<Channel> {
  return {
    allowed,
    allowed_live,
    channel,
    connect_timestamp,
    joined,
    times_connected
  }
}
