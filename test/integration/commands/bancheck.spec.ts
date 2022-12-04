import { BanEntity } from "@db/entities"
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
    await clearDb()
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

    it('user is given invoke method with given user', async () => {
      const givenUser = 'givenUser'
      jest.spyOn(bancheck.methods, 'getBans').mockResolvedValue([])

      const result = await bancheck.execute({
        message: [givenUser],
        user,
        channel
      })

      expect(result.success).toBe(true)
      expect(result.response).toBe('No bans recorded')
      expect(bancheck.methods.getBans).toHaveBeenCalledWith(
        givenUser,
        undefined
      )
    })

    it('user and channel given return specific bans for channel', async () => {
      const givenUser = 'givenUser'
      const givenChannel = 'givenChannel'
      const expectedResponse = `This user has never been banned in this channel`
      jest.spyOn(bancheck.methods, 'getBans').mockResolvedValue([])

      const result = await bancheck.execute({
        message: [givenUser, givenChannel],
        user,
        channel
      })

      expect(result.success).toBe(true)
      expect(result.response).toBe(expectedResponse)
      expect(bancheck.methods.getBans).toHaveBeenCalledWith(
        givenUser,
        givenChannel
      )
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

      it('user has two bans return both without channel param', async () => {
        const user = 'user'
        const channel = 'channel'
        await hb.db.ban.save({ at: Date.now(), user, channel })
        await hb.db.ban.save({ at: Date.now(), user, channel: 'channel2' })

        const result = await bancheck.methods.getBans(user, undefined)

        expect(result).toHaveLength(2)
      })

      it('user has two bans return ordered by time', async () => {
        const user = 'user'
        const channel = 'channel'
        const channel2 = 'channel2'
        await hb.db.ban.save([
          { at: 1, user, channel },
          { at: 2, user, channel: channel2 }
        ])

        const result = await bancheck.methods.getBans(user, undefined)

        expect(result[0].channel).toBe(channel2)
        expect(result[1].channel).toBe(channel)
      })
    })

    describe('get ban message', () => {
      const username = 'username'
      it('no channel message user has no bans return message', () => {
        const result = bancheck.methods.getBanMessage(
          [] as BanEntity[],
          username,
          false
        )

        expect(result).toBe('No bans recorded')
      })

      it('channel given but user has no bans return message', () => {
        const result = bancheck.methods.getBanMessage(
          [] as BanEntity[],
          username,
          true
        )

        expect(result).toBe('This user has never been banned in this channel')
      })

      it('no channel given user has one ban return message', () => {
        const bans = [getExampleBanEntity({})]
        const expectedMessage = [
          `@${username} has ${bans.length} ${hb.utils.plularizeIf(
            'ban',
            bans.length
          )} recorded`,
          `Last ban ${hb.utils.humanizeNow(bans[0].at)} ago in ${
            bans[0].channel
          }`
        ]

        const result = bancheck.methods.getBanMessage(bans, username, false)

        expect(result).toStrictEqual(expectedMessage)
      })

      it('channel given user has one ban return message', () => {
        const bans = [getExampleBanEntity({})]
        const expectedMessage = [
          `@${username} has been banned ${bans.length} ${hb.utils.plularizeIf(
            'time',
            bans.length
          )} in this channel`,
          `Last ban ${hb.utils.humanizeNow(bans[0].at)} ago`
        ]

        const result = bancheck.methods.getBanMessage(bans, username, true)

        expect(result).toStrictEqual(expectedMessage)
      })
    })
  })
})
