import { TwitchUserState } from '../../../src/client/types'
import {
  JoinCommand
} from '../../../src/commands/cmd/join'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import {
  getExampleChannel,
  getExampleTwitchUserState
} from '../../test-utils/example'
import { setupDatabase } from '../../test-utils/setup-db'

describe('join command tests', () => {
  let user: TwitchUserState
  let channel: string
  let join: JoinCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    user = getExampleTwitchUserState({ permission: 100 })
    channel = 'channel'
    join = new JoinCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('channel is undefined return error', async () => {
    const message: string[] = []

    const {
      channel: channelResult,
      success,
      response
    } = await join.execute(channel, user, message)

    const expectedResponse = 'Channel has to be defined'

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

    const expectedResponse = 'Channel has to be defined'

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
    const isConnected = await join.methods.isAlreadyConnected(channel)

    expect(isConnected).toBeFalsy()
  })

  it('test isAlreadyConneected client is connected return 1', async () => {
    await saveExampleChannel(channel)
    const isConnected = await join.methods.isAlreadyConnected(channel)

    expect(isConnected).toBeTruthy()
  })

  it('connectToChannel is successful return true', async () => {
    spyOn(hb.client, 'join').and.resolveTo([channel])
    const { success, message } = await join.methods.connectToChannel(channel)

    expect(success).toBeTrue()
    expect(message).toBe('Successfully joined the channel')
  })

  it('connectToChannel is not successful return false', async () => {
    const errorMessage = 'Error'
    spyOn(hb.client, 'join').and.rejectWith(errorMessage)
    const { success, message } = await join.methods.connectToChannel(channel)

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

  it('connect to channel sets joined to true', async () => {
    const channelToJoin = 'joinChannel'
    spyOn(hb.client, 'join').and.resolveTo([channelToJoin])

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: false, channel: channelToJoin })
    )

    await join.execute(channel, user, [channelToJoin])

    const updatedEntity = await hb.db.channelRepo.findOneBy({
      channel: channelToJoin
    })

    expect(updatedEntity!.joined).toBeTruthy()
  })

  it('use me as param join the users channel and save to db', async () => {
    const channelToJoin = 'me'
    const message = [channelToJoin]
    spyOn(hb.client, 'join').and.resolveTo([channelToJoin])

    await join.execute(channel, user, message)

    const savedEntity = await hb.db.channelRepo.findOneBy({
      channel: user.username
    })

    expect(savedEntity).not.toBeNull()
  })

  it('use me as param join the users channel and update it in db', async () => {
    const channelToJoin = 'me'
    const message = [channelToJoin]
    spyOn(hb.client, 'join').and.resolveTo([channelToJoin])

    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: user.username,
        joined: false
      })
    )

    await join.execute(channel, user, message)

    const savedEntity = await hb.db.channelRepo.findOneBy({
      channel: user.username
    })

    expect(savedEntity!.joined).toBeTruthy()
  })

  it('user permissions are not admin return error if joining other channel', async () => {
    const channelToJoin = 'channelToJoin'
    const message = [channelToJoin]

    user.permission = 0

    const { success, response } = await join.execute(channel, user, message)

    expect(success).toBeFalse()
    expect(response).toBe('You are not permitted to issue this command')
  })

  describe('save channel function', () => {
    it('saves new channel if not existing', async () => {
      await join.methods.updateChannelInDb(channel)
      const savedEntitiesLength = await hb.db.channelRepo.count()

      expect(savedEntitiesLength).toBe(1)
    })

    it('updates new channel if not existing', async () => {
      await join.methods.updateChannelInDb(channel)

      const savedEntitiy = await hb.db.channelRepo.findOneBy({
        channel: channel
      })

      expect(savedEntitiy!.joined).toBeTruthy()
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
