import { TwitchUserState } from '../../src/client/types.js'
import { Command } from '../../src/commands/export/types.js'
import { Channel, TwitchUser } from '../../src/db/export-entities.js'
import { Notification } from '../../src/db/export-entities.js'

export function getExampleCommand({
  alias = [],
  cooldown = 500,
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

export const getExampleTwitchUserEntity = ({
  id = 1,
  name = 'user',
  color = '#ffffff',
  permission = 0,
  registered_at = 1,
  display_name = 'user',
  notifications = [],
  suggestions = []
}: Partial<TwitchUser>): TwitchUser => {
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

export const getExampleTwitchUserState = ({
  username = 'user',
  'user-id': userId = '1',
  color = '#FFFFFF',
  'display-name': displayName = 'user',
  permission = 0
}: Partial<TwitchUserState>): TwitchUserState => {
  return {
    username: username,
    'user-id': userId,
    color: color,
    'display-name': displayName,
    permission: permission
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

export const getExampleNotificationEntity = ({
  streamer = 'streamer',
  channel = 'channel',
  live = false,
  offline = false,
  title = false,
  game = false,
  user = getExampleTwitchUserEntity({})
}: Partial<Notification>): Notification => {
  const notification = new Notification()

  notification.channel = channel
  notification.streamer = streamer
  notification.live = live
  notification.title = title
  notification.offline = offline
  notification.user = user
  notification.game = game
  return notification
}
