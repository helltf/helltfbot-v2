import { BanCheckCommand } from "@src/commands/cmd/bancheck"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from "@test-utils/disconnect"
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

  describe('methods', () => {
    describe('get bans', () => {
      it('user is not banned return empty list', async () => {
        const user = 'user'
        const channel = 'channel'

        const result = await bancheck.method.getBans(user, channel)

        expect(result).toHaveLength(0)
      })

      it('user has one ban in channel return list with one item', async () => {
        const user = 'user'
        const channel = 'channel'
        await hb.db.ban.save({ at: Date.now(), user, channel })

        const result = await bancheck.method.getBans(user, channel)

        expect(result).toHaveLength(1)
      })
      it('user has one ban in channel and one in other channel return one item', async () => {
        const user = 'user'
        const channel = 'channel'

        await hb.db.save({ at: Date.now(), user, channel })
        await hb.db.save({ at: Date.now(), user, channel: 'channel2' })

        const result = await bancheck.method.getBans(user, channel)

        expect(result).toHaveLength(1)
      })
    })
  })
})
