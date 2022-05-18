import { TwitchUserState } from '../../../client/types.js'
import { remove } from '../../../commands/cmd/remove.js'
import { Notification } from '../../../db/export-entities.js'
import { UpdateEventType } from '../../../modules/pubsub/types.js'
import {
  getExampleNotificationEntity,
  getExampleTwitchUserState
} from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test notify command', () => {
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
    notification = getExampleNotificationEntity()
    user = getExampleTwitchUserState({})
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
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
})
