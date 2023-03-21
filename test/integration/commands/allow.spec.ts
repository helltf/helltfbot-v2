import { AllowCommand } from '@commands/cmd/allow'
import { ChatPermissionLevel, GlobalPermissionLevel } from '@src/services/permissions.service'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import {
  getExampleChannel,
  getExampleTwitchUserState
} from '../../test-utils/example'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test allow command', () => {
  let messageChannel = 'messageChannel'
  let user = getExampleTwitchUserState({
    permission: GlobalPermissionLevel.ADMIN
  })
  let allow: AllowCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    messageChannel = 'messageChannel'
    user = getExampleTwitchUserState({
      permission: GlobalPermissionLevel.ADMIN
    })
    allow = new AllowCommand()

    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('user has broadcaster permissions but provides channel return error response', async () => {
    const allowChannel = 'allowChannel'
    user.permission = ChatPermissionLevel.BROADCASTER

    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {
        channel: allowChannel
      }
    })

    expect(response).toBe('You are not permitted to execute this command')

    expect(success).toBe(false)
  })

  it('user has user permissions return error', async () => {
    user.permission = ChatPermissionLevel.USER
    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {
        channel: 'channel'
      }
    })

    expect(response).toBe('You are not permitted to execute this command')

    expect(success).toBe(false)
  })

  it('user has broadcaster permissions but provides no params return successful response', async () => {
    user.permission = ChatPermissionLevel.BROADCASTER

    await hb.db.channel.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )

    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {}
    })

    expect(response).toBe('Successfully updated settings')

    expect(success).toBe(true)
  })

  it('user is admin and provides no params return successfull response', async () => {
    await hb.db.channel.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )
    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {}
    })

    expect(response).toBe('Successfully updated settings')
    expect(success).toBe(true)
  })

  it('user is admin and provides a channel return successfull response', async () => {
    const allowChannel = 'allowChannel'

    await hb.db.channel.save(
      getExampleChannel({
        channel: allowChannel,
        allowed: false
      })
    )

    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {
        channel: allowChannel
      }
    })

    expect(response).toBe('Successfully updated settings')

    expect(success).toBe(true)
  })

  it('given channel param does not exist in database return error response', async () => {
    const allowChannel = 'allowChannel'

    const { response, success } = await allow.execute({
      channel: messageChannel,
      user,
      params: {
        channel: allowChannel
      }
    })

    expect(response).toBe('This channel is not registered')
    expect(success).toBe(false)
  })

  it('no params provided updates users channel in database', async () => {
    await hb.db.channel.save(
      getExampleChannel({
        channel: user.username,
        allowed: false
      })
    )

    await allow.execute({
      channel: messageChannel,
      user,
      params: {}
    })

    const updatedEntity = await hb.db.channel.findOneBy({
      channel: user.username
    })

    expect(updatedEntity!.allowed).toBeTruthy()
  })

  it('params provided updates given channel in database', async () => {
    const allowChannel = 'allowChannel'

    await hb.db.channel.save(
      getExampleChannel({
        channel: allowChannel,
        allowed: false
      })
    )

    await allow.execute({
      channel: messageChannel,
      user,
      params: { channel: allowChannel }
    })

    const updatedEntity = await hb.db.channel.findOneBy({
      channel: allowChannel
    })

    expect(updatedEntity!.allowed).toBeTruthy()
  })
})
