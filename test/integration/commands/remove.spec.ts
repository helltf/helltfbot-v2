import { Notification, TwitchUser } from '../../../db/export-entities.js'
import { getExampleNotificationEntity } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleTwitchUserEntity } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('test notify command', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
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
    user = getExampleTwitchUserEntity({})
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })
  it('', () => {})
})
