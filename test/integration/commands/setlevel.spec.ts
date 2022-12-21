import { SetLevelCommand } from "@src/commands/cmd/setlevel"
import { GlobalPermissionLevel } from "@src/utilities/permission/types"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setup } from '@test-utils/setup'
import { setupDatabase } from '@test-utils/setup-db'

describe('setlevel command', () => {
  let setlevel: SetLevelCommand
  setup()
  beforeAll(async () => {
    await setupDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  beforeEach(async () => {
    await clearDb(hb.db.dataSource)
    setlevel = new SetLevelCommand()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('user is equal to input return error', async () => {
      const { response, success } = await setlevel.execute({
        channel,
        params: { user: user.username!, level: 'dev' },
        user
      })

      expect(success).toBe(false)
      expect(response).toBe('Cannot change your own role')
    })

    it('level is not valid return error', async () => {
      const { response, success } = await setlevel.execute({
        channel,
        user,
        params: { user: 'user2', level: 'not existing' }
      })

      expect(success).toBe(false)
      expect(response).toBe('permission level does not exist')
    })

    it('user is not existing return error', async () => {
      const { response, success } = await setlevel.execute({
        channel,
        user,
        params: { user: 'not existing', level: 'dev' }
      })

      expect(success).toBe(false)
      expect(response).toBe('User not found')
    })
  })

  describe('methods', () => {
    const globalPermissions = hb.utils.getEnumValues(GlobalPermissionLevel)
    const user = getExampleTwitchUserEntity({})

    globalPermissions.forEach(perm => {
      it(`update role updates user for ${perm} and return success`, async () => {
        await hb.db.user.save(user)

        const success = await setlevel.methods.updateRole(user.name, perm)

        const updatedEntity = await hb.db.user.findOneBy({
          name: user.name
        })!

        expect(success).toBe(true)
        expect(updatedEntity?.permission).toBe(perm)
      })
    })

    it('user does not exist return false', async () => {
      const successs = await setlevel.methods.updateRole(
        'user',
        GlobalPermissionLevel.ADMIN
      )

      expect(successs).toBe(false)
    })
  })
})
