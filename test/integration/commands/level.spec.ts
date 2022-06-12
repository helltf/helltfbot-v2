import { LevelCommand } from '@src/commands/cmd/level'
import { PermissionLevel } from '@src/utilities/permission/types'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import { getExampleTwitchUserEntity } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('test level command', () => {
  let level: LevelCommand
  const permissionsLevel = Object.keys(PermissionLevel)
    .filter(v => !isNaN(Number(v)))
    .map(v => Number(v))

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    level = new LevelCommand()
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('get database perms', () => {
    it('user is not in database return 0', async () => {
      const id = 1

      const perms = await level.methods.getDatabasePermissions(id)

      expect(perms).toBe(PermissionLevel.USER)
    })

    permissionsLevel.forEach(lvl => {
      it(`user is in db with ${lvl} perms return ${lvl} perms`, async () => {
        const user = getExampleTwitchUserEntity({
          permission: lvl
        })

        await hb.db.userRepo.save(user)

        const permission = await level.methods.getDatabasePermissions(user.id)

        expect(permission).toBe(lvl)
      })
    })
  })
})
