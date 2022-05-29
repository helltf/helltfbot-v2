import { UserNotificationType } from '../../../src/modules/pubsub/types.js'
import { PubSubEventHandler } from '../../../src/modules/pubsub/pubsub-event-handler.js'
import { clearDb } from '../../test-utils/clear.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { Notification } from '../../../src/db/export-entities.js'
import { getExampleNotificationEntity } from '../../test-utils/example.js'

describe('Test event handler to return the correct messages', () => {
  let eventHandler: PubSubEventHandler = new PubSubEventHandler()
  let streamer: string

  beforeEach(async () => {
    streamer = `streamer`
    eventHandler = new PubSubEventHandler()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  beforeAll(async () => {
    await setupDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('get notified user no user existing return empty array', async () => {
    const type = UserNotificationType.LIVE

    const result = await eventHandler.getNotifiedUsers(streamer, type)
    const expectedResult: Notification[] = []

    expect(result).toEqual(expectedResult)
  })

  it('get notified user, user has notification return 1 notification', async () => {
    const type = UserNotificationType.LIVE
    const notification = getExampleNotificationEntity({})
    notification[type] = true

    await hb.db.userRepo.save(notification.user)
    await hb.db.notificationRepo.save(notification)

    const result = await eventHandler.getNotifiedUsers(streamer, type)

    const expectedResult = 1

    expect(result).toHaveSize(expectedResult)
  })

  it('get notified user, 2 users have notifications return 2 notification', async () => {
    const type = UserNotificationType.LIVE
    const notification1 = getExampleNotificationEntity({})
    const notification2 = getExampleNotificationEntity({})
    notification1[type] = true
    notification2[type] = true
    notification2.user!.id = 2
    notification2.channel = 'channel2'

    await saveNotificationWithUser(notification1)
    await saveNotificationWithUser(notification2)
    const result = await eventHandler.getNotifiedUsers(streamer, type)

    const expectedResult = 2

    expect(result).toHaveSize(expectedResult)
  })

  it('get notified user, 2 users have notifications on different events return 1 notification', async () => {
    const type = UserNotificationType.LIVE
    const notification1 = getExampleNotificationEntity({})
    const notification2 = getExampleNotificationEntity({})

    notification1[type] = true
    notification2[UserNotificationType.GAME] = true
    notification2.user!.id = 2
    notification2.channel = 'channel2'

    await saveNotificationWithUser(notification1)
    await saveNotificationWithUser(notification2)

    const result = await eventHandler.getNotifiedUsers(streamer, type)

    const expectedResult = 1

    expect(result).toHaveSize(expectedResult)
  })
})

async function saveNotificationWithUser(notification: Partial<Notification>) {
  await hb.db.userRepo.save(notification.user!)
  await hb.db.notificationRepo.save(notification)
}
