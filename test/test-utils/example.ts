import ReconnectingWebSocket from 'reconnecting-websocket'
import { TwitchUserState } from '@client/types'
import { Command } from '@commands/types'
import {
  TwitchUserEntity,
  NotificationEntity,
  ChannelEntity,
  NotificationChannelEntity
} from '@db/entities'

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
}: Partial<TwitchUserEntity>): TwitchUserEntity => {
  const user = new TwitchUserEntity()

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
  permission = 0,
  badges = {}
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
}: Partial<ChannelEntity>): Partial<ChannelEntity> {
  return {
    allowed,
    allowed_live,
    channel,
    connect_timestamp,
    joined,
    times_connected
  }
}

export const getExampleNotificationChannelEntity = ({
  id = 1,
  name = 'notificationChannel',
  setting = false,
  status = false
}: Partial<NotificationChannelEntity>): NotificationChannelEntity => {
  const notificationChannel = new NotificationChannelEntity()

  notificationChannel.id = id
  notificationChannel.name = name
  notificationChannel.setting = setting
  notificationChannel.status = status

  return notificationChannel
}

export const getExampleNotificationEntity = ({
  streamer = 'streamer',
  channel = 'channel',
  live = false,
  offline = false,
  title = false,
  game = false,
  user = getExampleTwitchUserEntity({})
}: Partial<NotificationEntity>): NotificationEntity => {
  const notification = new NotificationEntity()

  notification.channel = channel
  notification.streamer = streamer
  notification.live = live
  notification.title = title
  notification.offline = offline
  notification.user = user
  notification.game = game
  return notification
}

export const createMockedWSConnection = (): ReconnectingWebSocket => {
  return jasmine.createSpyObj({
    addEventListener: () => {
      return {}
    },
    send: () => {
      return {}
    },
    reconnect: () => {
      return {}
    }
  })
}