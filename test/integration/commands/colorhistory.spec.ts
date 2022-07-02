import { TwitchUserState } from "@src/client/types"
import { ColorHistoryCommand } from "@src/commands/cmd/colorhistory"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { saveUserStateAsUser } from '@test-utils/save-user'
import { setupDatabase } from '@test-utils/setup-db'

fdescribe('colorhistory command', () => {
  let user: TwitchUserState
  let messageChannel: string
  let colorhistory: ColorHistoryCommand
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    colorhistory = new ColorHistoryCommand()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
    user = getExampleTwitchUserState({})
    messageChannel = 'messageChannel'
    await clearDb(hb.db.dataSource)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it('user has no records return error', async () => {
    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      message: [],
      user
    })

    expect(response).toBe('no history found')
    expect(success).toBeFalse()
  })

  it('user has stats return history of colors', async () => {
    const historyData = {
      history: ['abc'],
      lastChange: Date.now()
    }

    spyOn(colorhistory.methods, 'getColorHistory').and.resolveTo(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      message: [],
      user
    })

    expect(response).toEqual([
      `${user.username}s recent colors are ${historyData.history[0]}`,
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBeTrue()
  })

  it('user has stats return multiple colors', async () => {
    const historyData = {
      history: ['abc', 'cde', 'fge'],
      lastChange: Date.now()
    }

    spyOn(colorhistory.methods, 'getColorHistory').and.resolveTo(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      message: [],
      user
    })

    expect(response).toEqual([
      `${user.username}s recent colors are ${historyData.history[0]}`,
      historyData.history[1],
      historyData.history[2],
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBeTrue()
  })

  it('user is provided no stats return error', async () => {
    const customUser = 'customuser'
    const historyData = {
      history: ['abc', 'cde', 'fge'],
      lastChange: Date.now()
    }

    spyOn(colorhistory.methods, 'getColorHistory')
      .withArgs(customUser)
      .and.resolveTo(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      message: [customUser],
      user
    })

    expect(response).toEqual([
      `${customUser}s recent colors are ${historyData.history[0]}`,
      historyData.history[1],
      historyData.history[2],
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBeTrue()
  })

  describe('get color history method', () => {
    it('username has no stats return undefined', async () => {
      const result = await colorhistory.methods.getColorHistory(user.username!)

      expect(result).toBeUndefined()
    })

    it('user has stats return stats', async () => {
      const userEntity = getExampleTwitchUserEntity({})
      const history = ['abc']
      const change = Date.now()

      await hb.db.userRepo.save(userEntity)
      await hb.db.colorRepo.save({
        change_timestamp: change,
        history: history,
        register_timestamp: Date.now(),
        user: {
          id: userEntity.id
        }
      })

      const result = await colorhistory.methods.getColorHistory(user.username!)

      const expectedResult: { history: string[]; lastChange: number } = {
        history: history,
        lastChange: change
      }

      expect(result).toEqual(expectedResult)
    })
  })
})