import { BanEntity, TimeoutEntity, TwitchUserEntity } from "@db/entities"
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
      const time_ago = hb.utils.humanizeNow(currentTime)

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

      const expectedResponse = [
        `${messageUser.username} has been timeouted ${times} time(s)`,
        `${1} different channels`,
        `Last timeout ${time_ago} ago in ${channel} for ${hb.utils.humanize(
          duration
        )}`
      ]

      expect(success).toBeTrue()
      expect(response).toEqual(expectedResponse)
    })

    it('no params message user has two bans in channel', async () => {
      const currentTime = Date.now()
      const times = 2
      const duration = 50000
      const time_ago = hb.utils.humanizeNow(currentTime)

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

      const expectedResponse = [
        `${messageUser.username} has been timeouted ${times} time(s)`,
        `${1} different channels`,
        `Last timeout ${time_ago} ago in ${channel} for ${hb.utils.humanize(
          duration
        )}`
      ]

      expect(success).toBeTrue()
      expect(response).toEqual(expectedResponse)
    })

    it('user is given return overall bans for user', async () => {
      const username = 'givenUser'
      const timeoutChannel = 'timeoutChannel'
      const channels = 1
      const amount = 1
      const currentTime = Date.now()
      const time_ago = hb.utils.humanizeNow(currentTime)
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

      const expectedResponse = [
        `${username} has been timeouted ${amount} time(s)`,
        `${channels} different channels`,
        `Last timeout ${time_ago} ago in ${timeoutChannel} for ${hb.utils.humanize(
          duration
        )}`
      ]

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