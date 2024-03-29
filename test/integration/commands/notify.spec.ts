import {
  NotifyEventType,
  TopicPrefix,
  UserNotificationType
} from '@modules/pubsub/types'
import { NotifyCommand } from '@commands/cmd/notify'
import { TwitchUserEntity, NotificationEntity } from '@db/entities'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleNotificationEntity,
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('test notify command: ', () => {
  let channel = 'testChannel'
  let streamer = 'streamer'
  let user: TwitchUserEntity
  let notification: NotificationEntity
  let notify: NotifyCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    channel = 'testChannel'
    streamer = 'streamer'
    notification = getExampleNotificationEntity({})
    user = getExampleTwitchUserEntity({})
    notify = new NotifyCommand()

    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('event is not valid return error', async () => {
    const event = 'unknown'
    const user = getExampleTwitchUserState({})
    const response = await notify.execute({
      channel,
      user,
      params: {
        streamer,
        event
      }
    })

    expect(response.success).toBe(false)
    expect(response.response).toEqual(
      `Event unknown. Valid events are ${Object.values(
        UserNotificationType
      ).join(' ')}`
    )
  })

  it('user already has this notification return error response', async () => {
    const event = UserNotificationType.GAME
    notification[event] = true

    await hb.db.user.save(notification.user)
    await hb.db.notification.save(notification)

    const { response, success } = await notify.execute({
      channel,
      user: {
        'user-id': `${notification.user.id}`
      },
      params: { streamer, event }
    })

    expect(success).toBe(false)
    expect(response).toBeDefined()
  })

  describe('connected to pubsub', () => {
    it('given streamer does exist in db return false', async () => {
      await hb.db.notificationChannel.save({
        name: streamer,
        id: 1,
        status: false,
        setting: false
      })
      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.GAME
      )

      expect(result).toBe(false)
    })

    it('pubsub is connected to topic return true', async () => {
      await hb.db.notificationChannel.save({
        name: streamer,
        id: 1,
        status: true,
        setting: false
      })

      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.LIVE
      )

      expect(result).toBe(true)
    })

    it('given streamer does not exist in db return true', async () => {
      await hb.db.notificationChannel.save({
        name: streamer,
        id: 1,
        status: true,
        setting: true
      })

      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.GAME
      )

      expect(result).toBe(true)
    })
  })

  describe('update notification', () => {
    it('save new db entry for notification creates new entry in db', async () => {
      const event = UserNotificationType.LIVE
      await hb.db.user.save(user)

      await notify.methods.updateNotification(channel, streamer, event, user.id)

      const result = await findNotification(user.id, streamer)

      expect(result!.live).toBeTruthy()
    })

    it('update new db entry for user updates the notification', async () => {
      const event = UserNotificationType.LIVE
      await hb.db.user.save(notification.user)
      await hb.db.notification.save(notification)

      await notify.methods.updateNotification(
        channel,
        streamer,
        event,
        notification.user.id
      )

      const result = await findNotification(notification.user.id, streamer)

      expect(result!.live).toBeTruthy()
    })
  })

  describe('notification existing', () => {
    it('user has no notification for streamer return false', async () => {
      const id = 1
      const result = await notify.methods.userNotificationIsExisting(
        id,
        streamer
      )

      expect(result).toBe(false)
    })

    it('user has notification for streamer return true', async () => {
      await hb.db.user.save(notification.user)

      await hb.db.notification.save(notification)

      const result = await notify.methods.userNotificationIsExisting(
        notification.user.id,
        streamer
      )

      expect(result).toBe(true)
    })
  })

  describe('is already notified', () => {
    it('user is already notified return true', async () => {
      notification.game = true
      await hb.db.user.save(notification.user)
      await hb.db.notification.save(notification)

      const userIsNotified = await notify.methods.userIsAlreadyNotified(
        notification.user.id,
        notification.streamer,
        UserNotificationType.GAME
      )

      expect(userIsNotified).toBe(true)
    })

    it('user is not notified return false', async () => {
      const userIsNotified = await notify.methods.userIsAlreadyNotified(
        notification.user.id,
        streamer,
        UserNotificationType.GAME
      )

      expect(userIsNotified).toBe(false)
    })
    it('user is notified for other streamer return not notified for this streamer', async () => {
      await hb.db.user.save(user)

      await hb.db.notification.save({
        channel: channel,
        game: true,
        live: true,
        title: true,
        offline: true,
        streamer: 'otherStreamer',
        user: user
      })

      const isNotified = await notify.methods.userIsAlreadyNotified(
        notification.user.id,
        streamer,
        UserNotificationType.GAME
      )

      expect(isNotified).toBe(false)
    })
  })

  describe('update topic function', () => {
    it('should update status for status type', async () => {
      const id = 1
      await hb.db.notificationChannel.save({
        name: streamer,
        id: id,
        status: false,
        setting: false
      })

      await notify.methods.updateTopicTypeForChannel(
        streamer,
        id,
        NotifyEventType.STATUS
      )

      const updatedEntity = await hb.db.notificationChannel.findOneBy({
        name: streamer
      })

      expect(updatedEntity!.status).toBeTruthy()
    })

    it('should update setting for setting type', async () => {
      const id = 1
      await hb.db.notificationChannel.save({
        name: streamer,
        id: id,
        status: false,
        setting: false
      })

      await notify.methods.updateTopicTypeForChannel(
        streamer,
        id,
        NotifyEventType.SETTING
      )

      const updatedEntity = await hb.db.notificationChannel.findOneBy({
        name: streamer
      })

      expect(updatedEntity!.setting).toBeTruthy()
    })
    it('should create new entry if not existing with status type true', async () => {
      const id = 1
      await notify.methods.updateTopicTypeForChannel(
        streamer,
        id,
        NotifyEventType.STATUS
      )

      const createdEntity = await hb.db.notificationChannel.findOneBy({
        name: streamer
      })

      expect(createdEntity).not.toBeNull()
      expect(createdEntity!.status).toBeTruthy()
    })

    it('creating new connection and invoking listen to topic function', async () => {
      const event = UserNotificationType.LIVE
      const userState = getExampleTwitchUserState({})
      const returnedStreamerId = 1
      await hb.db.user.save(user)

      jest
        .spyOn(hb.api.twitch, 'getUserIdByName')
        .mockResolvedValue(returnedStreamerId)
      jest.spyOn(hb.pubSub, 'listenToTopic')

      await notify.execute({
        channel,
        user: userState,
        params: { streamer, event }
      })

      const expectedTopic = {
        id: returnedStreamerId,
        prefix: TopicPrefix.STATUS
      }
      expect(hb.pubSub.listenToTopic).toHaveBeenCalledWith(expectedTopic)
    })
  })
})

async function findNotification(
  userId: number,
  streamer: string
): Promise<NotificationEntity | null> {
  return hb.db.notification.findOne({
    where: {
      user: {
        id: userId
      },
      streamer: streamer
    },
    relations: {
      user: true
    }
  })
}
