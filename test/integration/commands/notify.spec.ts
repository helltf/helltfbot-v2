import {
  NotifyEventType,
  TopicPrefix,
  UserNotificationType
} from '../../../src/modules/pubsub/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { NotifyCommand } from '../../../src/commands/cmd/notify.js'
import { TwitchUser } from '../../../src/db/export-entities.js'
import { Notification } from '../../../src/db/export-entities.js'
import {
  getExampleNotificationEntity,
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '../../test-utils/example.js'

describe('test notify command: ', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  let channel = 'testChannel'
  let streamer = 'streamer'
  let user: TwitchUser
  let notification: Notification
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('event is not valid return error', async () => {
    const event = 'unknown'
    const user = getExampleTwitchUserState({})
    const response = await notify.execute(channel, user, [streamer, event])

    expect(response.channel).toBe(channel)
    expect(response.success).toBeFalse()
    expect(response.response).toEqual(
      `Event unknown. Valid events are ${Object.values(
        UserNotificationType
      ).join(' ')}`
    )
  })

  it('user already has this notification return error response', async () => {
    const event = UserNotificationType.GAME
    const message = [notification.streamer, event]
    notification[event] = true

    await hb.db.userRepo.save(notification.user)
    await hb.db.notificationRepo.save(notification)

    const {
      response,
      success,
      channel: responseChannel
    } = await notify.execute(
      channel,
      { 'user-id': `${notification.user.id}` },
      message
    )

    expect(success).toBeFalse()
    expect(response).toBeDefined()
    expect(responseChannel).toBe(channel)
  })

  describe('connected to pubsub', () => {
    it('given streamer does exist in db return false', async () => {
      await hb.db.notificationChannelRepo.save({
        name: streamer,
        id: 1,
        status: false,
        setting: false
      })
      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.GAME
      )

      expect(result).toBeFalse()
    })

    it('pubsub is connected to topic return true', async () => {
      await hb.db.notificationChannelRepo.save({
        name: streamer,
        id: 1,
        status: true,
        setting: false
      })

      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.LIVE
      )

      expect(result).toBeTrue()
    })

    it('given streamer does not exist in db return true', async () => {
      await hb.db.notificationChannelRepo.save({
        name: streamer,
        id: 1,
        status: true,
        setting: true
      })

      const result = await notify.methods.pubSubConnectedToStreamerEvent(
        streamer,
        UserNotificationType.GAME
      )

      expect(result).toBeTrue()
    })
  })

  describe('update notification', () => {
    it('save new db entry for notification creates new entry in db', async () => {
      const event = UserNotificationType.LIVE
      await hb.db.userRepo.save(user)

      await notify.methods.updateNotification(channel, streamer, event, user.id)

      const result = await findNotification(user.id, streamer)

      expect(result!.live).toBeTruthy()
    })

    it('update new db entry for user updates the notification', async () => {
      const event = UserNotificationType.LIVE
      await hb.db.userRepo.save(notification.user)
      await hb.db.notificationRepo.save(notification)

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

      expect(result).toBeFalse()
    })

    it('user has notification for streamer return true', async () => {
      await hb.db.userRepo.save(notification.user)

      await hb.db.notificationRepo.save(notification)

      const result = await notify.methods.userNotificationIsExisting(
        notification.user.id,
        streamer
      )

      expect(result).toBeTrue()
    })
  })

  describe('is already notified', () => {
    it('user is already notified return true', async () => {
      notification.game = true
      await hb.db.userRepo.save(notification.user)
      await hb.db.notificationRepo.save(notification)

      const userIsNotified = await notify.methods.userIsAlreadyNotified(
        notification.user.id,
        notification.streamer,
        UserNotificationType.GAME
      )

      expect(userIsNotified).toBeTrue()
    })

    it('user is not notified return false', async () => {
      const userIsNotified = await notify.methods.userIsAlreadyNotified(
        notification.user.id,
        streamer,
        UserNotificationType.GAME
      )

      expect(userIsNotified).toBeFalse()
    })
    it('user is notified for other streamer return not notified for this streamer', async () => {
      await hb.db.userRepo.save(user)

      await hb.db.notificationRepo.save({
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

      expect(isNotified).toBeFalse()
    })
  })

  describe('update topic function', () => {
    it('should update status for status type', async () => {
      const id = 1
      await hb.db.notificationChannelRepo.save({
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

      const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
        name: streamer
      })

      expect(updatedEntity!.status).toBeTruthy()
    })

    it('should update setting for setting type', async () => {
      const id = 1
      await hb.db.notificationChannelRepo.save({
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

      const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
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

      const createdEntity = await hb.db.notificationChannelRepo.findOneBy({
        name: streamer
      })

      expect(createdEntity).not.toBeNull()
      expect(createdEntity!.status).toBeTruthy()
    })

    it('creating new connection and invoking listen to topic function', async () => {
      const message = [streamer, UserNotificationType.LIVE]
      const userState = getExampleTwitchUserState({})
      const returnedStreamerId = 1
      await hb.db.userRepo.save(user)

      spyOn(hb.api.twitch, 'getUserIdByName').and.resolveTo(returnedStreamerId)
      spyOn(hb.pubSub, 'listenToTopic')

      await notify.execute(channel, userState, message)

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
): Promise<Notification | null> {
  return hb.db.notificationRepo.findOne({
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
