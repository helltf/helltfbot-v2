import { getExampleTwitchUserState } from '../../../spec/examples/user.js'
import { allow } from '../../../src/commands/cmd/allow.js'
import { PermissionLevel } from '../../../src/utilities/twitch/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleChannel } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('test allow command', () => {
  let messageChannel = 'messageChannel'
  let user = getExampleTwitchUserState({
    permission: PermissionLevel.ADMIN
  })

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    messageChannel = 'messageChannel'
    user = getExampleTwitchUserState({
      permission: PermissionLevel.ADMIN
    })
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('user has broadcaster permissions but provides channel return error response', async () => {
    const allowChannel = 'allowChannel'
    const message = [allowChannel]
    user.permission = PermissionLevel.BROADCASTER

    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, message)

    expect(response).toBe('You are not permitted to execute this command')
    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeFalse()
  })

  it('user has user permissions return error', async () => {
    user.permission = PermissionLevel.USER
    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, [])

    expect(response).toBe('You are not permitted to execute this command')
    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeFalse()
  })

  it('user has broadcaster permissions but provides no params return successfull resoponse', async () => {
    user.permission = PermissionLevel.BROADCASTER

    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )

    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, [])

    expect(response).toBe('Successfully updated setttngs')
    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeTrue()
  })

  it('user is admin and provides no params return successfull response', async () => {
    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )
    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, [])

    expect(response).toBe('Successfully updated setttngs')
    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeTrue()
  })

  it('user is admin and provides a channel return successfull response', async () => {
    const allowChannel = 'allowChannel'
    const message = [allowChannel]

    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: allowChannel,
        allowed: false
      })
    )

    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, message)

    expect(response).toBe('Successfully updated setttngs')
    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeTrue()
  })

  it('given channel param does not exist in database return error response', async () => {
    const allowChannel = 'allowChannel'
    const message = [allowChannel]

    const {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, message)

    expect(response).toBe('This channel is not registered')
    expect(success).toBeFalse()
    expect(responseChannel).toBe(messageChannel)
  })

  it('no params provided updates users channel in database', async () => {
    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )

    await allow.execute(messageChannel, user, [])

    const updatedEntity = await hb.db.channelRepo.findOneBy({
      channel: user.username
    })

    expect(updatedEntity.allowed).toBeTruthy()
  })

  it('params provided updates given channel in database', async () => {
    const allowChannel = 'allowChannel'
    const message = [allowChannel]

    await hb.db.channelRepo.save(
      getExampleChannel({
        channel: allowChannel,
        allowed: false
      })
    )

    await allow.execute(messageChannel, user, message)

    const updatedEntity = await hb.db.channelRepo.findOneBy({
      channel: allowChannel
    })

    expect(updatedEntity.allowed).toBeTruthy()
  })
})
