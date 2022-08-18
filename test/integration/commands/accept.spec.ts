import { TwitchUserState } from "@src/client/types"
import { AcceptCommand } from "@src/commands/cmd/accept"
import { SuggestionStatus } from "@src/db/entities/suggestion.entity"
import { clearDb } from '@test-utils/clear'
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
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
    it('id is not defined return error response', async () => {
      const { response, success } = await accept.execute({
        channel: channel,
        message: [],
        user: user
      })

      expect(response).toBe('id missing')
      expect(success).toBe(false)
    })

    it('id does not exist return error response', async () => {
      const id = 1

      const { response, success } = await accept.execute({
        channel: channel,
        message: [`${id}`],
        user: user
      })

      expect(response).toBe('suggestion does not exist')
      expect(success).toBe(false)
    })
  })

  describe('update suggestion', () => {
    it('no suggestion existing return false', async () => {
      const id = 1

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(false)
    })

    it('suggestion existing return true', async () => {
      const id = 1
      const user = getExampleTwitchUserEntity({})

      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: id,
        date: Date.now(),
        suggestion: '',
        user: user
      })

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(true)
    })

    it('multiple suggestions existing update correct', async () => {
      const id = 1
      const user = getExampleTwitchUserEntity({})

      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: id,
        date: Date.now(),
        suggestion: '',
        user: user
      })

      await hb.db.suggestion.save({
        id: id + 1,
        date: Date.now(),
        suggestion: '',
        user: user
      })

      const success = await accept.methods.updateSuggestion(id.toString(), '')

      expect(success).toBe(true)

      const updatedEntity = await hb.db.suggestion.findOneBy({ id: id })

      expect(updatedEntity?.status).toBe(SuggestionStatus.ACCEPTED)
    })
  })
})
