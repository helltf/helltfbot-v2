import { BanCheckCommand } from "@src/commands/cmd/bancheck"
import { MessageType } from "@src/commands/types"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleBanEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('ban check', () => {
  let bancheck: BanCheckCommand
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    bancheck = new BanCheckCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'
    it('command runs as whisper and channel is undefined return error', async () => {
      const result = await bancheck.execute({
        channel,
        user,
        message: [],
        type: MessageType.WHISPER
      })

      expect(result.success).toBe(false)
      expect(result.response).toBe('Channel is required in whisper context')
    })

    it('user and channel is not defined invoke get bans with user', async () => {
      const expectedResponse = 'No bans recorded'
      jest.spyOn(bancheck.methods, 'getBans').mockResolvedValue([])
      const result = await bancheck.execute({
        channel,
        user,
        message: []
      })

      expect(bancheck.methods.getBans).toHaveBeenCalledWith(
        user.username,
        undefined
      )
      expect(result.response).toBe(expectedResponse)
      expect(result.success).toBe(true)
    })

    it('user has one ban for any channel return info message', async () => {
      const ban = getExampleBanEntity({})
      const bans = [ban]
      const expectedResponse = [
        `@${user.username} has ${bans.length} ${hb.utils.plularizeIf(
          'ban',
          bans.length
        )} recorded`,
        `Last ban ${hb.utils.humanizeNow(ban.at)} ago in ${ban.channel}`
      ]
      jest.spyOn(bancheck.methods, 'getBans').mockResolvedValue(bans)

      const result = await bancheck.execute({
        channel,
        user,
        message: []
      })

      expect(result.response).toStrictEqual(expectedResponse)
      expect(result.success).toBe(true)
    })
  })

  describe('methods', () => {
    describe('get bans', () => {
      it('user is not banned return empty list', async () => {
        const user = 'user'
        const channel = 'channel'

        const result = await bancheck.methods.getBans(user, channel)

        expect(result).toHaveLength(0)
      })

      it('user has one ban in channel return list with one item', async () => {
        const user = 'user'
        const channel = 'channel'
        await hb.db.ban.save({ at: Date.now(), user, channel })

        const result = await bancheck.methods.getBans(user, channel)

        expect(result).toHaveLength(1)
      })
      it('user has one ban in channel and one in other channel return one item', async () => {
        const user = 'user'
        const channel = 'channel'

        await hb.db.ban.save({ at: Date.now(), user, channel })
        await hb.db.ban.save({ at: Date.now(), user, channel: 'channel2' })

        const result = await bancheck.methods.getBans(user, channel)

        expect(result).toHaveLength(1)
      })
    })
  })
})
