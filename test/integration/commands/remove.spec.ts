import { TwitchUserState } from '../../../src/client/types.js'
import { remove } from '../../../src/commands/cmd/remove.js'
import { UpdateEventType } from '../../../src/modules/pubsub/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleNotificationEntity, getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'
import { Notification } from '../../../src/db/export-entities.js'

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
    notification = getExampleNotificationEntity({})
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
    const message = []
  })
})
