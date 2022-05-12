import 'dotenv/config'
import {
  eventIsNotValid,
  notify,
  pubSubConnectedToStreamerEvent,
  updateNotification,
  updateTopicTypeForChannel,
  userNotificationIsExisting,
  userIsAlreadyNotified
} from '../../../commands/cmd/notify.js'
import {
  NotifyEventType,
  UpdateEventType
} from '../../../modules/pubsub/types.js'
import {
  exampleUser,
  getExampleNotificationEntity,
  getTwitchUserEntity
} from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { Notification, TwitchUser } from '../../../db/export-entities.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'

describe('test notify command: ', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  let channel = 'testChannel'
  let streamer = 'streamer'
  let user: TwitchUser
  let notification: Notification

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    channel = 'testChannel'
    streamer = 'streamer'
    notification = getExampleNotificationEntity()
    user = getTwitchUserEntity()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('event is not valid return error', async () => {
    const event = 'unknown'
    const response = await notify.execute(channel, exampleUser, [
      streamer,
      event
    ])

    expect(response.channel).toBe(channel)
    expect(response.success).toBeFalse()
    expect(response.response).toEqual(
      `Event unknown. Valid events are ${Object.values(UpdateEventType).join(
        ' '
      )}`
    )
  })

  it('given streamer does exist in db return false', async () => {
    const result = await pubSubConnectedToStreamerEvent(
      streamer,
      UpdateEventType.GAME
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

    const result = await pubSubConnectedToStreamerEvent(
      streamer,
      UpdateEventType.GAME
    )

    expect(result).toBeFalse()
  })

  it('events from UpdateEventType are valid', () => {
    const events = ['live', 'offline', 'title', 'game']

    for (const event of events) {
      const isNotValid = eventIsNotValid(event)
      expect(isNotValid).toBeFalse()
    }
  })

  it('save new db entry for notification creates new entry in db', async () => {
    const event = UpdateEventType.LIVE
    await hb.db.userRepo.save(user)

    await updateNotification(channel, streamer, event, user.id)

    const result = await findNotification(user.id, streamer)

    expect(result.live).toBeTruthy()
  })

  it('update new db entry for user updates the notification', async () => {
    const event = UpdateEventType.LIVE
    await hb.db.userRepo.save(notification.user)
    await hb.db.notificationRepo.save(notification)

    await updateNotification(channel, streamer, event, notification.user.id)

    const result = await findNotification(notification.user.id, streamer)

    expect(result.live).toBeTruthy()
  })

  it('user has no notification for streamer return false', async () => {
    const id = 1
    const result = await userNotificationIsExisting(id, streamer)

    expect(result).toBeFalse()
  })

  it('user has notification for streamer return true', async () => {
    await hb.db.userRepo.save(notification.user)

    await hb.db.notificationRepo.save(notification)

    const result = await userNotificationIsExisting(
      notification.user.id,
      streamer
    )

    expect(result).toBeTrue()
  })

  it('user is already notified return true', async () => {
    notification.game = true
    await hb.db.userRepo.save(notification.user)
    await hb.db.notificationRepo.save(notification)

    const userIsNotified = await userIsAlreadyNotified(
      notification.user.id,
      notification.streamer,
      UpdateEventType.GAME
    )

    expect(userIsNotified).toBeTrue()
  })

  it('user is not notified return false', async () => {
    const userIsNotified = await userIsAlreadyNotified(
      notification.user.id,
      streamer,
      UpdateEventType.GAME
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

    let isNotified = await userIsAlreadyNotified(
      notification.user.id,
      streamer,
      UpdateEventType.GAME
    )

    expect(isNotified).toBeFalse()
  })

  it('user already has this notification return error response', async () => {
    const event = UpdateEventType.GAME
    const message = [notification.channel, event]
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

  describe('update topic function', () => {
    it('should update status for status type', async () => {
      const id = 1
      await hb.db.notificationChannelRepo.save({
        name: streamer,
        id: id,
        status: false,
        setting: false
      })

      await updateTopicTypeForChannel(streamer, id, NotifyEventType.STATUS)

      const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
        name: streamer
      })

      expect(updatedEntity.status).toBeTruthy()
    })

    it('should update setting for setting type', async () => {
      const id = 1
      await hb.db.notificationChannelRepo.save({
        name: streamer,
        id: id,
        status: false,
        setting: false
      })

      await updateTopicTypeForChannel(streamer, id, NotifyEventType.SETTING)

      const updatedEntity = await hb.db.notificationChannelRepo.findOneBy({
        name: streamer
      })

      expect(updatedEntity.setting).toBeTruthy()
    })
    it('should create new entry if not existing with status type true', async () => {
      const id = 1
      await updateTopicTypeForChannel(streamer, id, NotifyEventType.STATUS)

      const createdEntity = await hb.db.notificationChannelRepo.findOneBy({
        name: streamer
      })

      expect(createdEntity).toBeDefined()
      expect(createdEntity.status).toBeTruthy()
    })
  })
})

async function findNotification(
  userId: number,
  streamer: string
): Promise<Notification> {
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
