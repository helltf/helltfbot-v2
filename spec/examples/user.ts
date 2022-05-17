import { TwitchUserState } from '../../client/types.js'
import { Notification } from '../../db/export-entities.js'
import { getExampleTwitchUserEntity } from '../../test/test-utils/example.js'

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

export const exampleNotificationEntity: Partial<Notification> = {
  streamer: 'streamer',
  channel: 'channel',
  live: false,
  offline: false,
  title: false,
  game: false,
  user: getExampleTwitchUserEntity({})
}

export const getExampleNotificationEntity = (): Notification => {
  const notification = new Notification()

  const { streamer, channel, live, offline, title, game, user } =
    exampleNotificationEntity

  notification.channel = channel
  notification.game = game
  notification.live = live
  notification.title = title
  notification.offline = offline
  notification.user = user
  notification.streamer = streamer

  return notification
}
