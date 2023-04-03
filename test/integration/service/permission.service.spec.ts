import { GlobalPermissionLevel } from '@src/services/permissions.service'
import { PermissionService } from '@src/services/permissions.service'
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import { getExampleTwitchUserEntity } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('permission  utils', () => {
  let permission: PermissionService

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    permission = new PermissionService()
    await clearDb()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('get db perms', () => {
    it('user does not exist return user perms', async () => {
      const perms = await permission.getDbPermissions(1)

      expect(perms).toBe(GlobalPermissionLevel.USER)
    })

    it('user exists return its permission', async () => {
      const userperm = GlobalPermissionLevel.DEV

      const user = getExampleTwitchUserEntity({ permission: userperm })
      await hb.db.user.save(user)

      const perms = await permission.getDbPermissions(user.id)

      expect(perms).toBe(userperm)
    })
  })
})
