import { Command } from '../../commands/export/types.js'
import { Channel, TwitchUser } from '../../db/export-entities.js'

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

export function getExampleTwitchUserEntity({
  id = 1,
  name = 'user',
  color = '#ffffff',
  permission = 0,
  registered_at = Date.now(),
  display_name = 'user',
  notifications = [],
  suggestions = []
}): TwitchUser {
  const user = new TwitchUser()
  user.id = id
  user.name = name
  user.color = color
  user.permission = permission
  user.display_name = display_name
  user.registered_at = registered_at
  user.notifications = notifications
  user.suggestions = suggestions

  return user
}
