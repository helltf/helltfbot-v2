import { TwitchUserState } from '../../../src/client/types.js'
import { remove, userNotificationIsNotExisting } from '../../../src/commands/cmd/remove.js'
import { UpdateEventType } from '../../../src/modules/pubsub/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleNotificationEntity, getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { Notification } from '../../../src/db/export-entities.js'
import { saveUserStateAsUser } from '../../test-utils/save-user.js'

fdescribe('test remove command', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
  let messageChannel = 'testmessageChannel'
  let streamer = 'streamer'
  let user: TwitchUserState
  let notification: Notification

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    messageChannel = 'testmessageChannel'
    streamer = 'streamer'
    notification = getExampleNotificationEntity({
      streamer: streamer,
      channel: messageChannel
    })
    user = getExampleTwitchUserState({})
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('streamer is not defined return error response', async () => {
    const message = ['']

    const {
      response,
      channel: responseChannel,
      success
    } = await remove.execute(messageChannel, user, message)

    expect(success).toBeFalse()
    expect(response).toBe('No streamer specified')
    expect(responseChannel).toBe(messageChannel)
  })

  it('event is not defined return error response', async () => {
    const message = [streamer, '']

    const {
      response,
      channel: responseChannel,
      success
    } = await remove.execute(messageChannel, user, message)

    expect(success).toBeFalse()
    expect(response).toBe(`Event unknown. Valid events are ${Object.values(UpdateEventType).join(
      ' '
    )}`)
    expect(responseChannel).toBe(messageChannel)

  })


  it('event does not match existing events return error response', async () => {
    const message = [streamer, 'a']

    let {
      response,
      channel: responseChannel,
      success
    } = await remove.execute(messageChannel, user, message)

    expect(success).toBeFalse()
    expect(response).toBe(
      `Event unknown. Valid events are ${Object.values(UpdateEventType).join(
        ' '
      )}`
    )
    expect(responseChannel).toBe(messageChannel)
  })

  it('notification does not exist return error response', async () => {
    const message = [streamer, UpdateEventType.GAME]

    let {
      response,
      channel: responseChannel,
      success
    } = await remove.execute(messageChannel, user, message)

    expect(success).toBeFalse()
    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('No matching notification found')
  })

  describe('user notification not existing', () => {
    it('entity is not existing return true', async () => {
      const userId = Number(user['user-id'])
      const result = await userNotificationIsNotExisting(userId, streamer, UpdateEventType.GAME)

      expect(result).toBeTrue()
    })

    it('entity is existing return false', async () => {
      const userId = notification.user.id
      const event = UpdateEventType.GAME
      notification[event] = true

      await hb.db.userRepo.save(notification.user)

      await hb.db.notificationRepo.save(notification)

      const result = await userNotificationIsNotExisting(userId, streamer, event)

      expect(result).toBeFalse()
    })
  })

  it('notification existing and updated return success response', async () => {
    const event = UpdateEventType.GAME
    const message = [streamer, event]

    await hb.db.userRepo.save(notification.user)

    await hb.db.notificationRepo.save(notification)

    let {
      response,
      channel: responseChannel,
      success
    } = await remove.execute(messageChannel, user, message)


    expect(success).toBeTrue()
    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Successfully removed your notification')
  })

})
