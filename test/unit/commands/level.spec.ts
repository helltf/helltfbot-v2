import { LevelCommand } from "@src/commands/cmd/level"
import { PermissionLevel } from "@src/utilities/permission/types"
import { getExampleTwitchUserState } from "@test-utils/example"

describe('test level command', () => {
  let level: LevelCommand
  const permissionsLevel = Object.keys(PermissionLevel)
    .filter(v => !isNaN(Number(v)))
    .map(v => Number(v))

  beforeEach(async () => {
    level = new LevelCommand()
  })

  describe('get user perms', () => {
    permissionsLevel.forEach(lvl => {
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

      expect(permission).toBe(PermissionLevel.USER)
    })
  })

  fdescribe('map to name', () => {
    permissionsLevel.forEach(lvl => {
      it(`permission lvl ${lvl} returns corrosponding ${PermissionLevel[lvl]} in lower case`, () => {
        const result = level.methods.mapToPermissionName(lvl)
        const expectedResult = PermissionLevel[lvl].toLowerCase()

        expect(result).toBe(expectedResult)
      })
    })
  })
})


