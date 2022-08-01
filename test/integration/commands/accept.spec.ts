import { TwitchUserState } from "@src/client/types"
import { AcceptCommand } from "@src/commands/cmd/accept"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import { getExampleTwitchUserState } from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('accept command', () => {
  let user: TwitchUserState
  let accept: AcceptCommand
  const channel = 'messageChannel'
  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    accept = new AcceptCommand()
    await clearDb(hb.db.dataSource)
    user = getExampleTwitchUserState({})
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    it('id is not defined return error resonse', async () => {
      const { response, success } = await accept.execute({
        channel: channel,
        message: [],
        user: user
      })

      expect(response).toBe('id missing')
      expect(success).toBeFalse()
    })
  })
})
