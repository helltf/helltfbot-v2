import { TwitchUserState } from "@src/client/types"
import { ColorHistoryCommand } from "@src/commands/cmd/colorhistory"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('colorhistory command', () => {
  let user: TwitchUserState
  let messageChannel: string
  let colorhistory: ColorHistoryCommand
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    colorhistory = new ColorHistoryCommand()

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
      params: {},
      user
    })

    expect(response).toBe('no history found')
    expect(success).toBe(false)
  })

  it('user has stats return history of colors', async () => {
    const historyData = {
      history: ['abc'],
      lastChange: Date.now()
    }
    jest
      .spyOn(colorhistory.methods, 'getColorHistory')
      .mockResolvedValue(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      params: {},
      user
    })

    expect(response).toEqual([
      `${user.username}s recent colors are ${historyData.history[0]}`,
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBe(true)
  })

  it('user has stats return multiple colors', async () => {
    const historyData = {
      history: ['abc', 'cde', 'fge'],
      lastChange: Date.now()
    }

    jest
      .spyOn(colorhistory.methods, 'getColorHistory')
      .mockResolvedValue(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      params: {},
      user
    })

    expect(response).toEqual([
      `${user.username}s recent colors are ${historyData.history[0]}`,
      historyData.history[1],
      historyData.history[2],
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBe(true)
  })

  it('user is provided no stats return error', async () => {
    const customUser = 'customuser'
    const historyData = {
      history: ['abc', 'cde', 'fge'],
      lastChange: Date.now()
    }

    jest
      .spyOn(colorhistory.methods, 'getColorHistory')
      .mockResolvedValue(historyData)

    const { response, success } = await colorhistory.execute({
      channel: messageChannel,
      params: { user: customUser },
      user
    })

    expect(response).toEqual([
      `${customUser}s recent colors are ${historyData.history[0]}`,
      historyData.history[1],
      historyData.history[2],
      `changed ${hb.utils.humanizeNow(historyData.lastChange)} ago`
    ])
    expect(success).toBe(true)
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

      await hb.db.user.save(userEntity)
      await hb.db.color.save({
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
