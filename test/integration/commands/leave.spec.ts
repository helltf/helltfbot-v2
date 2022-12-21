import { TwitchUserState } from '@client/types'
import {
  LeaveCommand
} from '@commands/cmd/leave'
import { ChatPermissionLevel } from '@src/utilities/permission/types'
import { clearDb } from '../../test-utils/clear'
import { disconnectDatabase } from '../../test-utils/disconnect'
import {
  getExampleChannel,
  getExampleTwitchUserState
} from '../../test-utils/example'
import { setupDatabase } from '../../test-utils/setup-db'

describe('test leave command', () => {
  let user: TwitchUserState
  let messageChannel: string
  let leave: LeaveCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    user = getExampleTwitchUserState({
      permission: 100
    })

    messageChannel = 'messageChannel'
    leave = new LeaveCommand()

    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('client is not connected to channel, channel is not in db return error response', async () => {
    const leaveChannel = 'leaveChannel'

    const { response, success } = await leave.execute({
      channel: messageChannel,
      user,
      params: { channel: leaveChannel }
    })

    expect(response).toBe('Not connected to channel')
    expect(success).toBe(false)
  })

  it('client is not connected to channel, channel is in db return error response', async () => {
    const leaveChannel = 'leaveChannel'
    const channelEntity = getExampleChannel({
      joined: false,
      channel: leaveChannel
    })

    await hb.db.channel.save(channelEntity)

    const { response, success } = await leave.execute({
      channel: messageChannel,
      user,
      params: {
        channel: leaveChannel
      }
    })

    expect(response).toBe('Not connected to channel')
    expect(success).toBe(false)
  })

  it('client leaves channel return success true', async () => {
    const channelToLeave = 'leaveChannel'
    jest.spyOn(hb.client, 'part').mockResolvedValue([channelToLeave])

    const { success, message } = await leave.methods.leaveChannel(
      channelToLeave
    )

    expect(success).toBe(true)
    expect(message).toBe('Successfully left the channel')
  })

  it('error occurs return success false', async () => {
    const channelToLeave = 'leaveChannel'
    jest.spyOn(hb.client, 'part').mockRejectedValue('Error')

    const { success, message } = await leave.methods.leaveChannel(
      channelToLeave
    )

    expect(success).toBe(false)
    expect(message).toBe('Could not leave the channel')
  })

  it('client leaves given channel return success response', async () => {
    const channelToLeave = 'leaveChannel'
    jest.spyOn(hb.client, 'part').mockResolvedValue([channelToLeave])

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: channelToLeave
      })
    )

    const { response, success } = await leave.execute({
      channel: messageChannel,
      user,
      params: { channel: channelToLeave }
    })

    expect(success).toBe(true)
    expect(response).toBe('Successfully left the channel')
  })

  it('client leaves given channel and updates joined to falsee', async () => {
    const channelToLeave = 'leaveChannel'
    jest.spyOn(hb.client, 'part').mockResolvedValue([channelToLeave])

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: channelToLeave
      })
    )

    await leave.execute({
      channel: messageChannel,
      user,
      params: {
        channel: channelToLeave
      }
    })

    const savedEntity = await hb.db.channel.findOneBy({
      channel: channelToLeave
    })

    expect(savedEntity!.joined).toBeFalsy()
  })

  it('update channel property sets joined to false', async () => {
    const channelToLeave = 'leaveChannel'

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: channelToLeave
      })
    )

    await leave.methods.updateChannelProperty(channelToLeave)

    const savedEntity = await hb.db.channel.findOneBy({
      channel: channelToLeave
    })

    expect(savedEntity!.joined).toBeFalsy()
  })

  it('update channel property updates 1 entity not both in database', async () => {
    const channelToLeave = 'leaveChannel'
    const otherChannel = 'otherChannel'

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: channelToLeave
      })
    )

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: otherChannel
      })
    )

    await leave.methods.updateChannelProperty(channelToLeave)

    const updatedEntity = await hb.db.channel.findOneBy({
      channel: channelToLeave
    })

    const otherEntity = await hb.db.channel.findOneBy({
      channel: otherChannel
    })

    expect(updatedEntity!.joined).toBeFalsy()
    expect(otherEntity!.joined).toBeTruthy()
  })

  it('leave channel me sets the channel to joined false', async () => {
    const channelToLeave = 'me'

    jest.spyOn(hb.client, 'part').mockResolvedValue([channelToLeave])

    await hb.db.channel.save(
      getExampleChannel({
        joined: true,
        channel: user.username
      })
    )

    await leave.execute({
      channel: messageChannel,
      user,
      params: { channel: channelToLeave }
    })

    const updatedEntity = await hb.db.channel.findOneBy({
      channel: user.username
    })
    expect(updatedEntity!.joined).toBeFalsy()
    expect(hb.client.part).toHaveBeenCalledWith(user.username!)
  })

  it('user has no permissions but uses not me as param channel return error', async () => {
    const channelToLeave = 'channelToLeave'
    user.permission = ChatPermissionLevel.USER

    const response = await leave.execute({
      channel: messageChannel,
      user,
      params: {
        channel: channelToLeave
      }
    })

    expect(response.success).toBe(false)
    expect(response.response).toBe(
      'You are not permitted to issue this command'
    )
  })
})
