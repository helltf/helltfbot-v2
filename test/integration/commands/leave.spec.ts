import { TwitchUserState } from '../../../src/client/types.js'
import {
  leave,
  leaveChannel,
  updateChannelProperty
} from '../../../src/commands/cmd/leave.js'
import { PermissionLevel } from '../../../src/utilities/twitch/types.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleChannel, getExampleTwitchUserState } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

describe('test leave command', () => {
  let user: TwitchUserState
  let messageChannel: string

  beforeAll(async () => {
    user = getExampleTwitchUserState({
      permission: 100
    })

    messageChannel = 'messageChannel'
    await setupDatabase()
  })

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('no input is given return erorr response', async () => {
    const message = ['']

    const {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('You need to define a channel')
    expect(success).toBeFalse()
  })

  it('client is not connected to channel, channel is not in db return error response', async () => {
    const message = ['leaveChannel']

    const {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Not connected to channel')
    expect(success).toBeFalse()
  })

  it('client is not connected to channel, channel is in db return error response', async () => {
    const leaveChannel = 'leaveChannel'
    const message = [leaveChannel]
    const channelEntity = getExampleChannel({
      joined: false,
      channel: leaveChannel
    })

    await hb.db.channelRepo.save(channelEntity)

    const {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Not connected to channel')
    expect(success).toBeFalse()
  })

  it('client leaves channel return success true', async () => {
    const channelToLeave = 'leaveChannel'
    spyOn(hb.client, 'part').and.resolveTo([channelToLeave])

    const { success, message } = await leaveChannel(channelToLeave)

    expect(success).toBeTrue()
    expect(message).toBe('Successfully left the channel')
  })

  it('error occurs return success false', async () => {
    const channelToLeave = 'leaveChannel'
    spyOn(hb.client, 'part').and.rejectWith('Error')

    const { success, message } = await leaveChannel(channelToLeave)

    expect(success).toBeFalse()
    expect(message).toBe('Could not leave the channel')
  })

  it('client leaves given channel return success response', async () => {
    const channelToLeave = 'leaveChannel'
    const message = [channelToLeave]
    spyOn(hb.client, 'part').and.resolveTo([channelToLeave])

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: true, channel: channelToLeave })
    )

    const {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(success).toBeTrue()
    expect(response).toBe('Successfully left the channel')
  })

  it('client leaves given channel and updates joined to falsee', async () => {
    const channelToLeave = 'leaveChannel'
    const message = [channelToLeave]
    spyOn(hb.client, 'part').and.resolveTo([channelToLeave])

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: true, channel: channelToLeave })
    )

    await leave.execute(messageChannel, user, message)

    const savedEntity = await hb.db.channelRepo.findOneBy({
      channel: channelToLeave
    })

    expect(savedEntity!.joined).toBeFalsy()
  })

  it('update channel property sets joined to false', async () => {
    const channelToLeave = 'leaveChannel'

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: true, channel: channelToLeave })
    )

    await updateChannelProperty(channelToLeave)

    const savedEntity = await hb.db.channelRepo.findOneBy({
      channel: channelToLeave
    })

    expect(savedEntity!.joined).toBeFalsy()
  })

  it('update channel property updates 1 entity not both in database', async () => {
    const channelToLeave = 'leaveChannel'
    const otherChannel = 'otherChannel'

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: true, channel: channelToLeave })
    )

    await hb.db.channelRepo.save(
      getExampleChannel({ joined: true, channel: otherChannel })
    )

    await updateChannelProperty(channelToLeave)

    const updatedEntity = await hb.db.channelRepo.findOneBy({
      channel: channelToLeave
    })

    const otherEntity = await hb.db.channelRepo.findOneBy({
      channel: otherChannel
    })

    expect(updatedEntity!.joined).toBeFalsy()
    expect(otherEntity!.joined).toBeTruthy()
  })

  it('leave channel me sets the channel to joined false', async () => {
    const channelToLeave = 'me'
    const message = [channelToLeave]

    spyOn(hb.client, 'part').and.resolveTo([channelToLeave])

    await hb.db.channelRepo.save(
      getExampleChannel({
        joined: true,
        channel: user.username
      })
    )

    await leave.execute(messageChannel, user, message)

    const updatedEntity = await hb.db.channelRepo.findOneBy({
      channel: user.username
    })
    expect(updatedEntity!.joined).toBeFalsy()
    expect(hb.client.part).toHaveBeenCalledWith(user.username!)
  })

  it('user has no permissions but uses not me as param channel return error', async () => {
    const channelToLeave = 'channelToLeave'

    const message = [channelToLeave]
    user.permission = PermissionLevel.USER
    const response = await leave.execute(messageChannel, user, message)

    expect(response.success).toBeFalse()
    expect(response.response).toBe(
      'You are not permitted to issue this command'
    )
  })
})
