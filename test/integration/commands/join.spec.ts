import 'dotenv/config'
import { ChatUserstate } from 'tmi.js'
import { isAlreadyConnected, join } from '../../../commands/cmd/join.js'
import { getExampleUserState } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('join command tests', () => {
  let user: ChatUserstate
  let channel: string

  beforeAll(async () => {
    user = getExampleUserState()
    channel = 'channel'
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('channel is undefined return error', async () => {
    const message = []

    const {
      channel: channelResult,
      success,
      response
    } = await join.execute(channel, user, message)

    const expectedResponse = 'channel has to bee defined'

    expect(channelResult).toBe(channel)
    expect(success).toBeFalse()
    expect(response).toBe(expectedResponse)
  })

  it('channel is empty string return error', async () => {
    const message = ['']

    const {
      channel: channelResult,
      success,
      response
    } = await join.execute(channel, user, message)

    const expectedResponse = 'channel has to bee defined'

    expect(channelResult).toBe(channel)
    expect(success).toBeFalse()
    expect(response).toBe(expectedResponse)
  })

  it('channel is defined but client is already connected return error response', async () => {
    let message = [channel]

    await hb.db.channelRepo.save({
      allowed: true,
      allowed_live: true,
      channel: channel,
      connect_timestamp: 1,
      joined: true,
      times_connected: 0
    })

    let {
      channel: responseChannel,
      success,
      response
    } = await join.execute(channel, user, message)
    let expectedResponse = 'Already connected to that channel'

    expect(responseChannel).toBe(channel)
    expect(success).toBeFalse()
    expect(response).toBe(expectedResponse)
  })

  it('test isAlreadyConneected is not connected return 0', async () => {
    let isConnected = await isAlreadyConnected(channel)

    expect(isConnected).toBeTrue()
  })
})
