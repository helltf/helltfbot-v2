import { TimeoutEntity } from "@db/entities"
import { TwitchUserState } from "@src/client/types"
import { TimeoutsCommand } from "@src/commands/cmd/timeouts"
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import { getExampleTwitchUserState } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

fdescribe('test suggest command', () => {
  let messageUser: TwitchUserState
  let timeouts: TimeoutsCommand
  const channel = 'channel'
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    messageUser = getExampleTwitchUserState({})
    timeouts = new TimeoutsCommand()
    await clearDb(hb.db.dataSource)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    it('no param given return no bans because user has no bans', async () => {
      const { response, success } = await timeouts.execute({
        channel: channel,
        message: [],
        user: messageUser
      })

      expect(success).toBeTrue()
      expect(response).toBe('No timeout found')
    })

    it('no params message user has ban in channel', async () => {
      const currentTime = Date.now()
      const times = 1
      const duration = 50000
      const timeAgo = hb.utils.humanizeNow(currentTime)

      await saveTimeout({
        at: currentTime,
        channel: channel,
        user: messageUser.username,
        duration
      })

      const { response, success } = await timeouts.execute({
        channel: channel,
        message: [],
        user: messageUser
      })

      const expectedResponse = getFullResponse({
        username: messageUser.username!,
        amount: times,
        channels: 1,
        duration: duration,
        timeAgo: timeAgo,
        timeoutChannel: channel
      })

      expect(success).toBeTrue()
      expect(response).toEqual(expectedResponse)
    })

    it('no params message user has two bans in channel', async () => {
      const currentTime = Date.now()
      const times = 2
      const duration = 50000
      const timeAgo = hb.utils.humanizeNow(currentTime)
      const channels = 1

      await saveTimeout({
        at: currentTime,
        channel: channel,
        user: messageUser.username,
        duration
      })

      await saveTimeout({
        at: currentTime - 5000,
        channel: channel,
        user: messageUser.username,
        duration
      })

      const { response, success } = await timeouts.execute({
        channel: channel,
        message: [],
        user: messageUser
      })

      const expectedResponse = getFullResponse({
        username: messageUser.username!,
        amount: times,
        channels: channels,
        duration: duration,
        timeAgo: timeAgo,
        timeoutChannel: channel
      })

      expect(success).toBeTrue()
      expect(response).toEqual(expectedResponse)
    })

    it('user is given return overall bans for user', async () => {
      const username = 'givenUser'
      const timeoutChannel = 'timeoutChannel'
      const channels = 1
      const amount = 1
      const currentTime = Date.now()
      const timeAgo = hb.utils.humanizeNow(currentTime)
      const duration = 50000

      await saveTimeout({
        at: currentTime,
        channel: timeoutChannel,
        user: username,
        duration: duration
      })

      const { response, success } = await timeouts.execute({
        user: messageUser,
        channel: channel,
        message: [username]
      })

      const expectedResponse = getFullResponse({
        username: username,
        amount: amount,
        channels: channels,
        duration: duration,
        timeAgo: timeAgo,
        timeoutChannel: timeoutChannel
      })

      expect(response).toEqual(expectedResponse)
      expect(success).toBeTrue()
    })

    it('user and channel is given return no timeouts for channel', async () => {
      const givenUser = 'givenUser'
      const givenChannel = 'givenChannel'

      const { response, success } = await timeouts.execute({
        channel: channel,
        message: [givenUser, givenChannel],
        user: messageUser
      })

      expect(response).toBe('No timeout found')
      expect(success).toBeTrue()
    })

    it('user and channel is given return 1 timeout for channel', async () => {
      const givenUser = 'givenUser'
      const givenChannel = 'givenChannel'
      const duration = 50000
      const currentTime = Date.now()

      await saveTimeout({
        at: currentTime,
        channel: givenChannel,
        duration: duration,
        user: givenUser
      })

      const { response, success } = await timeouts.execute({
        channel: channel,
        message: [givenUser, givenChannel],
        user: messageUser
      })

      const expectedResponse = getChannelResponse({
        amount: 1,
        channel: givenChannel,
        duration: duration,
        timeAgo: currentTime,
        username: givenUser
      })

      expect(response).toEqual(expectedResponse)
      expect(success).toBeTrue()
    })
  })
})

async function saveTimeout(timeout: Partial<TimeoutEntity>) {
  await hb.db.timeout.save({
    channel: timeout.channel,
    duration: timeout.duration,
    at: timeout.at ?? Date.now(),
    user: timeout.user
  })
}

function getChannelResponse({
  amount,
  channel,
  duration,
  timeAgo,
  username
}: ChannelResponseContext): string[] {
  return [
    `${username} has been timeouted ${amount} times in channel ${channel}`,
    `Last timeout: ${hb.utils.humanizeNow(timeAgo)} ago for ${hb.utils.humanize(
      duration
    )}`
  ]
}

function getFullResponse({
  amount,
  channels,
  duration,
  timeAgo,
  timeoutChannel,
  username
}: FullResponseContext): string[] {
  return [
    `${username} has been timeouted ${amount} time(s)`,
    `${channels} different channels`,
    `Last timeout ${timeAgo} ago in ${timeoutChannel} for ${hb.utils.humanize(
      duration
    )}`
  ]
}

interface FullResponseContext {
  username: string
  amount: number
  channels: number
  timeAgo: string
  timeoutChannel: string
  duration: number
}

interface ChannelResponseContext {
  username: string
  amount: number
  channel: string
  timeAgo: number
  duration: number
}