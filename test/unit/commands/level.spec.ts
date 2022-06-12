import { LevelCommand } from "@src/commands/cmd/level"
import { ChatPermissionLevel, GlobalPermissionLevel } from "@src/utilities/permission/types"
import { getExampleTwitchUserState } from '@test-utils/example'
import { setup } from '@test-utils/setup'

fdescribe('test level command', () => {
  setup()
  let level: LevelCommand
  const chatPermissionLevels = hb.utils.getEnumValues(ChatPermissionLevel)
  const globalPermissionLevels = hb.utils.getEnumValues(GlobalPermissionLevel)

  const combinations = hb.utils.generateAllCombinations(
    chatPermissionLevels,
    chatPermissionLevels
  )

  beforeEach(async () => {
    setup()
    level = new LevelCommand()
  })

  describe('get user perms', () => {
    chatPermissionLevels.forEach(lvl => {
      it(`user has permissions with lvl ${lvl} return ${lvl}`, () => {
        const user = getExampleTwitchUserState({
          permission: lvl
        })

        const permission = level.methods.getUserPermissions(user)

        expect(permission).toBe(lvl)
      })
    })

    it('no permissions level is set return 0', () => {
      const user = getExampleTwitchUserState({
        permission: undefined
      })

      const permission = level.methods.getUserPermissions(user)

      expect(permission).toBe(ChatPermissionLevel.USER)
    })
  })

  describe('map to name', () => {
    chatPermissionLevels.forEach(lvl => {
      it(`chatpermission lvl ${lvl} returns corrosponding ${ChatPermissionLevel[lvl]} in lower case`, () => {
        const result = level.methods.mapToPermissionName(lvl)
        const expectedResult = ChatPermissionLevel[lvl].toLowerCase()

        expect(result).toBe(expectedResult)
      })
    })

    globalPermissionLevels.forEach(lvl => {
      it(`chatpermission lvl ${lvl} returns corrosponding ${ChatPermissionLevel[lvl]} in lower case`, () => {
        const result = level.methods.mapToPermissionName(lvl)
        const expectedResult = ChatPermissionLevel[lvl].toLowerCase()

        expect(result).toBe(expectedResult)
      })
    })
  })

  combinations.forEach(([userPerm, dbPerm]) => {
    it(`userPerm is ${ChatPermissionLevel[userPerm]} and dbperm is ${GlobalPermissionLevel[dbPerm]} return correct message`, async () => {
      const channel = 'channel'
      const user = getExampleTwitchUserState({
        permission: userPerm
      })
      spyOn(level.methods, 'getUserPermissions').and.returnValue(userPerm)
      spyOn(level.methods, 'getDatabasePermissions').and.resolveTo(dbPerm)

      const {
        channel: responseChannel,
        response,
        success
      } = await level.execute(channel, user, [])
      const expectedResponse = `Permissions for ${
        user.username
      } are ${level.methods.mapToPermissionName(
        userPerm
      )} for this channel and ${level.methods.mapToPermissionName(
        dbPerm
      )} overall`

      expect(channel).toBe(responseChannel)
      expect(response).toBe(expectedResponse)
      expect(success).toBeTrue()
    })
  })
})


