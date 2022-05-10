import 'dotenv/config'
import { ChatUserstate } from 'tmi.js'
import {
  connectToChannel,
  isAlreadyConnected,
  join
} from '../../../commands/cmd/join.js'
import { getExampleUserState } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('join command tests', () => {
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

    const expectedResponse = 'channel has to be defined'

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

    const expectedResponse = 'channel has to be defined'

    expect(channelResult).toBe(channel)
    expect(success).toBeFalse()
    expect(response).toBe(expectedResponse)
  })

  it('channel is defined but client is already connected return error response', async () => {
    const message = [channel]

    await saveExampleChannel(channel)

    const {
      channel: responseChannel,
      success,
      response
    } = await join.execute(channel, user, message)
    const expectedResponse = 'Already connected to that channel'

    expect(responseChannel).toBe(channel)
    expect(success).toBeFalse()
    expect(response).toBe(expectedResponse)
  })

  it('test isAlreadyConneected client is not connected return 0', async () => {
    const isConnected = await isAlreadyConnected(channel)

    expect(isConnected).toBeFalsy()
  })
  it('test isAlreadyConneected client is connected return 1', async () => {
    await saveExampleChannel(channel)
    const isConnected = await isAlreadyConnected(channel)

    expect(isConnected).toBeTruthy()
  })

  it('connectToChannel is successful return true', async () => {
    spyOn(hb.client, 'join').and.resolveTo([channel])
    let { success, message } = await connectToChannel(channel)

    expect(success).toBeTrue()
    expect(message).toBe('Succesfully join the channel')
  })

  it('connectToChannel is not successful return false', async () => {
    let errorMessage = 'Error'
    spyOn(hb.client, 'join').and.rejectWith(errorMessage)
    let { success, message } = await connectToChannel(channel)

    expect(success).toBeFalse()
    expect(message).toBe(errorMessage)
  })
})

async function saveExampleChannel(channelName: string) {
  await hb.db.channelRepo.save({
    allowed: true,
    allowed_live: true,
    channel: channelName,
    connect_timestamp: 1,
    joined: true,
    times_connected: 0
  })
}
