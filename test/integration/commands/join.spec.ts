import 'dotenv/config'
import { ChatUserstate } from 'tmi.js'
import {
  connectToChannel,
  isAlreadyConnected,
  join,
  updateChannelInDb
} from '../../../commands/cmd/join.js'
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
    const joinChannel = 'joinChannel'
    const message = [joinChannel]
    await saveExampleChannel(joinChannel)

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
    const { success, message } = await connectToChannel(channel)

    expect(success).toBeTrue()
    expect(message).toBe('Successfully joined the channel')
  })

  it('connectToChannel is not successful return false', async () => {
    const errorMessage = 'Error'
    spyOn(hb.client, 'join').and.rejectWith(errorMessage)
    const { success, message } = await connectToChannel(channel)

    expect(success).toBeFalse()
    expect(message).toBe(errorMessage)
  })

  it('connnect to channel is successful return success response', async () => {
    const joinChannel = 'joinChannel'
    const message = [joinChannel]

    spyOn(hb.client, 'join').and.resolveTo([joinChannel])

    const {
      response,
      channel: responseChannel,
      success
    } = await join.execute(channel, user, message)

    expect(success).toBeTrue()
    expect(response).toBeDefined()
    expect(responseChannel).toBe(channel)
  })

  it('connect to channel is succesful saves channel', async () => {
    const joinChannel = 'joinChannel'
    const message = [joinChannel]

    spyOn(hb.client, 'join').and.resolveTo([joinChannel])

    await join.execute(channel, user, message)

    const savedChannel = await hb.db.channelRepo.findOneBy({
      channel: joinChannel
    })

    expect(savedChannel).not.toBeNull()
  })

  it('connnect to channel fails return error response', async () => {
    const error = ''
    const joinChannel = 'joinChannel'
    const message = [joinChannel]
    spyOn(hb.client, 'join').and.rejectWith(error)

    const {
      response,
      channel: responseChannel,
      success
    } = await join.execute(channel, user, message)

    expect(success).toBeFalse()
    expect(response).toBeDefined()
    expect(responseChannel).toBe(channel)
  })

  describe('save channel function', () => {
    it('saves new channel if not existing', async () => {
      await updateChannelInDb(channel)
      const savedEntitiesLength = await hb.db.channelRepo.count()

      expect(savedEntitiesLength).toBe(1)
    })

    it('updates new channel if not existing', async () => {
      await updateChannelInDb(channel)

      const savedEntitiy = await hb.db.channelRepo.findOneBy({
        channel: channel
      })

      expect(savedEntitiy.joined).toBeTruthy()
    })
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