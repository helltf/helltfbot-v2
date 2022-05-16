import { allow } from '../../../commands/cmd/allow.js'
import { getExampleTwitchUserState } from '../../../spec/examples/user.js'
import { PermissionLevel } from '../../../utilities/twitch/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test allow command', () => {
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
    let message = [allowChannel]
    user.permission = PermissionLevel.BROADCASTER

    let {
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
    let {
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
    let {
      response,
      success,
      channel: responseChannel
    } = await allow.execute(messageChannel, user, [])

    expect(response).toBe('Successfully updated setttngs')

    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeTrue()
  })
})
