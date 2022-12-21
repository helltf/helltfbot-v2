import { TwitchUserState } from '@client/types'
import { Command } from '@commands/types'
import {
  TwitchUserEntity,
  NotificationEntity,
  ChannelEntity,
  NotificationChannelEntity,
  EmoteStatsEntity,
  ColorHistoryEntity,
  ReminderEntity,
  BanEntity
} from '@db/entities'
import { BaseCommand } from '@src/commands/base'
import { ReminderStatus, ReminderType } from '@src/db/entities/reminder.entity'
import {
  ChatPermissionLevel,
  GlobalPermissionLevel
} from '@src/utilities/permission/types'

export function getExampleCommand({
  alias = [],
  cooldown = 500,
  description = '',
  execute = async () => {
    return {
      channel: 'channel',
      response: '',
      success: true
    }
  },
  name = 'name',
  optionalParams = [],
  requiredParams = [],
  permissions = ChatPermissionLevel.USER,
  flags = []
}: Partial<Command>): BaseCommand {
  return {
    alias,
    cooldown,
    description,
    execute,
    name,
    optionalParams,
    permissions,
    requiredParams,
    flags
  } as BaseCommand
}

export const getExampleEmoteStatsEntity = ({
  emotes_guessed = 0,
  incorrect_guesses = 0,
  letters_guessed = 0,
  user = new TwitchUserEntity()
}: Partial<EmoteStatsEntity>): EmoteStatsEntity => {
  const entity = new EmoteStatsEntity()

  entity.emotes_guessed = emotes_guessed
  entity.incorrect_guesses = incorrect_guesses
  entity.letters_guessed = letters_guessed
  entity.user = user

  return entity
}

export const getExampleTwitchUserEntity = ({
  id = 1,
  name = 'user',
  color = '#ffffff',
  permission = 0,
  registered_at = 1,
  display_name = 'user',
  notifications = [],
  suggestions = [],
  emotegameStats = new EmoteStatsEntity(),
  colors = new ColorHistoryEntity()
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
  user.emotegameStats = emotegameStats
  user.colors = colors

  return user
}

export const getExampleTwitchUserState = ({
  username = 'user',
  'user-id': userId = '1',
  color = '#FFFFFF',
  'display-name': displayName = 'user',
  permission = GlobalPermissionLevel.USER,
  badges = {}
}: Partial<TwitchUserState>): TwitchUserState => {
  return {
    username: username,
    'user-id': userId,
    color: color,
    'display-name': displayName,
    permission: permission,
    badges: badges
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

export const getExampleReminderEntity = ({
  id = 1,
  creator = getExampleTwitchUserEntity({ id: 1 }),
  reciever = getExampleTwitchUserEntity({ id: 2 }),
  message = 'message',
  createdAt = Date.now(),
  firedAt = null,
  firedChannel = null,
  createdChannel = 'channel',
  status = ReminderStatus.CREATED,
  type = ReminderType.USER
}: Partial<ReminderEntity>): ReminderEntity => {
  const reminder = new ReminderEntity()

  reminder.id = id
  reminder.creator = creator
  reminder.reciever = reciever
  reminder.message = message
  reminder.createdAt = createdAt
  reminder.firedAt = firedAt
  reminder.firedChannel = firedChannel
  reminder.status = status
  reminder.createdChannel = createdChannel
  reminder.type = type

  return reminder
}

export const getExampleBanEntity = ({
  id = 1,
  at = Date.now(),
  user = 'user',
  channel = 'channel'
}: Partial<BanEntity>): BanEntity => {
  const ban = new BanEntity()

  ban.id = id
  ban.at = at
  ban.user = user
  ban.channel = channel

  return ban
}
