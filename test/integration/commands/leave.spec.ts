import { ChatUserstate } from 'tmi.js'
import { leave } from '../../../commands/cmd/leave.js'
import { getExampleUserState } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test leave command', () => {
  let user: ChatUserstate
  let messageChannel: string

  beforeAll(async () => {
    user = getExampleUserState()
    messageChannel = 'messageChannel'
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('no input is given return erorr response', async () => {
    let message = []

    let {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('You need to define a channel')
    expect(success).toBeFalse()
  })
})
