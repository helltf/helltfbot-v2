import { TwitchUserState } from '@client/types'
import { RemovemeCommand } from '@commands/cmd/removeme'
import { UserNotificationType } from '@modules/pubsub/types'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import {
  getExampleNotificationEntity,
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '../../test-utils/example'
import { setupDatabase } from '../../test-utils/setup-db'
import { saveNotificationWithUser } from '../../test-utils/save-notification'

describe('test remove command', () => {
  let messageChannel = 'testmessageChannel'
  let streamer = 'streamer'
  let user: TwitchUserState
  let remove: RemovemeCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    messageChannel = 'testmessageChannel'
    streamer = 'streamer'
    remove = new RemovemeCommand()
    user = getExampleTwitchUserState({})

    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('streamer is not defined return error response', async () => {
    const message = ['']

    const {
      response,

      success
    } = await remove.execute({ channel: messageChannel, user, message })

    expect(success).toBe(false)
    expect(response).toBe('No streamer specified')
  })

  it('event is not defined return error response', async () => {
    const message = [streamer, '']

    const {
      response,

      success
    } = await remove.execute({ channel: messageChannel, user, message })

    expect(success).toBe(false)
    expect(response).toBe(
      `Event unknown. Valid events are ${Object.values(
        UserNotificationType
      ).join(' ')}`
    )
  })

  it('event does not match existing events return error response', async () => {
    const message = [streamer, 'a']

    const {
      response,

      success
    } = await remove.execute({ channel: messageChannel, user, message })

    expect(success).toBe(false)
    expect(response).toBe(
      `Event unknown. Valid events are ${Object.values(
        UserNotificationType
      ).join(' ')}`
    )
  })

  it('notification does not exist return error response', async () => {
    const message = [streamer, UserNotificationType.GAME]

    const {
      response,

      success
    } = await remove.execute({ channel: messageChannel, user, message })

    expect(success).toBe(false)

    expect(response).toBe('No matching notification found')
  })

  it('notification existing and updated return success response', async () => {
    const event = UserNotificationType.GAME
    const message = [streamer, event]

    const notification = getExampleNotificationEntity({
      user: getExampleTwitchUserEntity({
        id: Number(user['user-id'])
      }),
      streamer: streamer,
      channel: messageChannel,
      [event]: true
    })

    await saveNotificationWithUser(notification)

    const {
      response,

      success
    } = await remove.execute({ channel: messageChannel, user, message })

    expect(success).toBe(true)

    expect(response).toBe('Successfully removed your notification')
  })

  it('notification exists and game events gets set to false', async () => {
    const event = UserNotificationType.GAME
    const message = [streamer, event]

    const notification = getExampleNotificationEntity({
      user: getExampleTwitchUserEntity({
        id: Number(user['user-id'])
      }),
      streamer: streamer,
      channel: messageChannel,
      [event]: true
    })

    await saveNotificationWithUser(notification)

    await remove.execute({ channel: messageChannel, user, message })

    const updatedEntity = await hb.db.notification.findOneBy({
      user: {
        id: notification.user.id
      },
      streamer: streamer
    })

    expect(updatedEntity![event]).toBe(false)
  })

  describe('remove notification', () => {
    const events: UserNotificationType[] = Object.values(UserNotificationType)

    events.forEach(event => {
      it('tests removing of event', async () => {
        const userEntity = getExampleTwitchUserEntity({
          id: Number(user['user-id'])
        })
        const notification = getExampleNotificationEntity({
          user: userEntity,
          streamer: streamer,
          [event]: true
        })

        await saveNotificationWithUser(notification)

        const { affected } = await remove.methods.removeEventNotification(
          notification.user.id,
          streamer,
          event
        )

        const updatedEntity = await hb.db.notification.findOneBy({
          user: {
            id: notification.user.id
          },
          streamer: streamer
        })

        expect(affected).toBe(1)
        expect(updatedEntity![event]).toBe(false)
      })
    })

    it('notification does not exist no row affected', async () => {
      const notification = getExampleNotificationEntity({})
      const { affected } = await remove.methods.removeEventNotification(
        notification.user.id,
        streamer,
        UserNotificationType.GAME
      )

      expect(affected).toBe(0)
    })
  })
})
