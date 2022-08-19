import { DenyCommand } from "@src/commands/cmd/deny"
import { SuggestionStatus } from "@src/db/entities/suggestion.entity"
import { clearDb } from "@test-utils/clear"
import { disconnectDatabase } from '@test-utils/disconnect'
import {
  getExampleTwitchUserEntity,
  getExampleTwitchUserState
} from '@test-utils/example'
import { setupDatabase } from '@test-utils/setup-db'

describe('deny', () => {
  let deny: DenyCommand

  beforeAll(async () => {
    await setupDatabase()
  })

  beforeEach(async () => {
    await clearDb()
    deny = new DenyCommand()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('execute', () => {
    const user = getExampleTwitchUserState({})
    const channel = 'channel'

    it('id is undefined return error', async () => {
      const { response, success } = await deny.execute({
        message: [],
        channel,
        user
      })

      expect(response).toBe('no id given')
      expect(success).toBe(false)
    })

    it('id does not exist return error', async () => {
      const id = '1'

      jest.spyOn(deny.methods, 'updateSuggestion').mockResolvedValue(false)
      const { response, success } = await deny.execute({
        message: [id],
        channel,
        user
      })

      expect(response).toBe('suggestion does not exist')
      expect(success).toBe(false)

      expect(deny.methods.updateSuggestion).toHaveBeenCalled()
    })

    it('suggestion does exist invoke update function', async () => {
      const id = '1'

      jest.spyOn(deny.methods, 'updateSuggestion').mockResolvedValue(true)
      const { response, success } = await deny.execute({
        message: [id],
        user,
        channel
      })

      expect(response).toBe(`Successfully updated suggestion with id ${id}`)
      expect(success).toBe(true)
      expect(deny.methods.updateSuggestion).toHaveBeenCalled()
    })
  })

  describe('udpate suggestion', () => {
    const id = '1'
    const reason = 'reason'
    const user = getExampleTwitchUserEntity({})

    it('id does not exist return false', async () => {
      const result = await deny.methods.updateSuggestion(id, reason)

      expect(result).toBe(false)
    })

    it('id does exist update status of entity to denied', async () => {
      await hb.db.user.save(user)
      await hb.db.suggestion.save({
        id: Number(id),
        user: user,
        date: Date.now(),
        suggestion: 'something'
      })
      const result = await deny.methods.updateSuggestion(id, reason)

      expect(result).toBe(true)

      const updatedSuggestion = await hb.db.suggestion.findOneBy({
        id: Number(id)
      })

      expect(updatedSuggestion?.status).toBe(SuggestionStatus.DENIED)
      expect(updatedSuggestion?.reason).toBe(reason)
    })
  })
})