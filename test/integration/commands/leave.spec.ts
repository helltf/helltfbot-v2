import { ChatUserstate } from 'tmi.js'
import { leave } from '../../../commands/cmd/leave.js'
import { getExampleUserState } from '../../../spec/examples/user.js'
import { clearDb } from '../../test-utils/clear.js'
import { disconnectDatabase } from '../../test-utils/disconnect.js'
import { getExampleChannel } from '../../test-utils/example.js'
import { setupDatabase } from '../../test-utils/setup-db.js'

fdescribe('test leave command', () => {
  console.log(process.env)
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
    let message = ['']

    let {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('You need to define a channel')
    expect(success).toBeFalse()
  })

  it('client is not connected to channel, channel is not in db return error response', async () => {
    let message = ['leaveChannel']

    let {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Not connected to channel')
    expect(success).toBeFalse()
  })

  it('client is not connected to channel, channel is in db return error response', async () => {
    let leaveChannel = 'leaveChannel'
    let message = [leaveChannel]
    let channelEntity = getExampleChannel({
      joined: false,
      channel: leaveChannel
    })

    await hb.db.channelRepo.save(channelEntity)

    let {
      channel: responseChannel,
      response,
      success
    } = await leave.execute(messageChannel, user, message)

    expect(responseChannel).toBe(messageChannel)
    expect(response).toBe('Not connected to channel')
    expect(success).toBeFalse()
  })
})
